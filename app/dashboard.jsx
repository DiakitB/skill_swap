import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GETME_URL = 'http://192.168.2.40:3000/api/users/me';
const LOG_OUT_URL = 'http://192.168.2.40:3000/api/auth/logout';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        navigation.navigate('login');
        return;
      }

      await axios.post(LOG_OUT_URL, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      await AsyncStorage.removeItem('authToken');
      navigation.navigate('login');
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          navigation.navigate('login');
          return;
        }

        const res = await axios.get(GETME_URL, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const fetchedUser = res.data?.data?.user;
        console.log('Fetched user:', fetchedUser);
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      } catch (err) {
        if (err.response?.status === 401) navigation.navigate('login');
        else console.error('User fetch error:', err.response?.data || err.message);
      }
    };

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
      console.log('Location response:', response.data);
      const { city, town, village, country } = response.data.address;
      setLocation({
        city: city || town || village || 'Unknown City',
        country: country || 'Unknown Country',
      });
    } catch (err) {
      console.error('Location fetch error:', err.message);
    }
  };

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          navigation.navigate('login');
          return;
        }
  
        const response = await axios.get('http://192.168.2.40:3000/api/notifications/unread-count', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        const data = response.data;
        setUnreadCount(data.count || 0); // Ensure `data.count` is the number of unread notifications
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
              }
            } catch (error) {
              console.error('Failed to mark notifications as read:', error);
            }
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, unreadCount]);
  if (!user) return <Text style={styles.loading}>Loading Dashboard...</Text>;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.greeting}>👋  {user.name || 'User'}</Text>

        <View style={[styles.card, styles.tokenBox]}>
          <Text style={styles.tokenLabel}>💰 Token Balance:</Text>
          <Text style={styles.tokenValue}>{user.premiumTokenBalance || 0} tokens</Text>
        </View>

        <View style={styles.tokenRow}>
          <TouchableOpacity style={[styles.tokenBtn, { backgroundColor: '#3B82F6' }]} onPress={() => navigation.navigate('buyPrimiumTokens')}>
            <Text style={styles.tokenBtnText}>Buy Tokens</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tokenRow}>
          <TouchableOpacity style={[styles.tokenBtn, { backgroundColor: '#F59E0B' }]} onPress={() => navigation.navigate('transfer_tokens')}>
            <Text style={styles.tokenBtnText}>Transfer Tokens</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tokenRow}>
          <TouchableOpacity style={[styles.tokenBtn, { backgroundColor: '#8B5CF6' }]} onPress={() => navigation.navigate('transactionHistory')}>
            <Text style={styles.tokenBtnText}>Transaction History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tokenBtn, { backgroundColor: '#10B981' }]} onPress={() => navigation.navigate('premium_features')}>
            <Text style={styles.tokenBtnText}>Premium Features</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}><Text style={styles.label}>📅 Availability</Text><Text style={styles.detail}>{user.profile?.availability || 'Not specified'}</Text></View>

        <View style={styles.card}><Text style={styles.label}>📍 Location</Text><Text style={styles.detail}>{location ? `${location.city}, ${location.country}` : 'Fetching location...'}</Text></View>

        <View style={styles.card}><Text style={styles.label}>🛠️ Skills Offered</Text>{user.profile?.skillsOffered?.length ? user.profile.skillsOffered.map((skill, i) => <Text key={i} style={styles.skill}>{skill}</Text>) : <Text style={styles.skill}>No skills listed</Text>}</View>

        <View style={styles.card}><Text style={styles.label}>🎯 Skills Wanted</Text>{user.profile?.skillsWanted?.length ? user.profile.skillsWanted.map((skill, i) => <Text key={i} style={styles.skill}>{skill}</Text>) : <Text style={styles.skill}>No skills listed</Text>}</View>

        <View style={styles.card}>
          <Text style={styles.label}>🔗 Social Links</Text>
          {user.profile?.socialLinks ? (
            <>
              {user.profile.socialLinks.facebook && <Text style={styles.link} onPress={() => Linking.openURL(user.profile.socialLinks.facebook)}>Facebook</Text>}
              {user.profile.socialLinks.twitter && <Text style={styles.link} onPress={() => Linking.openURL(user.profile.socialLinks.twitter)}>Twitter</Text>}
              {user.profile.socialLinks.linkedin && <Text style={styles.link} onPress={() => Linking.openURL(user.profile.socialLinks.linkedin)}>LinkedIn</Text>}
            </>
          ) : <Text style={styles.detail}>No links added</Text>}
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('skill_matches')}>
          <Text style={styles.navText}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('MessagesTab', { user })}>
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Explore')}>
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F9FAFB' },
  logout: { position: 'absolute', top: 20, right: 20, backgroundColor: '#EF4444', padding: 8, borderRadius: 8, zIndex: 10 },
  logoutText: { color: '#fff', fontWeight: '600' },
  scrollContainer: { flexGrow: 1, padding: 24 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  label: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 4 },
  detail: { fontSize: 15, color: '#6B7280' },
  skill: { fontSize: 15, color: '#10B981', marginTop: 4 },
  link: { fontSize: 15, color: '#3B82F6', textDecorationLine: 'underline', marginTop: 4 },
  tokenBox: { backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#38BDF8', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tokenLabel: { fontSize: 16, fontWeight: '600', color: '#0369A1' },
  tokenValue: { fontSize: 18, fontWeight: '700', color: '#0284C7' },
  tokenRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  tokenBtn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  tokenBtnText: { color: '#fff', fontWeight: '600' },
  editBtn: { backgroundColor: '#6366F1', padding: 14, borderRadius: 12, alignItems: 'center', marginVertical: 30 },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loading: { fontSize: 18, textAlign: 'center', marginTop: 50, color: '#6B7280' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb' },
  navBtn: { alignItems: 'center' },
  navText: { fontSize: 14, color: '#4B5563', fontWeight: '600' },
  bellContainer: { marginRight: 16, position: 'relative' },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'yellow', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2 },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: 'black' },
});