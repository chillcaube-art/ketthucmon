import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product, getProductById, addToCart } from '../../database';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    const data = await getProductById(productId);
    setProduct(data);
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    if (product) {
      await addToCart(user.id, product.id, 1);
      Alert.alert('Thành công', `Đã thêm ${product.name} vào giỏ hàng!`);
    }
  };

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          {product.img && (product.img.startsWith('http') || product.img.startsWith('file')) ? (
            Platform.OS === 'web' ? (
              <img src={product.img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} crossOrigin="anonymous" />
            ) : (
              <Image source={{ uri: product.img }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            )
          ) : (
            <Ionicons name="image-outline" size={100} color="#ccc" />
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')} đ</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.description}>
            Đây là sản phẩm tuyệt vời đến từ cửa hàng của chúng tôi.
            Sản phẩm có chất lượng cao, bền bỉ và kiểu dáng thời trang.
            Thích hợp cho mọi lứa tuổi và nhu cầu sử dụng hàng ngày.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnAddToCart} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnAddToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  content: { paddingBottom: 24 },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContainer: { paddingHorizontal: 16 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  productPrice: { fontSize: 22, fontWeight: 'bold', color: '#ef4444', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 },
  description: { fontSize: 15, color: '#4b5563', lineHeight: 22 },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  btnAddToCart: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAddToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
