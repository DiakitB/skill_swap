import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "../utils/theme"; // Correct relative path
import styled from "styled-components/native";

// Styled container to apply the theme's background color
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background, // Apply theme background to header
            },
            headerTintColor: theme.colors.text, // Apply theme text color to header text
            headerTitleStyle: {
              fontSize: theme.fontSizes.subtitle, // Apply theme font size to header title
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="sign_up" options={{ title: "Sign Up" }} />
          <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
          <Stack.Screen name="complete_profile" options={{ title: "Profile" }} />
          <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
          <Stack.Screen name="Skill_matches" options={{ title: "Skill" }} />
          <Stack.Screen name="Skill_matches/[id]" options={{ title: "Skill" }} />
          <Stack.Screen name="buy_tokens" options={{ title: "Buy Tokens" }} />
          <Stack.Screen name="token_wallet" options={{ title: "Your Wallet" }} />
          <Stack.Screen name="payment" options={{ title: "Payment" }} />
          <Stack.Screen name="logout." options={{ title: "Log Out" }} />
          <Stack.Screen name="buyPrimiumTokens" options={{ title: "Buy Premium Tokens" }} />
          <Stack.Screen name="ChatScreen" options={{ title: "Chat" }} />
          <Stack.Screen name="MessagesTab" options={{ title: "Messages" }} />
          <Stack.Screen name="transactionHistory" options={{ title: "Transaction History" }} />
          <Stack.Screen name="bookingScreen" options={{ title: "Book a Session" }} />
          <Stack.Screen name="notificationScreen" options={{ title: "Notifications" }} />
          <Stack.Screen name="exploreScreen" options={{ title: "Explore Skills" }} />
        </Stack>
      </Container>
    </ThemeProvider>
  );
}