import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Modal, ScrollView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderItem, fetchUserOrders, fetchOrderItems, updateUser, User, updateOrderStatus } from '../../database';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

export default function ProfileTab() {
  const { user, login, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState('');

  // Modal states for order details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    if (user) {
      const data = await fetchUserOrders(user.id);
      setOrders(data);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
      if (user) setPassword(user.password);
    }, [user])
  );

  const handleUpdateInfo = async () => {
    if (!user) return;
    if (!password.trim()) {
      Alert.alert('Lỗi', 'Mật khẩu không được để trống');
      return;
    }

    const updatedUser: User = { ...user, password };
    await updateUser(updatedUser);
    login(updatedUser); // Update context
    Alert.alert('Thành công', 'Đã cập nhật thông tin');
  };

  const handleLogout = () => {
    logout();
  };

  const handleCancelOrder = (orderId: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
        updateOrderStatus(orderId, 'Cancelled').then(() => {
          loadOrders();
          setModalVisible(false);
          window.alert('Đã hủy đơn hàng');
        });
      }
    } else {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn hủy đơn hàng này không?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            await updateOrderStatus(orderId, 'Cancelled');
            loadOrders();
            setModalVisible(false);
            Alert.alert('Thành công', 'Đã hủy đơn hàng');
          }
        }
      ]);
    }
  };

  const handleConfirmDelivery = (orderId: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Bạn đã nhận được hàng?')) {
        updateOrderStatus(orderId, 'Completed').then(() => {
          loadOrders();
          setModalVisible(false);
          window.alert('Cảm ơn bạn đã mua hàng!');
        });
      }
    } else {
      Alert.alert('Xác nhận', 'Bạn đã nhận được hàng?', [
        { text: 'Chưa', style: 'cancel' },
        {
          text: 'Đã nhận',
          onPress: async () => {
            await updateOrderStatus(orderId, 'Completed');
            loadOrders();
            setModalVisible(false);
            Alert.alert('Thành công', 'Cảm ơn bạn đã mua hàng!');
          }
        }
      ]);
    }
  };

  const handleViewOrderDetails = async (orderId: number) => {
    const items = await fetchOrderItems(orderId);
    const order = orders.find(o => o.id === orderId) || null;
    setSelectedOrderItems(items);
    setSelectedOrderId(orderId);
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Shipping': return '#3b82f6';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleViewOrderDetails(item.id)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.orderDate}>{new Date(item.orderDate).toLocaleDateString('vi-VN')}</Text>
        <Text style={styles.orderTotal}>{item.total.toLocaleString('vi-VN')} đ</Text>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.viewDetailText}>Xem chi tiết <Ionicons name="chevron-forward" size={14} /></Text>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Vui lòng đăng nhập</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.role}>Vai trò: {user.role}</Text>
        </View>

        <View style={styles.updateSection}>
          <Text style={styles.sectionTitle}>Cập nhật mật khẩu</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnUpdate} onPress={handleUpdateInfo}>
              <Text style={styles.btnUpdateText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lịch sử mua hàng</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>}
        />

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.btnLogoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Modal Chi tiết đơn hàng */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chi tiết Đơn hàng #{selectedOrderId}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {selectedOrder && selectedOrder.recipientName && (
                  <View style={styles.shippingInfo}>
                    <Text style={styles.shippingTitle}>Thông tin giao hàng:</Text>
                    <Text style={styles.shippingText}><Text style={styles.shippingLabel}>Tên:</Text> {selectedOrder.recipientName}</Text>
                    <Text style={styles.shippingText}><Text style={styles.shippingLabel}>SĐT:</Text> {selectedOrder.phone}</Text>
                    <Text style={styles.shippingText}><Text style={styles.shippingLabel}>Địa chỉ:</Text> {selectedOrder.address}</Text>
                  </View>
                )}

                <Text style={styles.shippingTitle}>Danh sách sản phẩm:</Text>
                {selectedOrderItems.map((item, index) => (
                  <View key={index} style={styles.orderItemCard}>
                    <View style={styles.itemImagePlaceholder}>
                      <Ionicons name="image-outline" size={24} color="#ccc" />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemPrice}>
                        {item.price.toLocaleString('vi-VN')} đ x {item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtotal}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                ))}

                {selectedOrder && selectedOrder.status === 'Pending' && (
                  <TouchableOpacity style={styles.btnCancelOrder} onPress={() => handleCancelOrder(selectedOrder.id)}>
                    <Text style={styles.btnCancelOrderText}>Hủy Đơn Hàng</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder && selectedOrder.status === 'Shipping' && (
                  <TouchableOpacity style={styles.btnConfirmDelivery} onPress={() => handleConfirmDelivery(selectedOrder.id)}>
                    <Text style={styles.btnConfirmDeliveryText}>Đã Nhận Hàng</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileSection: { alignItems: 'center', marginBottom: 24, backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  username: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  role: { fontSize: 14, color: '#6b7280' },
  updateSection: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  inputRow: { flexDirection: 'row' },
  input: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginRight: 8, backgroundColor: '#f9fafb' },
  btnUpdate: { backgroundColor: '#10b981', paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnUpdateText: { color: '#fff', fontWeight: 'bold' },
  listContent: { paddingBottom: 20 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  orderStatus: { fontSize: 14, fontWeight: 'bold' },
  orderBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderDate: { fontSize: 14, color: '#6b7280' },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#ef4444' },
  orderFooter: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12, alignItems: 'flex-end' },
  viewDetailText: { fontSize: 14, color: '#3b82f6', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
  btnLogout: { flexDirection: 'row', backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  btnLogoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  modalScroll: { marginBottom: 20 },
  orderItemCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemImagePlaceholder: { width: 50, height: 50, backgroundColor: '#f3f4f6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#6b7280' },
  itemSubtotal: { fontSize: 15, fontWeight: 'bold', color: '#ef4444' },
  shippingInfo: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  shippingTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  shippingText: { fontSize: 14, color: '#4b5563', marginBottom: 4 },
  shippingLabel: { fontWeight: '600', color: '#374151' },
  btnCancelOrder: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  btnCancelOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnConfirmDelivery: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  btnConfirmDeliveryText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
