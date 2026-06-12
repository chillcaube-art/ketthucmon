import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform, 
  SafeAreaView, 
  StatusBar
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LayoutPractice() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // State to select which layout to preview
  const [selectedLayout, setSelectedLayout] = useState<1 | 2 | 3>(3);

  // Trigger alerts for interactive elements in the mockup layout
  const handlePrivacyPress = () => {
    Alert.alert('Chính sách bảo mật', 'Bạn đang truy cập vào trang Chính sách bảo mật của chúng tôi.');
  };

  const handleSocialPress = (platform: string) => {
    Alert.alert('Liên kết mạng xã hội', `Đang chuyển hướng tới trang ${platform}...`);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#f8fafc'} />
      
      {/* Header Bar */}
      <View style={[styles.mainHeader, { borderBottomColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
        <Text style={[styles.mainTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
          RN Layout Practice
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Thực hành các bài tập thiết kế Layout
        </Text>
      </View>

      <View style={styles.practiceContainer}>
          {/* Layout practice selectors */}
          <View style={styles.layoutSelectorContainer}>
            <TouchableOpacity 
              style={[
                styles.layoutSelector,
                selectedLayout === 1 && styles.selectedLayoutSelector,
                selectedLayout === 1 && { backgroundColor: '#0284c7' }
              ]}
              onPress={() => setSelectedLayout(1)}
              activeOpacity={0.8}
            >
              <Ionicons name="ellipsis-vertical" size={16} color={selectedLayout === 1 ? '#fff' : (isDark ? '#cbd5e1' : '#334155')} />
              <Text style={[styles.selectorText, selectedLayout === 1 && styles.selectedSelectorText]}>Layout 1</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.layoutSelector,
                selectedLayout === 2 && styles.selectedLayoutSelector,
                selectedLayout === 2 && { backgroundColor: '#0284c7' }
              ]}
              onPress={() => setSelectedLayout(2)}
              activeOpacity={0.8}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color={selectedLayout === 2 ? '#fff' : (isDark ? '#cbd5e1' : '#334155')} />
              <Text style={[styles.selectorText, selectedLayout === 2 && styles.selectedSelectorText]}>Layout 2</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.layoutSelector,
                selectedLayout === 3 && styles.selectedLayoutSelector,
                selectedLayout === 3 && { backgroundColor: '#0284c7' }
              ]}
              onPress={() => setSelectedLayout(3)}
              activeOpacity={0.8}
            >
              <Ionicons name="grid-outline" size={16} color={selectedLayout === 3 ? '#fff' : (isDark ? '#cbd5e1' : '#334155')} />
              <Text style={[styles.selectorText, selectedLayout === 3 && styles.selectedSelectorText]}>Layout 3</Text>
            </TouchableOpacity>
          </View>

          {/* Description of current layout */}
          <View style={[styles.layoutMetaInfo, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
            <Text style={[styles.layoutTitle, { color: isDark ? '#38bdf8' : '#0284c7' }]}>
              {selectedLayout === 1 && 'Bài 1: 3 Vùng bằng nhau (Hướng dọc mặc định)'}
              {selectedLayout === 2 && 'Bài 2: 3 Vùng bằng nhau (Hướng ngang)'}
              {selectedLayout === 3 && 'Bài 3: Bố cục thực tế (Header - Body - Footer)'}
            </Text>
            <Text style={[styles.layoutDesc, { color: isDark ? '#cbd5e1' : '#475569' }]}>
              {selectedLayout === 1 && 'Mỗi vùng có style { flex: 1 }, sắp xếp theo hướng flexDirection: \'column\' (mặc định trong React Native) để tự động chia đều chiều cao của màn hình.'}
              {selectedLayout === 2 && 'Mỗi vùng có style { flex: 1 }, sắp xếp theo hướng flexDirection: \'row\' để chia đều chiều rộng của màn hình theo chiều ngang.'}
              {selectedLayout === 3 && 'Bố cục tích hợp gồm Header (Logo + Banner hình ảnh), Body (Sidebar trái 30% + Content phải 70%), và Footer (Nút bảo mật + Mạng xã hội hoạt động được).'}
            </Text>
          </View>

          {/* Live Preview Screen Area */}
          <View style={[styles.previewWrapper, { borderColor: isDark ? '#334155' : '#cbd5e1', backgroundColor: isDark ? '#090d16' : '#fff' }]}>
            {selectedLayout === 1 && (
              <View style={styles.fullLayoutCol}>
                <View style={[styles.flexBox, { backgroundColor: '#4f46e5' }]}>
                  <Text style={styles.flexBoxText}>Vùng 1 (flex: 1)</Text>
                  <Text style={styles.flexBoxSubtext}>{"flexDirection: 'column'"}</Text>
                </View>
                <View style={[styles.flexBox, { backgroundColor: '#0d9488' }]}>
                  <Text style={styles.flexBoxText}>Vùng 2 (flex: 1)</Text>
                  <Text style={styles.flexBoxSubtext}>BackgroundColor: Teal</Text>
                </View>
                <View style={[styles.flexBox, { backgroundColor: '#db2777' }]}>
                  <Text style={styles.flexBoxText}>Vùng 3 (flex: 1)</Text>
                  <Text style={styles.flexBoxSubtext}>BackgroundColor: Pink</Text>
                </View>
              </View>
            )}

            {selectedLayout === 2 && (
              <View style={styles.fullLayoutRow}>
                <View style={[styles.flexBoxHorizontal, { backgroundColor: '#4f46e5' }]}>
                  <Text style={styles.flexBoxTextRow}>Vùng 1</Text>
                  <Text style={styles.flexBoxSubtextRow}>flex: 1</Text>
                  <Text style={styles.flexBoxSubtextRow}>Ngang</Text>
                </View>
                <View style={[styles.flexBoxHorizontal, { backgroundColor: '#0d9488' }]}>
                  <Text style={styles.flexBoxTextRow}>Vùng 2</Text>
                  <Text style={styles.flexBoxSubtextRow}>flex: 1</Text>
                  <Text style={styles.flexBoxSubtextRow}>Ngang</Text>
                </View>
                <View style={[styles.flexBoxHorizontal, { backgroundColor: '#db2777' }]}>
                  <Text style={styles.flexBoxTextRow}>Vùng 3</Text>
                  <Text style={styles.flexBoxSubtextRow}>flex: 1</Text>
                  <Text style={styles.flexBoxSubtextRow}>Ngang</Text>
                </View>
              </View>
            )}

            {selectedLayout === 3 && (
              <View style={styles.layout3Container}>
                {/* 1. Header (Logo & Banner) */}
                <View style={styles.mockHeader}>
                  {/* Top Bar with Logo & Brand */}
                  <View style={styles.headerTopBar}>
                    <View style={styles.logoContainer}>
                      <Ionicons name="logo-react" size={24} color="#61dafb" />
                      <Text style={styles.logoText}>React Native</Text>
                    </View>
                    <View style={styles.headerBadge}>
                      <Text style={styles.headerBadgeText}>PRO</Text>
                    </View>
                  </View>
                  {/* Banner Image Area */}
                  <View style={styles.bannerContainer}>
                    <Image 
                      source="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
                      style={styles.bannerImage}
                      contentFit="cover"
                      transition={300}
                    />
                    <View style={styles.bannerOverlay}>
                      <Text style={styles.bannerTitle}>Kiến Tạo Tương Lai</Text>
                      <Text style={styles.bannerSubtitle}>Bố cục giao diện đỉnh cao với Flexbox</Text>
                    </View>
                  </View>
                </View>

                {/* 2. Body (Sidebar & Content) */}
                <View style={styles.mockBody}>
                  {/* Sidebar (30% width) */}
                  <View style={styles.mockSidebar}>
                    <Text style={styles.sidebarTitle}>DANH MỤC</Text>
                    
                    <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Sidebar', 'Trang chủ')}>
                      <Ionicons name="home-outline" size={14} color="#94a3b8" />
                      <Text style={styles.sidebarItemText}>Trang chủ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Sidebar', 'Khóa học')}>
                      <Ionicons name="journal-outline" size={14} color="#94a3b8" />
                      <Text style={styles.sidebarItemText}>Khóa học</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Sidebar', 'Tài liệu')}>
                      <Ionicons name="document-text-outline" size={14} color="#94a3b8" />
                      <Text style={styles.sidebarItemText}>Tài liệu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sidebarItem} onPress={() => Alert.alert('Sidebar', 'Cài đặt')}>
                      <Ionicons name="settings-outline" size={14} color="#94a3b8" />
                      <Text style={styles.sidebarItemText}>Cài đặt</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Main Content (70% width) */}
                  <ScrollView style={styles.mockContent} contentContainerStyle={styles.mockContentInner}>
                    <Text style={styles.contentHeader}>Chào mừng bạn học!</Text>
                    
                    <View style={styles.contentCard}>
                      <View style={styles.contentCardRow}>
                        <View style={styles.iconCircle}>
                          <Ionicons name="person-circle-outline" size={24} color="#0284c7" />
                        </View>
                        <View>
                          <Text style={styles.contentCardUser}>Học viên: Quang Rin</Text>
                          <Text style={styles.contentCardSub}>Học phần: React Native Basics</Text>
                        </View>
                      </View>
                      
                      <View style={styles.progressSection}>
                        <Text style={styles.progressLabel}>Tiến trình học tập Layout</Text>
                        <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: '85%' }]} />
                        </View>
                        <Text style={styles.progressPercent}>85% Hoàn thành</Text>
                      </View>
                    </View>

                    <View style={styles.articleSection}>
                      <Text style={styles.articleTitle}>Vì sao Flexbox là số 1 trong RN?</Text>
                      <Text style={styles.articleText}>
                        Flexbox giải quyết triệt để bài toán hiển thị đa màn hình của thiết bị di động. Thay vì gán cứng kích thước, Flexbox giúp giao diện co giãn thông minh, hoạt động mượt mà trên cả iPhone 15 Pro Max lẫn các dòng Android bình dân.
                      </Text>
                    </View>
                  </ScrollView>
                </View>

                {/* 3. Footer (Privacy Policy & Social Icons) */}
                <View style={styles.mockFooter}>
                  {/* Privacy Policy Link */}
                  <TouchableOpacity style={styles.privacyLink} onPress={handlePrivacyPress}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#38bdf8" />
                    <Text style={styles.privacyText}>Chính sách bảo mật</Text>
                  </TouchableOpacity>

                  {/* Social Icons row */}
                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Facebook')}>
                      <Ionicons name="logo-facebook" size={18} color="#1877f2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Google')}>
                      <Ionicons name="logo-google" size={18} color="#db4437" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Twitter (X)')}>
                      <Ionicons name="logo-twitter" size={18} color="#1da1f2" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('Instagram')}>
                      <Ionicons name="logo-instagram" size={18} color="#e1306c" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialPress('YouTube')}>
                      <Ionicons name="logo-youtube" size={18} color="#ff0000" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.copyrightText}>© 2026 Quang Rin. Thiết kế giao diện RN.</Text>
                </View>
              </View>
            )}
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2.5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  subCard: {
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    fontSize: 13.5,
    lineHeight: 20,
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  highlightText: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  
  // Practice section styles
  practiceContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  layoutSelectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  layoutSelector: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  selectedLayoutSelector: {
    borderWidth: 0,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedSelectorText: {
    color: '#fff',
    fontWeight: '700',
  },
  layoutMetaInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  layoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  layoutDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  previewWrapper: {
    flex: 1,
    margin: 12,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Layout 1: Vertical columns
  fullLayoutCol: {
    flex: 1,
    flexDirection: 'column',
  },
  flexBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  flexBoxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flexBoxSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },

  // Layout 2: Horizontal rows
  fullLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  flexBoxHorizontal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  flexBoxTextRow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexBoxSubtextRow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },

  // Layout 3: Complex layout
  layout3Container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0f172a',
  },
  
  // Header
  mockHeader: {
    flexDirection: 'column',
    backgroundColor: '#1e293b',
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerBadge: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headerBadgeText: {
    color: '#0f172a',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bannerContainer: {
    height: 90,
    position: 'relative',
    justifyContent: 'center',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerSubtitle: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  // Body
  mockBody: {
    flex: 1,
    flexDirection: 'row',
  },
  
  // Sidebar (30%)
  mockSidebar: {
    width: '30%',
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 4,
  },
  sidebarTitle: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 6,
  },
  sidebarItemText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '500',
  },
  
  // Content (70%)
  mockContent: {
    width: '70%',
    backgroundColor: '#0f172a',
  },
  mockContentInner: {
    padding: 12,
    gap: 12,
  },
  contentHeader: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  contentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCardUser: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentCardSub: {
    color: '#94a3b8',
    fontSize: 9,
  },
  progressSection: {
    marginTop: 10,
  },
  progressLabel: {
    color: '#cbd5e1',
    fontSize: 9,
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  progressPercent: {
    color: '#22c55e',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 2,
    fontWeight: 'bold',
  },
  articleSection: {
    gap: 4,
  },
  articleTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  articleText: {
    color: '#94a3b8',
    fontSize: 10.5,
    lineHeight: 15,
  },

  // Footer
  mockFooter: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  privacyText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  socialButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  copyrightText: {
    color: '#64748b',
    fontSize: 9,
  },
});
