import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function BookSessionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { teacherId, teacherName, skill, learnerId } = route.params || {};
  console.log('User ID:', teacherId);
  console.log('Username:', teacherName);
  console.log('Skill:', skill);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [amount, setAmount] = useState('5');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBooking = async () => {
    if (!teacherId) {
      Alert.alert('Error', 'Teacher ID is missing.');
      return;
    }
  
    const payload = {
      teacherId,
      skill,
      teacherName,
      learnerId,
      scheduledTime: selectedDate,
      tokenAmount: parseInt(amount),
    };
  
    console.log('Booking Payload:', payload); // Log the payload
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.post(
        'http://192.168.2.40:3000/api/sessions/book',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const { updatedLearner } = res.data;
  
      setIsModalVisible(true);
  
      navigation.navigate('dashboard', { updatedTokenBalance: updatedLearner.premiumTokenBalance });
    } catch (error) {
      console.error('Booking Error:', error.response?.data || error.message);
      Alert.alert('Booking Failed', error.response?.data?.message || 'Try again');
    }
  };
  const renderDateTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="datetime-local"
          value={selectedDate.toISOString().slice(0, 16)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          style={styles.webDatePicker}
        />
      );
    }

    return (
      <>
        <Button title="Pick Date/Time" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking session with {teacherName}</Text>
      <Text>Skill: {skill}</Text>
      {renderDateTimePicker()}
      <TextInput
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        placeholder="Token Amount"
        style={styles.input}
      />
      <Button title="Book Now" onPress={handleBooking} />

      {/* Modal for success message */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Booked!</Text>
            <Text style={styles.modalMessage}>Tokens will be held until completion.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate('dashboard'); // Navigate to dashboard
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginTop: 10, marginBottom: 20 },
  webDatePicker: { padding: 10, marginTop: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});