import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable"; // ✅ Import Animatable

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SkillExplorerScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://192.168.2.40:3000/api/skills/available-skills"
        );
        console.log("Users fetched:", response.data);
        setUsers(response.data.skills);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserTap = async (otherUserId, otherUserName) => {
    if (!otherUserId || !otherUserName) {
      console.error("Invalid navigation parameters: userId or userName is missing.");
      return;
    }
    console.log("Navigating to ChatScreen with:", {
      userId: otherUserId,
      username: otherUserName,
    });
    navigation.navigate("ChatScreen", { userId: otherUserId, username: otherUserName });
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" />;

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack('/dashboard')}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      {/* Animated Header */}
      <Animatable.Text animation="bounceInDown" duration={800} style={styles.header}>
        Explore Skills
      </Animatable.Text>

      {/* Animated List */}
      <FlatList
        data={users}
        keyExtractor={(item, index) => `${item.userId}-${item.skill}-${index}`}
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={700}
            delay={index * 100}
            style={styles.userCard}
          >
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.skillsHeader}>Skills Offered:</Text>
            {item.skill ? (
              <Text style={styles.skillText}>- {item.skill}</Text>
            ) : (
              <Text style={styles.noSkillsText}>No skills offered</Text>
            )}
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleUserTap(item.userId, item.userName)}
            >
              <Text style={styles.chatButtonText}>Chat Now</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Arial",
    marginTop: 60, // Avoid overlapping with the back button
  },
  userCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userName: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "700",
    marginBottom: 10,
  },
  skillsHeader: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
    marginBottom: 5,
  },
  skillText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  noSkillsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
