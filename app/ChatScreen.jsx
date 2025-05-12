import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; // Import useRoute

const BASE_URL = 'http://192.168.2.40:3000/api/messages'; // Adjust the base URL as needed

const ChatScreen = () => {
  const route = useRoute(); // Use useRoute to access route parameters
  const { userId, username } = route.params || {}; // Safely access route.params
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchMessages();
    } else {
      console.error('No userId provided in route.params');
    }
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // Fetch token from AsyncStorage
      console.log('Fetching messages for userId:', userId);
      console.log('Token:', token);
      const response = await axios.get(`${BASE_URL}/user/${userId}`, {
        
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data);
      markUnreadAsRead(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const markUnreadAsRead = async (msgs) => {
    const unread = msgs.filter((msg) => !msg.isRead && msg.receiver === userId);
    unread.forEach(async (msg) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        await axios.patch(`${BASE_URL}/${msg._id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    });
  };

  const handleSend = async () => {
    if (!content.trim()) return;
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(
        `${BASE_URL}`, // Corrected URL
        {
          receiver: userId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setMessages((prev) => [...prev, response.data]);
      setContent('');
      scrollToEnd();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }) => {
    const isOwnMessage = item.sender === userId;
    return (
      <View style={[styles.messageBubble, isOwnMessage ? styles.sent : styles.received]}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  };

  if (!userId || !username) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid navigation parameters.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.header}>{username}</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={scrollToEnd}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '75%',
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#d0e8ff',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#3478f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});