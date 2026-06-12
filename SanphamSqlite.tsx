import { FlatList, StyleSheet, Image,Text, TouchableOpacity, View, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Product, Category, initDatabase, fetchProducts,fetchCategories } from './database';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';

const SanphamSqlite = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);  // Thêm state lưu đường dẫn hình ảnh

  useEffect(() => {
    initDatabase(() => {
      loadData(); // chỉ gọi sau khi transaction xong
    });
  }, []);

    const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods.reverse()); // Đảo ngược mảng để hiển thị sản phẩm mới lên đầu
  };

  //hàm này để ánh xạ với hình ảnh là uri hoặc ảnh tĩnh từ thư mục images, tránh lỗi khi dùng <Image source.../>
const getImageSource = (img: string) => {
    if (img.startsWith('file://')) {
      return { uri: img }; // Ảnh từ thư viện
    }
 
    // Ảnh tĩnh từ assets
    switch (img) {
      case 'hinh1.jpg':
        return require('./assets/images/react-logo.png');
     
      // Thêm các ảnh khác nếu cần
      default:
        return require('./assets/images/react-logo.png'); // fallback nếu ảnh không tồn tại
    }
  };

  //  hàm renderItem để hiển thị từng sản phẩm
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
        <TouchableOpacity>
            <Image source={getImageSource(item.img)} style={styles.image} />
        </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

   // Hàm chọn hình ảnh từ thư viện
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setImageUri(response.assets[0].uri ?? null);  // Nếu uri là undefined, thay thế bằng null
      }
    });
  };
 
  return (
    <View style={styles.container}>
         <Text style={styles.title}>Quản lý sản phẩm</Text>
              <TextInput
                style={styles.input}
                placeholder="Tên sản phẩm"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Giá sản phẩm"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              {/* dropdown đổ xuống chọn category */}
      <RNPickerSelect
        onValueChange={(value) => setCategoryId(value)}
        items={categories.map((c) => ({ label: c.name, value: c.id }))}
        value={categoryId}
        style={{
          inputAndroid: styles.pickerStyle,
          inputIOS: styles.pickerStyle,
        }}
      />

      {/* Chọn hình ảnh */}
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        <Text style={styles.buttonText}>{imageUri ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={getImageSource(imageUri)} style={styles.selectedImage} />
      )}

        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>
               {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </Text>
        </TouchableOpacity>
        <TextInput
        style={styles.input}
        placeholder="Tìm theo tên sản phẩm hoặc loại"
         />
       <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Không có sản phẩm nào</Text>}
      />
    </View>
  )
}

export default SanphamSqlite

const styles = StyleSheet.create({
container: { padding: 16, paddingBottom: 100 },
title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    height: 40, borderWidth: 1, borderColor: '#aaa',
    borderRadius: 6, paddingHorizontal: 10, marginBottom: 10,
  },
  card: {
    flexDirection: 'row', borderWidth: 1,
    borderColor: '#ccc', borderRadius: 8,
    marginBottom: 12, overflow: 'hidden',
  },
 image: { width: 80, height: 80 },
  selectedImage: { width: 100, height: 100, marginVertical: 10 },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  productName: { fontWeight: 'bold', fontSize: 16 },
  productPrice: { color: '#000' },
  iconRow: { flexDirection: 'row', marginTop: 10 },
  icon: { fontSize: 20, marginRight: 10 },
  pickerStyle: {
  height: 50,
  borderWidth: 1,
  borderColor: '#aaa',
  borderRadius: 6,
  paddingHorizontal: 10,
  paddingVertical: 12,
  color: '#000',
  },
  imagePicker: {
    marginTop: 20, marginBottom: 20,
    backgroundColor: '#918', padding: 10,
    borderRadius: 6, alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a', padding: 10,
    borderRadius: 6, alignItems: 'center', marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
})
