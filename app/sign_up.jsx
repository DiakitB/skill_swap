import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing the token securely

const URL = "http://192.168.2.40:3000/api/auth/signup";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const router = useRouter();

  const handleSignUp = async () => {
    console.log("Sign Up Button Pressed");
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const userData = { email, password };
    console.log("User Data:", userData);
  
    try {
      // Send signup request to the backend
      const response = await axios.post(URL, userData, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Response Data:", response.data);
  
      // Extract token and userId from response
      const { token, userId } = response.data;
      if (!token || !userId) {
        throw new Error("Token or User ID not found in response");
      }
  
      // Store token and userId in AsyncStorage
      console.log(token, userId);
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userId", userId);
      console.log("Token and User ID stored in AsyncStorage");
  
      // Show modal if signup is successful
      if (response.data.success) {
        setIsModalVisible(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Abstract Shapes */}
      <View style={styles.backgroundShapes} />

      {/* Header Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Create an account to connect, learn, and share knowledge.
        </Text>
      </View>

      {/* Form Inputs */}
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.ctaContainer} onPress={handleSignUp}>
          <Text style={styles.ctaText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Buttons */}
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => router.push("/")}
        >
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>Your account has been created successfully.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsModalVisible(false);
                router.push("/welcome"); // Redirect to welcome screen
              }}
            >
              <Text style={styles.modalButtonText}>Go to Welcome</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    position: "relative",
  },
  backgroundShapes: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E0F7FA",
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }, { translateY: -150 }],
    opacity: 0.3,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Avenir-Heavy",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#374151",
    textAlign: "center",
    marginHorizontal: 30,
    fontFamily: "Avenir-Medium",
  },
  formContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  ctaContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  ctaText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Avenir-Heavy",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Avenir-Heavy",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  outlineButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Avenir-Heavy",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});