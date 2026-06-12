import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import ShopMethod1 from './ShopMethod1';
import ShopMethod2 from './ShopMethod2';

export default function ShopHome() {
  const [activeTab, setActiveTab] = useState<1 | 2>(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 1 && styles.activeTab]} 
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Cách 1 (Mảng)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 2 && styles.activeTab]} 
            onPress={() => setActiveTab(2)}
          >
            <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>Cách 2 (Component)</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {activeTab === 1 ? <ShopMethod1 /> : <ShopMethod2 />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  }
});
