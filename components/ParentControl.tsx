import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Alert } from 'react-native';
import LightControl from './LightControl';

export default function ParentControl() {
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(50); // Mặc định ở mức 50%

  // Callback Bật/Tắt đèn
  const handleToggleLight = () => {
    setIsLightOn((prev) => {
      const nextState = !prev;
      if (!nextState) {
        Alert.alert('Thông báo', 'Đèn đã được tắt!');
      }
      return nextState;
    });
  };


  // Callback Tăng độ sáng (+10)
  const handleIncreaseBrightness = () => {
    if (!isLightOn) return;
    setBrightness((prev) => {
      const next = prev + 10;
      return next > 100 ? 100 : next;
    });
  };

  // Callback Giảm độ sáng (-10)
  const handleDecreaseBrightness = () => {
    if (!isLightOn) return;
    setBrightness((prev) => {
      const next = prev - 10;
      return next < 0 ? 0 : next;
    });
  };

  // Màu trạng thái dựa trên việc Bật/Tắt
  const statusColor = isLightOn ? '#2ecc71' : '#e74c3c';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Smart Light Control</Text>
          
          <View style={styles.parentCard}>
            <Text style={styles.header}>===== COMPONENT CHA =====</Text>
            
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái đèn:</Text>
                <Text style={[styles.infoValue, { color: statusColor }]}>
                  {isLightOn ? 'BẬT' : 'TẮT'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Độ sáng hiện tại:</Text>
                <Text style={[styles.infoValue, styles.brightnessValue]}>
                  {brightness}%
                </Text>
              </View>
            </View>
          </View>

          {/* Component con, nhận dữ liệu qua props */}
          <LightControl
            isLightOn={isLightOn}
            brightness={brightness}
            onToggleLight={handleToggleLight}
            onIncreaseBrightness={handleIncreaseBrightness}
            onDecreaseBrightness={handleDecreaseBrightness}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  parentCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  infoSection: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  brightnessValue: {
    color: '#fbbf24',
  },
});
