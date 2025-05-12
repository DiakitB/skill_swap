import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SkillMatches() {
  const [matches, setMatches] = useState([]);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMatches = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (!storedToken) {
        console.error('No token found in AsyncStorage');
        return;
      }
      setToken(storedToken);

      // Extract the current user ID from the token
      const base64Url = storedToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      const userId = decodedData?.userId || decodedData?.id;
      setCurrentUserId(userId);

      try {
        const res = await axios.get('http://192.168.2.40:3000/api/users/skill-matches', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const matchedUsers = res.data?.data?.matchedUsers || [];
        console.log('Matched Users:', matchedUsers);

        const matchesWithLocation = await Promise.all(
          matchedUsers.map(async (match) => {
            const geolocation = match?.profile?.geolocation;
            const { latitude, longitude } = geolocation || {};

            let location = { city: 'Unknown City', country: 'Unknown Country' };
            if (latitude && longitude) {
              location = await fetchLocation(latitude, longitude);
            }

            return { ...match, location };
          })
        );

        setMatches(matchesWithLocation);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  const fetchLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const { city, town, village, country } = response.data.address;
      return {
        city: city || town || village || 'Unknown City',
        country: country || 'Unknown Country',
      };
    } catch (err) {
      console.error('Location fetch error:', err.message);
      return { city: 'Unknown City', country: 'Unknown Country' };
    }
  };

  const handleConnect = (match) => {
    if (!match || !match._id || !match.name) {
      console.error('Invalid match data:', match);
      return;
    }

    navigation.navigate('ChatScreen', {
      userId: match._id,
      username: match.name,
    });
  };

  const handleBookSession = (match, currentUserId) => {
    if (!match || !match._id || !match.name || !currentUserId) {
      console.error('Invalid match data or user ID:', { match, currentUserId });
      return;
    }
    console.log('Booking session with:', match);
    console.log('Match ID:', match._id);
    console.log('Match Name:', match.name);
    console.log('Match Profile:', match.profile.skillsOffered);
    console.log('Current User ID:', currentUserId);
    navigation.navigate('bookingScreen', {
      teacherId: match._id,
      teacherName: match.name,
      skill: match.profile.skillsOffered[0] || 'Unknown Skill',
      learnerId: currentUserId, // Pass the current user ID
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Matches</Text>

      {matches.length === 0 ? (
        <Text style={styles.message}>No matches found yet. Try updating your profile.</Text>
      ) : (
        matches.map((match, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.label}>👤 Name</Text>
            <Text style={styles.detail}>{match.name || 'Unknown User'}</Text>

            <Text style={styles.label}>📍 Location</Text>
            <Text style={styles.detail}>
              {match.location ? `${match.location.city}, ${match.location.country}` : 'Fetching location...'}
            </Text>

            <Text style={styles.label}>🎯 Skills Wanted</Text>
            {match.profile?.skillsWanted?.length ? (
              match.profile.skillsWanted.map((skill, i) => (
                <Text key={i} style={styles.skill}>{skill}</Text>
              ))
            ) : (
              <Text style={styles.skill}>No skills listed</Text>
            )}

            <Text style={styles.label}>💡 Skills Offered</Text>
            {match.profile?.skillsOffered?.length ? (
              match.profile.skillsOffered.map((skill, i) => (
                <Text key={i} style={styles.skill}>{skill}</Text>
              ))
            ) : (
              <Text style={styles.skill}>No skills listed</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.connectButton} onPress={() => handleConnect(match)}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookSession(match, currentUserId)}
              >
                <Text style={styles.bookButtonText}>Book Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  label: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 4 },
  detail: { fontSize: 15, color: '#6B7280' },
  skill: { fontSize: 15, color: '#10B981', marginTop: 4 },
  message: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 40 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  connectButton: { flex: 1, backgroundColor: '#2563EB', padding: 10, borderRadius: 8, marginRight: 5 },
  connectButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  bookButton: { flex: 1, backgroundColor: '#10B981', padding: 10, borderRadius: 8, marginLeft: 5 },
  bookButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});