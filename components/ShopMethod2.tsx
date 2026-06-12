import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import ProductCard from './ProductCard';

const products = [
  { id: 'p1', name: 'Áo thun nam cao cấp', price: '150.000đ', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { id: 'p2', name: 'Quần jean nữ phong cách', price: '250.000đ', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80' },
  { id: 'p3', name: 'Giày thể thao nam', price: '350.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 'p4', name: 'Túi xách thời trang', price: '200.000đ', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80' },
  { id: 'p5', name: 'Kính mát nam nữ', price: '120.000đ', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
  { id: 'p6', name: 'Đồng hồ thông minh', price: '450.000đ', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
];

export default function ShopMethod2() {
  const handleBuy = (productName: string) => {
    Alert.alert("Thêm vào giỏ", `Đã thêm ${productName} vào giỏ hàng!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cách 2: Dùng Component Con (ProductCard)</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {products.map((item) => (
            <ProductCard 
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              onPressBuy={() => handleBuy(item.name)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    color: '#1e293b',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
