import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null; // Do not show header if no user is logged in
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.username}>
            {user.username} {user.role === 'admin' ? '(Admin)' : ''}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 55 : 40, // adjust for safe area
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    // Premium soft shadow
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderBottomWidth: Platform.OS === 'android' ? 1 : 0,
    borderBottomColor: '#f1f5f9',
    zIndex: 100, // Make sure shadow renders above tabs
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4f46e5', // Indigo primary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: '#e11d48', // Rose color for logout
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },
});
