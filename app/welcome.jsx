import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
  { id: 1, text: "Find people who want to learn from you.", image: require('../assets/images/c1.png') },
  { id: 2, text: "Exchange skills and knowledge in real-time.", image: require('../assets/images/c3.png') },
  { id: 3, text: "Grow your skills and connect globally!", image: require('../assets/images/c2.png') },
];

const WelcomeScreen = () => {
  const router = useRouter();
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={[styles.slideContainer, { width }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.slideText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Skill Swap!</Text>
      <Text style={styles.subtitle}>Learn and teach skills with people worldwide.</Text>
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        nestedScrollEnabled={true}  // 🔥 Enables better scrolling
        contentContainerStyle={{ height: height * 0.5 }} // 🔥 Explicit height to prevent layout issues
        scrollEventThrottle={16} // 🔥 Smooth performance
        extraData={slides} // 🔥 Forces re-rendering if needed
      />
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/complete_profile')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 🔥 Ensures the container takes the full screen
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#374151',
    marginBottom: 20,
  },
  slideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  slideText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;





