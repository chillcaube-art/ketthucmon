import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert, Platform } from 'react-native';
import { User, fetchUsers, deleteUser, updateUserRole } from '../../database';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleUpdateRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (Platform.OS === 'web') {
      if (window.confirm(`Đổi quyền của user này thành ${newRole}?`)) {
        await updateUserRole(id, newRole);
        loadData();
      }
    } else {
      Alert.alert('Xác nhận', `Đổi quyền của user này thành ${newRole}?`, [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          onPress: async () => {
            await updateUserRole(id, newRole);
            loadData();
          } 
        }
      ]);
    }
  };

  const handleDelete = async (id: number) => {
    if (currentUser?.id === id) {
      if (Platform.OS === 'web') {
        window.alert('Không thể tự xóa tài khoản của chính mình!');
      } else {
        Alert.alert('Lỗi', 'Không thể tự xóa tài khoản của chính mình!');
      }
      return;
    }
    if (Platform.OS === 'web') {
      if (window.confirm('Bạn có chắc chắn muốn xóa user này không?')) {
        await deleteUser(id);
        loadData();
      }
    } else {
      Alert.alert('Cảnh báo', 'Bạn có chắc chắn muốn xóa user này không?', [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            await deleteUser(id);
            loadData();
          } 
        }
      ]);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.nameText}>{item.username}</Text>
        <Text style={styles.roleText}>Vai trò: {item.role}</Text>
        <Text style={styles.idText}>ID: {item.id}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.btnRole} 
          onPress={() => handleUpdateRole(item.id, item.role)}
        >
          <Text style={styles.btnText}>Đổi quyền</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btnDelete, currentUser?.id === item.id && { opacity: 0.5 }]} 
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Quản lý Người dùng</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
  cardInfo: { flex: 1 },
  nameText: { fontWeight: 'bold', fontSize: 16, color: '#333', marginBottom: 4 },
  roleText: { fontSize: 14, color: '#007BFF', marginBottom: 2, fontWeight: '500' },
  idText: { fontSize: 12, color: '#888' },
  actionButtons: { justifyContent: 'center', alignItems: 'flex-end' },
  btnRole: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginBottom: 8, alignItems: 'center' },
  btnDelete: { backgroundColor: '#F44336', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
