import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutScreen = ({ setUser }) => { // Pass setUser as a prop
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // Clear the token from storage
      setUser(null); // Clear the user state
      Alert.alert('Success', 'Logout successful');
      navigation.navigate('Login'); // Redirect to login screen
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong during logout');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to logout?</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogoutScreen;