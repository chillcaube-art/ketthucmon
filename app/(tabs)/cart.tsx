import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Platform } from 'react-native';
import { CartItem, fetchCart, updateCartQuantity, removeFromCart, placeOrder } from '../../database';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

export default function CartTab() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const loadData = async () => {
    if (user) {
      const data = await fetchCart(user.id);
      setCartItems(data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user])
  );

  const handleUpdateQuantity = async (id: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemove(id);
      return;
    }
    await updateCartQuantity(id, newQuantity);
    loadData();
  };

  const handleRemove = (id: number) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?');
      if (confirm) {
        removeFromCart(id).then(() => loadData());
      }
    } else {
      Alert.alert('Xóa', 'Bạn muốn xóa sản phẩm này khỏi giỏ hàng?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          style: 'destructive',
          onPress: async () => {
            await removeFromCart(id);
            loadData();
          }
        }
      ]);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice || 0) * item.quantity, 0);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Ionicons name="image-outline" size={30} color="#ccc" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>{item.productPrice?.toLocaleString('vi-VN')} đ</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.btnQty} onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}>
          <Ionicons name="remove" size={16} color="#333" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.btnQty} onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}>
          <Ionicons name="add" size={16} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btnRemove} onPress={() => handleRemove(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Vui lòng đăng nhập để xem giỏ hàng</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>

        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={80} color="#d1d5db" />
              <Text style={styles.emptyText}>Giỏ hàng trống</Text>
            </View>
          }
        />

        {cartItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{calculateTotal().toLocaleString('vi-VN')} đ</Text>
            </View>
            <TouchableOpacity style={styles.btnCheckout} onPress={handleCheckout}>
              <Text style={styles.btnCheckoutText}>Tiến hành Đặt hàng</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', margin: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  imageContainer: { width: 60, height: 60, backgroundColor: '#f3f4f6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#ef4444' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, marginHorizontal: 12 },
  btnQty: { padding: 8 },
  qtyText: { fontSize: 16, fontWeight: 'bold', width: 24, textAlign: 'center' },
  btnRemove: { padding: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#6b7280', marginTop: 12 },
  footer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: '#4b5563' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#ef4444' },
  btnCheckout: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnCheckoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
