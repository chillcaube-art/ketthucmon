import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminHome() {
  const router = useRouter();

  const menuItems = [
    {
      id: 'users',
      title: 'Quản lý người dùng',
      icon: 'people',
      color: '#3b82f6',
      route: '/admin_users',
      description: 'Thêm, sửa, xóa tài khoản',
    },
    {
      id: 'categories',
      title: 'Quản lý loại sản phẩm',
      icon: 'list',
      color: '#10b981',
      route: '/admin_categories',
      description: 'Quản lý danh mục sản phẩm',
    },
    {
      id: 'products',
      title: 'Quản lý sản phẩm',
      icon: 'cube',
      color: '#f59e0b',
      route: '/',
      description: 'Quản lý kho hàng',
    },
    {
      id: 'orders',
      title: 'Quản lý đơn hàng',
      icon: 'basket',
      color: '#8b5cf6',
      route: '/admin_orders',
      description: 'Xem và duyệt đơn đặt hàng',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Trang chủ quản trị</Text>
        <Text style={styles.pageSubtitle}>Chọn chức năng bạn muốn quản lý</Text>

        <View style={styles.gridContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={32} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
