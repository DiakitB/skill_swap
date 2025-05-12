// app/screens/MockPaymentScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { processBuyTokens } from '../utils/tokenService'

export default function MockPaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { amount } = route.params;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      alert('Please fill in all payment fields');
      return;
    }

    setProcessing(true);
    setTimeout(async () => {
      const success = await processBuyTokens(amount);
      if (success) {
        navigation.navigate('dashboard');
      }
      setProcessing(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mock Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (MM/YY)"
        value={expiry}
        onChangeText={setExpiry}
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        keyboardType="numeric"
        value={cvv}
        onChangeText={setCvv}
      />
      <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={processing}>
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buy Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
