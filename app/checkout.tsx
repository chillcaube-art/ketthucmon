import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { CartItem, fetchCart, placeOrder } from '../database';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const data = await fetchCart(user.id);
        setCartItems(data);
      }
    };
    loadData();
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice || 0) * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!recipientName.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    if (!user) return;

    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Xác nhận đặt hàng với tổng số tiền ${calculateTotal().toLocaleString('vi-VN')} đ?`);
      if (confirm) {
        const success = await placeOrder(user.id, recipientName, phone, address);
        if (success) {
          window.alert('Đơn hàng của bạn đã được đặt thành công!');
          router.replace('/(tabs)/profile');
        } else {
          window.alert('Có lỗi xảy ra khi đặt hàng.');
        }
      }
    } else {
      Alert.alert('Xác nhận đặt hàng', `Xác nhận đặt hàng với tổng số tiền ${calculateTotal().toLocaleString('vi-VN')} đ?`, [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đặt hàng', 
          onPress: async () => {
            const success = await placeOrder(user.id, recipientName, phone, address);
            if (success) {
              Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt!');
              router.replace('/(tabs)/profile');
            } else {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng.');
            }
          } 
        }
      ]);
    }
  };

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Vui lòng đăng nhập</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên người nhận</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nhập tên người nhận"
              value={recipientName}
              onChangeText={setRecipientName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ giao hàng</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã, quận/huyện...)"
              multiline
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.itemSubtotal}>
                {item.quantity} x {item.productPrice?.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{calculateTotal().toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethod}>
            <Ionicons name="cash-outline" size={24} color="#10b981" />
            <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng (COD)</Text>
            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCheckout} onPress={handlePlaceOrder}>
          <Text style={styles.btnCheckoutText}>Xác nhận đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  container: { flex: 1, padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#fff', fontSize: 15 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { flex: 1, fontSize: 14, color: '#4b5563', marginRight: 16 },
  itemSubtotal: { fontSize: 14, fontWeight: '500', color: '#111827' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#ef4444' },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#3b82f6', borderRadius: 8, backgroundColor: '#eff6ff' },
  paymentMethodText: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500', color: '#1d4ed8' },
  footer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  btnCheckout: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnCheckoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
