import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface GreetingProps {
  name: string;
  age: string;
}

const GreetingComponent = ({ name, age }: GreetingProps) => {
  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>
        Hello {name || "..."}
      </Text>
      <Text style={styles.ageText}>
        {age ? `You are ${age} years old` : "How old are you?"}
      </Text>
    </View>
  );
};

export default function Exercise2() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handlePress = () => {
    if (!name.trim()) {
      Alert.alert("Notice", "Please enter your name first!");
      return;
    }
    Alert.alert("Greeting", `Hello ${name}!`);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exercise 2</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              value={age}
              keyboardType="numeric"
              onChangeText={setAge}
            />
          </View>

          <View style={styles.divider} />

          {/* Centered Greeting Component */}
          <GreetingComponent name={name} age={age} />

          <TouchableOpacity 
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonBackground}>
              <Text style={styles.buttonText}>Show Alert</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#4A00E0',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    alignItems: 'stretch',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A00E0',
    marginBottom: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 25,
  },
  greetingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    minHeight: 100,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  ageText: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonBackground: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FF512F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
