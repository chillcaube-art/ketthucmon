import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { addUser } from '../../database';
import { useRouter } from 'expo-router';

export default function RegisterTab() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';

    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email)) newErrors.email = 'Email không hợp lệ';

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!phoneRegex.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ';

    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return false;

    if (!agreeTerms) {
      setFormMessage({ type: 'error', text: "Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật." });
      return false;
    }

    return true;
  };

  const router = useRouter();

  const handleRegister = async () => {
    setFormMessage({ type: '', text: '' }); // Clear previous message
    if (validate()) {
      setIsLoading(true);
      const success = await addUser(email, password, 'user');
      setIsLoading(false);
      if (success) {
        setFormMessage({ type: 'success', text: "Đăng ký thành công! Đang chuyển hướng..." });
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setFormMessage({ type: 'error', text: "Lỗi: Email đã tồn tại hoặc CSDL chưa sẵn sàng." });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header Icon */}
          <View style={styles.headerIconContainer}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="person-add" size={36} color="#4f46e5" />
            </View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Tham gia ShopMobile ngay hôm nay!</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>

            {/* Stepper */}
            <View style={styles.stepperContainer}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <Ionicons name="person-outline" size={16} color="#fff" />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepCircle}>
                <Ionicons name="lock-closed-outline" size={16} color="#d1d5db" />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepCircle}>
                <Ionicons name="checkmark-outline" size={16} color="#d1d5db" />
              </View>
            </View>

            {/* Input Form */}
            <View style={styles.form}>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Họ và tên</Text>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nguyễn Văn A"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={(text) => { setName(text); setErrors({ ...errors, name: '' }); }}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="example@email.com"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                  <Feather name="phone" size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="0912 345 678"
                    placeholderTextColor="#9ca3af"
                    value={phone}
                    onChangeText={(text) => { setPhone(text); setErrors({ ...errors, phone: '' }); }}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Tối thiểu 6 ký tự"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: '' }); }}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                activeOpacity={0.7}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                  {agreeTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.termsText}>
                  Tôi đồng ý với <Text style={styles.linkText}>Điều khoản sử dụng</Text> và <Text style={styles.linkText}>Chính sách bảo mật</Text>
                </Text>
              </TouchableOpacity>

              {/* Form Message */}
              {formMessage.text ? (
                <Text style={{
                  color: formMessage.type === 'success' ? '#4f46e5' : '#ef4444',
                  textAlign: 'center',
                  marginBottom: 16,
                  fontWeight: '600'
                }}>
                  {formMessage.text}
                </Text>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.submitButtonText}>Đăng ký</Text>
                  </>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  stepLine: {
    width: 40,
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  form: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },
  eyeIcon: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
    paddingRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  linkText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  }
});
