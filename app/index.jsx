import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Emitter } from 'react-native-particles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SVG_SIZE = Math.min(SCREEN_WIDTH * 0.8, 250);
const CENTER = SVG_SIZE / 2;
const DOT_RADIUS = 10;

const dots = [
  { id: 'dot1', cx: CENTER, cy: CENTER - 60 },
  { id: 'dot2', cx: CENTER - 50, cy: CENTER },
  { id: 'dot3', cx: CENTER + 50, cy: CENTER },
  { id: 'dot4', cx: CENTER, cy: CENTER + 60 },
];

export default function HomePageScreen() {
  const router = useRouter();

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const [gradientColors, setGradientColors] = useState([
    ['#ff00ff', '#00ffff'],
    ['#00ffff', '#ff00ff'],
    ['#ff8800', '#8800ff'],
  ]);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1
    );
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % gradientColors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  const gesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withTiming(1.5, { duration: 200 });
    })
    .onEnd(() => {
      scale.value = withTiming(1.2, { duration: 200 });
    });

  const currentGradient = gradientColors[colorIndex];

  return (
    <View style={styles.container}>
      {/* Logo in the top-left corner */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo_2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Wrap Emitter in a parent View */}
      <View style={StyleSheet.absoluteFill}>
        <Emitter
          numberOfParticles={60}
          emissionRate={10}
          particleLife={3000}
          direction={90}
          spread={360}
          speed={2}
          gravity={0.5}
          fromPosition={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }}
          particleStyle={{
            width: 5,
            height: 5,
            backgroundColor: '#ffffff',
            borderRadius: 2.5,
          }}
        >
          {/* Provide a single child */}
          <View />
        </Emitter>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.animationContainer, animatedStyle]}>
          <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={currentGradient[0]} stopOpacity="1" />
                <Stop offset="100%" stopColor={currentGradient[1]} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            {dots.map((dot, index) => (
              <React.Fragment key={dot.id}>
                {dots.slice(index + 1).map((targetDot) => (
                  <Line
                    key={`${dot.id}-${targetDot.id}`}
                    x1={dot.cx}
                    y1={dot.cy}
                    x2={targetDot.cx}
                    y2={targetDot.cy}
                    stroke="url(#grad)"
                    strokeWidth="2"
                  />
                ))}
                <Circle
                  cx={dot.cx}
                  cy={dot.cy}
                  r={DOT_RADIUS}
                  fill="url(#grad)"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </React.Fragment>
            ))}
          </Svg>
        </Animated.View>
      </GestureDetector>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Skill Swap</Text>
        <Text style={styles.subtitle}>Connect, Learn, and Share Knowledge Globally.</Text>
      </View>

      <TouchableOpacity
        style={styles.ctaContainer}
        onPress={() => router.push('./sign_up')}
      >
        <Text style={styles.ctaText}>Join Now & Start Learning!</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => router.push('./login')}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    paddingTop: 60,
    paddingBottom: 30,
    overflow: 'hidden',
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  animationContainer: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Avenir-Heavy',
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#cfcfcf',
    textAlign: 'center',
  },
  ctaContainer: {
    backgroundColor: '#ff00ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: '#ff00ff',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  outlineButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});