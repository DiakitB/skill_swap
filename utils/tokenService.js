// utils/tokenService.js

import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL_BUY_TOKEN = "http://localhost:3000/api/tokens/buy-token";

export const processBuyTokens = async (amount) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'User is not authenticated');
      return false;
    }

    const response = await axios.post(
      URL_BUY_TOKEN,
      { amount: parseInt(amount) },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      Alert.alert('Success', response.data.message);
      return true;
    } else {
      Alert.alert('Error', response.data.message || 'Something went wrong');
      return false;
    }
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Server error');
    return false;
  }
};
