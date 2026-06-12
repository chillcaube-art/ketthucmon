import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Alert, Image } from 'react-native';
import { Product, Category, initDatabase, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct, searchProductsByNameOrCategory } from '../../database';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function HomeTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const params = useLocalSearchParams();

  useEffect(() => {
    initDatabase(() => {
      loadData();
    });
  }, []);

  useEffect(() => {
    if (params.categoryId) {
      setCategoryId(params.categoryId.toString());
    }
  }, [params.categoryId]);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    const prods = await fetchProducts();
    setProducts(prods.reverse());
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
    } else {
      const results = await searchProductsByNameOrCategory(searchQuery);
      setProducts(results.reverse());
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!name || !price || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Giá, ID Danh mục)');
      return;
    }
    const catIdNum = parseInt(categoryId);
    const priceNum = parseFloat(price);

    if (isNaN(catIdNum) || isNaN(priceNum)) {
      Alert.alert('Lỗi', 'Giá và ID Danh mục phải là số');
      return;
    }

    if (editingId) {
      await updateProduct({ id: editingId, name, price: priceNum, img: img || 'hinh1.jpg', categoryId: catIdNum });
      setEditingId(null);
    } else {
      await addProduct({ name, price: priceNum, img: img || 'hinh1.jpg', categoryId: catIdNum });
    }

    setName('');
    setPrice('');
    setImg('');
    setCategoryId('');
    loadData();
  };

  const handleEdit = (item: Product) => {
    setName(item.name);
    setPrice(item.price.toString());
    setImg(item.img);
    setCategoryId(item.categoryId.toString());
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          loadData();
        }
      }
    ]);
  };

  const getCategoryName = (id: number) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'Không rõ';
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productText}>Giá: {item.price} VND</Text>
        <Text style={styles.productText}>Loại: {getCategoryName(item.categoryId)} (ID: {item.categoryId})</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={styles.productText}>Hình ảnh: </Text>
          {item.img && item.img.startsWith('http') ? (
            Platform.OS === 'web' ? (
              <img src={item.img} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} crossOrigin="anonymous" />
            ) : (
              <Image source={{ uri: item.img }} style={{ width: 40, height: 40, borderRadius: 4 }} />
            )
          ) : (
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.productText, { flex: 1 }]}>{item.img}</Text>
          )}
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => handleEdit(item)}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.headerTitle}>Quản lý Sản Phẩm (SQLite)</Text>

              {/* Search */}
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm theo tên sản phẩm hoặc loại..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.btnSearch} onPress={handleSearch}>
                  <Text style={styles.btnText}>TÌM</Text>
                </TouchableOpacity>
              </View>

              {/* Add Form */}
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tên sản phẩm"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Giá"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                <View style={styles.imagePickerRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                    placeholder="Hình ảnh (URL hoặc Chọn ảnh)"
                    placeholderTextColor="#888"
                    value={img}
                    onChangeText={setImg}
                  />
                  <TouchableOpacity style={styles.btnPickImage} onPress={pickImage}>
                    <Text style={styles.btnTextBlack}>Chọn ảnh</Text>
                  </TouchableOpacity>
                </View>
                {img ? (
                  <View style={{ alignItems: 'center', marginBottom: 12 }}>
                    {img.startsWith('http') || img.startsWith('file') ? (
                      Platform.OS === 'web' ? (
                        <img src={img} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} crossOrigin="anonymous" />
                      ) : (
                        <Image source={{ uri: img }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                      )
                    ) : (
                      <Text style={{ color: '#666', fontStyle: 'italic' }}>{img}</Text>
                    )}
                  </View>
                ) : null}
                <TextInput
                  style={styles.input}
                  placeholder="ID Danh mục (1-Áo, 2-Giày, ...)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={categoryId}
                  onChangeText={setCategoryId}
                />
                <TouchableOpacity style={styles.btnAdd} onPress={handleAddOrUpdate}>
                  <Text style={styles.btnText}>{editingId ? 'CẬP NHẬT' : 'THÊM'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  searchRow: { flexDirection: 'row', marginBottom: 20 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    color: '#000'
  },
  btnSearch: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 4
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  formCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    color: '#000'
  },
  imagePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  btnPickImage: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    borderRadius: 4
  },
  btnTextBlack: {
    fontWeight: 'bold',
    color: '#333'
  },
  btnAdd: {
    backgroundColor: '#2196F3',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  productInfo: { flex: 1, paddingRight: 10 },
  productName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#333' },
  productText: { fontSize: 14, color: '#555', marginBottom: 2 },
  actionButtons: { justifyContent: 'center' },
  btnEdit: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center'
  },
  btnDelete: {
    backgroundColor: '#F44336',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center'
  }
});
