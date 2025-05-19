import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';// Import Ionicons for the notification icon

const GETME_URL = 'http://192.168.2.40:3000/api/users/me';
const LOG_OUT_URL = 'http://192.168.2.40:3000/api/auth/logout';

const Card = ({ title, children, style }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return navigation.navigate('login');
      await axios.post(LOG_OUT_URL, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('login');
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    }
  };

  const fetchUser = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) return navigation.navigate('login');

      const res = await axios.get(GETME_URL, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const fetchedUser = res.data?.data?.user;
      if (!fetchedUser) return navigation.navigate('login');
      setUser(fetchedUser);

      // Smooth animation with scale and opacity
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Increased duration
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // Enable native driver
      }).start();
    } catch (err) {
      if (err.response?.status === 401) navigation.navigate('login');
      else console.error('User fetch error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigation]);

  useEffect(() => {
    if (user?.profile?.geolocation) {
      const { latitude, longitude } = user.profile.geolocation;
      fetchLocation(latitude, longitude);
    }
  }, [user]);

  const fetchLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const { city, town, village, country } = response.data.address;
      setLocation({
        city: city || town || village || 'Unknown City',
        country: country || 'Unknown Country',
      });
    } catch (err) {
      console.error('Location fetch error:', err.message);
    }
  };

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) return navigation.navigate('login');
        const response = await axios.get('http://192.168.2.40:3000/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUnreadCount(response.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchUnreadNotifications();
  }, [navigation]);

  // Set header with bell icon and badge
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.bellContainer}
            onPress={async () => {
              try {
                // Navigate to the notification screen
                navigation.navigate('notificationScreen');
  
                // Mark all notifications as read
                const authToken = await AsyncStorage.getItem('authToken');
                if (authToken) {
                  await axios.patch('http://192.168.2.40:3000/api/notifications/mark-all-read', {}, {
                    headers: { Authorization: `Bearer ${authToken}` },
                  });
  
                  // Fetch the updated unread count
                  const response = await axios.get('http://192.168.2.40:3000/api/notifications/unread-count', {
                    headers: { Authorization: `Bearer ${authToken}` },
                  });
                  setUnreadCount(response.data.count || 0);
                  console.log('Notifications marked as read:', response.data.count || 0);
                }
              } catch (error) {
                console.error('Failed to mark notifications as read:', error);
              }
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="yellow" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
  
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={24} color="#ff595e" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, unreadCount]);

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUser(); // Fetch updated user data when the screen is focused
    });
    return unsubscribe;
  }, [navigation]);

  const getCardBackgroundColor = (type, value) => {
    if (type === 'skills') {
      return value.length > 0 ? '#d1f7c4' : '#f7d1d1'; // Green for non-empty, red for empty
    }
    if (type === 'tokens') {
      if (value > 50) return '#c4f1f7'; // Light blue for high balance
      if (value > 20) return '#f7e1c4'; // Yellow for medium balance
      return '#f7d1d1'; // Red for low balance
    }
    return '#fff'; // Default white
  };

  if (!user) return <Text style={styles.loading}>Loading Dashboard...</Text>;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1], // Scale from 90% to 100%
              }),
            },
          ],
        },
      ]}
    >
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 80 }]}>
        <Text style={styles.welcome}>Hey {user.name}! 👋</Text>
        <Text style={styles.location}>
          {location?.city}, {location?.country}
        </Text>

        <Card
          title="🎯 Skills Offered"
          style={{
            backgroundColor: getCardBackgroundColor(
              'skills',
              user.profile.skillsOffered || []
            ),
          }}
        >
          <Text style={styles.cardContent}>
            {user.profile.skillsOffered?.join(', ') || 'No skills added yet'}
          </Text>
        </Card>

        <Card
          title="🎯 Skills Wanted"
          style={{
            backgroundColor: getCardBackgroundColor(
              'skills',
              user.profile.skillsWanted || []
            ),
          }}
        >
          <Text style={styles.cardContent}>
            {user.profile.skillsWanted?.join(', ') || 'No skills selected yet'}
          </Text>
        </Card>

        <Card
          title="💎 Premium Tokens"
          style={{
            backgroundColor: getCardBackgroundColor(
              'tokens',
              user.premiumTokenBalance
            ),
          }}
        >
          <Text style={styles.tokenAmount}>{user.premiumTokenBalance}</Text>
        </Card>

        <View style={styles.tokenRow}>
          <TouchableOpacity
            style={[styles.tokenBtn, { backgroundColor: '#3B82F6' }]}
            onPress={() => navigation.navigate('buyPrimiumTokens')}
          >
            <Text style={styles.tokenBtnText}>Buy Tokens</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tokenRow}>
          <TouchableOpacity
            style={[styles.tokenBtn, { backgroundColor: '#F59E0B' }]}
            onPress={() => navigation.navigate('transfer_tokens')}
          >
            <Text style={styles.tokenBtnText}>Transfer Tokens</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tokenRow}>
          <TouchableOpacity
            style={[styles.tokenBtn, { backgroundColor: '#8B5CF6' }]}
            onPress={() => navigation.navigate('transactionHistory')}
          >
            <Text style={styles.tokenBtnText}>Transaction History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tokenBtn, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('premium_features')}
          >
            <Text style={styles.tokenBtnText}>Premium Features</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('skill_matches')}>
          <Feather name="users" size={20} color="#0077b6" />
          <Text style={styles.navText}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('MessagesTab', { user })}>
          <Feather name="message-circle" size={20} color="#0077b6" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('exploreScreen')}>
          <Feather name="search" size={20} color="#0077b6" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icont_text: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
  },
  scroll: {
    padding: 20,
    paddingBottom: 80, // Ensures content doesn't overlap with the tab bar
  },
  loading: {
    fontSize: 20,
    marginTop: 100,
    textAlign: 'center',
    color: '#555',
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1c1c1c',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#444',
  },
  tokenAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077b6',
    marginTop: 4,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tokenBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tokenBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editBtn: {
    backgroundColor: '#0077b6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    marginLeft: 16,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#0077b6',
    marginTop: 4,
  },
  bellContainer: {
    marginRight: 16,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  bellContainer: {
    marginRight: 16,
    position: 'relative', // Ensure the badge is positioned relative to the bell icon
  },
  badge: {
    position: 'absolute',
    top: -5, // Adjust to position the badge above the bell icon
    right: -5, // Adjust to position the badge to the right of the bell icon
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginLeft: 16,
  },
});