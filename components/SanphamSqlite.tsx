import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {
  initDatabase,
  fetchCategories,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  Product,
  Category,
  searchProductsByNameOrCategory,
} from '../database';

const SanphamSqlite = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState('');
  
  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await loadCategoriesAndProducts();
    };
    initDatabase(loadData);
  }, []);

  const loadCategoriesAndProducts = async () => {
    const fetchedCategories = await fetchCategories();
    setCategories(fetchedCategories);
    const fetchedProducts = await fetchProducts();
    setProducts(fetchedProducts);
  };

  const handleSearch = async () => {
    if (keyword.trim() === '') {
      await loadCategoriesAndProducts();
    } else {
      const results = await searchProductsByNameOrCategory(keyword);
      setProducts(results);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !img || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const priceNum = parseFloat(price);
    const catIdNum = parseInt(categoryId, 10);

    if (isNaN(priceNum) || isNaN(catIdNum)) {
      Alert.alert('Lỗi', 'Giá và ID Danh mục phải là số');
      return;
    }

    if (editingId) {
      // Update
      await updateProduct({
        id: editingId,
        name,
        price: priceNum,
        img,
        categoryId: catIdNum,
      });
      setEditingId(null);
    } else {
      // Add
      await addProduct({
        name,
        price: priceNum,
        img,
        categoryId: catIdNum,
      });
    }

    // Reset form
    setName('');
    setPrice('');
    setImg('');
    setCategoryId('');
    
    // Refresh list
    await loadCategoriesAndProducts();
  };

  const handleEdit = (item: Product) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setImg(item.img);
    setCategoryId(item.categoryId.toString());
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá sản phẩm này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            await loadCategoriesAndProducts();
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text>Giá: {item.price} VND</Text>
          <Text>Loại: {category ? category.name : 'Unknown'} (ID: {item.categoryId})</Text>
          <Text>Hình ảnh: {item.img}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={[styles.actionButton, styles.editButton]}>
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.actionText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý Sản Phẩm (SQLite)</Text>

      {/* Tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Tìm theo tên sản phẩm hoặc loại..."
          value={keyword}
          onChangeText={setKeyword}
        />
        <Button title="Tìm" onPress={handleSearch} />
      </View>

      {/* Form thêm / sửa */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Hình ảnh (URL / Tên file)"
          value={img}
          onChangeText={setImg}
        />
        <TextInput
          style={styles.input}
          placeholder="ID Danh mục (1-Áo, 2-Giày, ...)"
          value={categoryId}
          keyboardType="numeric"
          onChangeText={setCategoryId}
        />
        <View style={styles.formActions}>
          <Button title={editingId ? "Cập nhật" : "Thêm"} onPress={handleSave} />
          {editingId && (
            <View style={{ marginLeft: 10 }}>
              <Button
                title="Hủy"
                color="red"
                onPress={() => {
                  setEditingId(null);
                  setName('');
                  setPrice('');
                  setImg('');
                  setCategoryId('');
                }}
              />
            </View>
          )}
        </View>
      </View>

      {/* Danh sách */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Không có dữ liệu</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputSearch: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  formContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemActions: {
    justifyContent: 'space-around',
    marginLeft: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SanphamSqlite;
