import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 2 columns with 16 padding on sides and 16 gap

const products = [
  { id: 1, name: 'Áo thun nam cao cấp', price: '150.000đ', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { id: 2, name: 'Quần jean nữ phong cách', price: '250.000đ', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80' },
  { id: 3, name: 'Giày thể thao nam', price: '350.000đ', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
  { id: 4, name: 'Túi xách thời trang', price: '200.000đ', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80' },
  { id: 5, name: 'Kính mát nam nữ', price: '120.000đ', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
  { id: 6, name: 'Đồng hồ thông minh', price: '450.000đ', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
];

export default function ShopMethod1() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cách 1: Dùng Mảng (Trực tiếp)</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {products.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Mua ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  productCard: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
