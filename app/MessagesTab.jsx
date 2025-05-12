import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.2.40:3000/api/messages';

const MessagesTab = () => {

  const [conversations, setConversations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // Fetch the token from AsyncStorage
      console.log('Fetching token...from MessagesTab');
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.error('No token found');
        return;
      }
  
     
      console.log('making API request to fetch conversations...');
      const response = await axios.get(`${BASE_URL}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Conversations response:', response);
      console.log('Conversations:', response.data);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => navigation.navigate('ChatScreen', { userId: item.userId, username: item.username })}
      >
        <View style={styles.header}>
          <Text style={styles.username}>{item.username}</Text>
          {!item.message.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.message.sender === item.userId ? `${item.username}: ` : 'You: '}
          {item.message.content}
        </Text>
        <Text style={styles.timestamp}>{new Date(item.message.timestamp).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default MessagesTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  conversationCard: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3478f6',
  },
});