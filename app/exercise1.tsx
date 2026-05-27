import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Exercise1() {
  const name = "Quang Rin";

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View style={styles.card}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.nameText}>Hello, {name} 👋</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#3b5998', // Solid color instead of gradient
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#192f6a',
  },
});
