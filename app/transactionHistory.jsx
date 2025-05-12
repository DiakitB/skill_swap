import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTION_URL = 'http://192.168.2.40:3000/api/users';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
; // Adjust to your auth flow
        console.log('Fetching transactions with token:', token);
        if (!token) {
          console.error('No token found, redirecting to login...');
          // Handle redirection to login if needed
          return;
        }
        const res = await axios.get(`${TRANSACTION_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type.toUpperCase()}</Text>
      <Text style={styles.amount}>Tokens: {item.amount}</Text>
      <Text style={styles.details}>{item.details}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  type: {
    fontWeight: 'bold',
    color: '#6200ee',
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    marginVertical: 4,
  },
  details: {
    color: '#444',
  },
  date: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
  },
});

export default TransactionHistoryScreen;
