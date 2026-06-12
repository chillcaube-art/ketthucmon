import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getUserByCredentials } from '../../database';
import { useRouter } from 'expo-router';

export default function LoginTab() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setFormMessage({ type: '', text: '' }); // Clear message
    if (!email || !password) {
      setFormMessage({ type: 'error', text: 'Vui lòng nhập đủ thông tin' });
      return;
    }
    const user = await getUserByCredentials(email, password);
    if (user) {
      login(user);
      setFormMessage({ type: 'success', text: 'Đăng nhập thành công!' });
      // Navigate explicitly based on role
      setTimeout(() => {
        if (user.role === 'admin') {
          router.replace('/admin_home');
        } else {
          router.replace('/shop');
        }
      }, 500);
    } else {
      setFormMessage({ type: 'error', text: 'Email/Tài khoản hoặc mật khẩu không chính xác' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Ionicons name="cart" size={60} color="#4f46e5" />
          <Text style={styles.title}>Chào mừng trở lại</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sắm</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email hoặc Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Form Message */}
        {formMessage.text ? (
          <Text style={{
            color: formMessage.type === 'success' ? '#3b82f6' : '#ef4444',
            textAlign: 'center',
            marginBottom: 16,
            fontWeight: '600'
          }}>
            {formMessage.text}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 32,
    backgroundColor: '#ffffff',
    margin: 24,
    borderRadius: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  }
});
