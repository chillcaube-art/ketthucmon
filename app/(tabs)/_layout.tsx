import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

export default function TabLayout() {
  const { user } = useAuth();

  const isGuest = !user;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user && user.role !== 'admin';

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#7c3aed',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          }
        }}>

        {/* Home User (Shop) */}
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Cửa hàng',
            headerTitle: 'Sản phẩm',
            href: '/shop',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'storefront' : 'storefront-outline'} color={color} />
            ),
          }}
        />

        {/* Home Admin */}
        <Tabs.Screen
          name="admin_home"
          options={{
            title: 'Admin Home',
            headerTitle: 'Trang chủ quản trị',
            href: isAdmin ? '/admin_home' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'grid' : 'grid-outline'} color={color} />
            ),
          }}
        />

        {/* Đăng ký */}
        <Tabs.Screen
          name="register"
          options={{
            title: 'Đăng ký',
            headerTitle: 'Tạo tài khoản mới',
            href: isGuest || isAdmin ? '/register' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'person-add' : 'person-add-outline'} color={color} />
            ),
          }}
        />

        {/* Đăng nhập */}
        <Tabs.Screen
          name="login"
          options={{
            title: 'Đăng nhập',
            headerTitle: 'Đăng nhập Tài khoản',
            href: isGuest || isAdmin ? '/login' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'log-in' : 'log-in-outline'} color={color} />
            ),
          }}
        />

        {/* Cart - Customer only (or both, depending on requirement, keep it for user) */}
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Giỏ hàng',
            headerTitle: 'Giỏ hàng của bạn',
            href: isCustomer ? '/cart' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'cart' : 'cart-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Tài khoản',
            headerTitle: 'Thông tin của bạn',
            href: isCustomer ? '/profile' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={24} name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />

        {/* Hidden Admin Pages (accessible via Admin Home) */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Sản phẩm',
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin_categories"
          options={{
            title: 'Danh mục',
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin_orders"
          options={{
            title: 'Đơn hàng',
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin_users"
          options={{
            title: 'Người dùng',
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
