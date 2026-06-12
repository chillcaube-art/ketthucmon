import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Platform, Modal, TextInput } from 'react-native';
import { Order, fetchAllOrders, updateOrderStatus, updateOrderShippingInfo } from '../../database';
import { Ionicons } from '@expo/vector-icons';

const STATUSES = ['Pending', 'Shipping', 'Completed', 'Cancelled'];

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchAllOrders();
    setOrders(data);
  };

  const handleUpdateStatus = (orderId: number, currentStatus: string) => {
    const currentIndex = STATUSES.indexOf(currentStatus);
    const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length];
    
    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Chuyển trạng thái đơn hàng #${orderId} thành "${nextStatus}"?`);
      if (confirm) {
        updateOrderStatus(orderId, nextStatus).then(loadData);
      }
    } else {
      Alert.alert(
        'Cập nhật trạng thái', 
        `Chuyển trạng thái đơn hàng #${orderId} thành "${nextStatus}"?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Đồng ý', 
            onPress: async () => {
              await updateOrderStatus(orderId, nextStatus);
              loadData();
            } 
          }
        ]
      );
    }
  };

  const handleEditShippingInfo = (order: Order) => {
    setEditingOrder(order);
    setEditName(order.recipientName || '');
    setEditPhone(order.phone || '');
    setEditAddress(order.address || '');
    setModalVisible(true);
  };

  const handleSaveShippingInfo = async () => {
    if (editingOrder) {
      await updateOrderShippingInfo(editingOrder.id, editName, editPhone, editAddress);
      setModalVisible(false);
      loadData();
      if (Platform.OS === 'web') {
        window.alert('Cập nhật thông tin thành công!');
      } else {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return '#f59e0b';
      case 'Shipping': return '#3b82f6';
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.infoText}>Người đặt: User ID {item.userId}</Text>
        <Text style={styles.infoText}>Ngày đặt: {new Date(item.orderDate).toLocaleDateString('vi-VN')}</Text>
        
        {item.recipientName && (
          <View style={styles.shippingBox}>
            <Text style={styles.shippingText}><Text style={styles.boldText}>Người nhận:</Text> {item.recipientName}</Text>
            <Text style={styles.shippingText}><Text style={styles.boldText}>SĐT:</Text> {item.phone}</Text>
            <Text style={styles.shippingText}><Text style={styles.boldText}>Địa chỉ:</Text> {item.address}</Text>
          </View>
        )}

        <Text style={styles.priceText}>Tổng tiền: {item.total.toLocaleString('vi-VN')} đ</Text>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.btnEdit} 
          onPress={() => handleEditShippingInfo(item)}
        >
          <Ionicons name="pencil" size={16} color="#fff" style={{marginRight: 6}} />
          <Text style={styles.btnActionText}>Sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnAction} 
          onPress={() => handleUpdateStatus(item.id, item.status)}
        >
          <Ionicons name="sync" size={16} color="#fff" style={{marginRight: 6}} />
          <Text style={styles.btnActionText}>Cập nhật TT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Quản lý Đơn hàng</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sửa thông tin giao hàng</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tên người nhận</Text>
                <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput style={styles.input} value={editPhone} onChangeText={setEditPhone} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput style={styles.input} value={editAddress} onChangeText={setEditAddress} />
              </View>

              <TouchableOpacity style={styles.btnSave} onPress={handleSaveShippingInfo}>
                <Text style={styles.btnSaveText}>Lưu thông tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#111827' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cardBody: { padding: 16 },
  infoText: { fontSize: 14, color: '#4b5563', marginBottom: 6 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', marginTop: 8 },
  cardFooter: { flexDirection: 'row', padding: 16, backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#f3f4f6', justifyContent: 'flex-end', gap: 8 },
  btnAction: { flexDirection: 'row', backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnEdit: { flexDirection: 'row', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnActionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 16 },
  shippingBox: { backgroundColor: '#f9fafb', padding: 10, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  shippingText: { fontSize: 13, color: '#374151', marginBottom: 2 },
  boldText: { fontWeight: 'bold', color: '#111827' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#fff', fontSize: 15 },
  btnSave: { backgroundColor: '#3b82f6', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
