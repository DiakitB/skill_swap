import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
// import LottieView from "lottie-react-native";
// import { MotiView } from "moti";
import { useRouter } from "expo-router";

export default function HomePageScreen() {
  const router = useRouter();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // useEffect(() => {
  //   // Preload the animation file to ensure it is valid
  //   const preloadAnimation = async () => {
  //     try {
  //       const animation = require("../assets/animations/matching.json");
  //       if (animation) {
  //         setAnimationLoaded(true);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load animation:", error);
  //       setAnimationLoaded(false);
  //     }
  //   };
  //   preloadAnimation();
  // }, []);

  return (
    <View style={styles.container}>
      {/* Background Abstract Shapes */}
      <View style={styles.backgroundShapes} />

      {/* Lottie Animation Positioned at the Top */}
      {/* <View style={styles.animationContainer}>
        {animationLoaded ? (
          <LottieView
            source={require("../assets/animations/matching.json")}
            autoPlay
            loop
            style={styles.animation}
            onError={(error) => console.error("Lottie error:", error)}
          />
        ) : (
          <Text style={styles.errorText}>Animation failed to load</Text>
        )}
      </View> */}

      {/* Animated Header Text */}
      {/* <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1000 }}
        style={styles.textContainer}
      >
        <Text style={styles.title}>Skill Swap</Text>
        <Text style={styles.subtitle}>
          Connect, Learn, and Share Knowledge Globally.
        </Text>
      </MotiView> */}

      {/* Call to Action */}
      <TouchableOpacity
        style={styles.ctaContainer}
        onPress={() => router.push("./sign_up")}
      >
        <Text style={styles.ctaText}>Join Now & Start Learning!</Text>
      </TouchableOpacity>

      {/* Buttons Stay Visible */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => router.push("./login")}
        >
          <Text style={styles.outlineButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
  animationContainer: {
    width: "100%",
    alignItems: "center",
    height: 250,
    marginBottom: 20,
  },
  animation: {
    width: 180,
    height: 180,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
    marginBottom: 20,
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
});