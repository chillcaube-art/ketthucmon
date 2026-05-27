import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LightControlProps {
  isLightOn: boolean;
  brightness: number;
  onToggleLight: () => void;
  onIncreaseBrightness: () => void;
  onDecreaseBrightness: () => void;
}

export default function LightControl({
  isLightOn,
  brightness,
  onToggleLight,
  onIncreaseBrightness,
  onDecreaseBrightness,
}: LightControlProps) {
  // Determine text color for status: Green when On, Red when Off
  const statusColor = isLightOn ? '#2ecc71' : '#e74c3c';
  
  // Calculate bulb style based on status and brightness
  const bulbOpacity = isLightOn ? 0.3 + (brightness / 100) * 0.7 : 0.2;
  const bulbColor = isLightOn ? '#f1c40f' : '#7f8c8d';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>===== COMPONENT CON =====</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>
          Trạng thái nhận được:{' '}
          <Text style={[styles.statusValue, { color: statusColor }]}>
            {isLightOn ? 'BẬT' : 'TẮT'}
          </Text>
        </Text>
        <Text style={styles.label}>
          Độ sáng nhận được:{' '}
          <Text style={styles.brightnessValue}>
            {brightness}%
          </Text>
        </Text>
      </View>

      {/* Light Bulb Illustration */}
      <View style={styles.bulbContainer}>
        {isLightOn && (
          <View
            style={[
              styles.glowEffect,
              {
                opacity: (brightness / 100) * 0.6,
                width: 90 + (brightness / 100) * 60,
                height: 90 + (brightness / 100) * 60,
                borderRadius: (90 + (brightness / 100) * 60) / 2,
              },
            ]}
          />
        )}
        <Ionicons
          name={isLightOn ? 'bulb' : 'bulb-outline'}
          size={80}
          color={bulbColor}
          style={{ opacity: bulbOpacity }}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        {/* Toggle Light Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLightOn ? '#e74c3c' : '#2ecc71' },
          ]}
          onPress={onToggleLight}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isLightOn ? 'power-outline' : 'power'}
            size={20}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.buttonText}>
            {isLightOn ? 'Tắt Đèn' : 'Bật Đèn'}
          </Text>
        </TouchableOpacity>

        {/* Brightness Adjustment Buttons */}
        <View style={styles.brightnessButtons}>
          <TouchableOpacity
            style={[
              styles.adjustButton,
              (!isLightOn || brightness <= 0) && styles.disabledButton,
            ]}
            onPress={onDecreaseBrightness}
            disabled={!isLightOn || brightness <= 0}
            activeOpacity={0.7}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#fff" />
            <Text style={styles.adjustButtonText}>Giảm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.adjustButton,
              (!isLightOn || brightness >= 100) && styles.disabledButton,
            ]}
            onPress={onIncreaseBrightness}
            disabled={!isLightOn || brightness >= 100}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.adjustButtonText}>Tăng</Text>
          </TouchableOpacity>
        </View>

        {/* Warning text when light is OFF */}
        {!isLightOn && (
          <Text style={styles.warningText}>
            ⚠️ Vui lòng BẬT đèn để điều chỉnh độ sáng!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
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
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  label: {
    fontSize: 15,
    color: '#e2e8f0',
    marginVertical: 4,
    fontWeight: '600',
  },
  statusValue: {
    fontWeight: 'bold',
  },
  brightnessValue: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  bulbContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    backgroundColor: 'rgba(251, 191, 36, 0.4)',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'stretch',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  brightnessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  adjustButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#475569',
    opacity: 0.3,
  },
  warningText: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
