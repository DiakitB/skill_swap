import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const URL = "http://192.168.2.40:3000/api/auth/complete-profile";

const CompleteProfileForm = () => {
  const [name, setName] = useState('');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [socialLinks, setSocialLinks] = useState({ facebook: '', twitter: '', linkedin: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [geolocation, setGeolocation] = useState({ latitude: null, longitude: null });
  const [availability, setAvailability] = useState(''); // State for availability
  const navigation = useNavigation();

  // Function to fetch geolocation
  const fetchGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          alert('Unable to fetch location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Fetch geolocation when the component mounts
  useEffect(() => {
    fetchGeolocation();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };
  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }
    console.log('User ID:', userId);
    // Input validation
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }
  
    if (!skillsOffered.trim()) {
      alert('Please provide at least one skill you can teach.');
      return;
    }
  
    if (!skillsWanted.trim()) {
      alert('Please provide at least one skill you want to learn.');
      return;
    }
  
    if (!/^[a-zA-Z0-9\s,.-]+$/.test(availability)) {
      alert('Availability contains invalid characters.');
      return;
    }
  
    // Prepare the user profile data
    const userProfile = {
      userId: userId,
      name: name.trim(),
      skillsOffered: Array.isArray(skillsOffered)
        ? skillsOffered
        : skillsOffered.split(',').map((skill) => skill.trim()),
      skillsWanted: Array.isArray(skillsWanted)
        ? skillsWanted
        : skillsWanted.split(',').map((skill) => skill.trim()),
      socialLinks: {
        facebook: socialLinks.facebook.trim(),
        twitter: socialLinks.twitter.trim(),
        linkedin: socialLinks.linkedin.trim(),
      },
      profilePicture: profilePicture || null,
      geolocation: {
        latitude: geolocation.latitude || null,
        longitude: geolocation.longitude || null,
      },
      availability: availability.trim(),
    };
  
    // Log the data being sent to the server
    console.log('User Profile Data:', userProfile);
  
    try {
      const response = await axios.post(URL, userProfile, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Response:', response.data);
  
      if (response.data && response.data.message === "Profile updated successfully") {
        alert('Profile updated successfully');
        navigation.navigate('dashboard');
      } else {
        alert(response.data.message || 'Error updating profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('An error occurred while updating the profile');
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Complete Your Profile</Text>
      <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center', marginVertical: 10 }}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
            <Text>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput placeholder="Your Name" value={name} onChangeText={setName} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput placeholder="Skills You Can Teach" value={skillsOffered} onChangeText={setSkillsOffered} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput placeholder="Skills You Want to Learn" value={skillsWanted} onChangeText={setSkillsWanted} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput placeholder="Facebook Link" value={socialLinks.facebook} onChangeText={(text) => setSocialLinks({ ...socialLinks, facebook: text })} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput placeholder="Twitter Link" value={socialLinks.twitter} onChangeText={(text) => setSocialLinks({ ...socialLinks, twitter: text })} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput placeholder="LinkedIn Link" value={socialLinks.linkedin} onChangeText={(text) => setSocialLinks({ ...socialLinks, linkedin: text })} style={{ borderWidth: 1, marginVertical: 10, padding: 8 }} />
      <TextInput
        placeholder="Location (Latitude, Longitude)"
        value={`${geolocation.latitude || ''}, ${geolocation.longitude || ''}`}
        onChangeText={(text) => {
          const [latitude, longitude] = text.split(',').map((coord) => coord.trim());
          setGeolocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
        }}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Availability (e.g., Weekdays 9 AM - 5 PM)"
        value={availability}
        onChangeText={setAvailability}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="Complete Profile" onPress={handleSubmit} />
    </View>
  );
};

export default CompleteProfileForm;