// app/screens/BuyPremiumTokensScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BuyPremiumTokensScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');

  const handleProceedToPayment = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid amount', 'Please enter a valid number');
      return;
    }

    navigation.navigate('payment', { amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Premium Tokens</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount of tokens"
      />
      <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

