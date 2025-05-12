import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Home'}}/>
      <Stack.Screen name="sign_up" options={{title: "Sign Up"}}/>
      <Stack.Screen name="welcome" options={{title: "Welcome"}}/>
      <Stack.Screen name="complete_profile" options={{title: "Profile"}}/>
      <Stack.Screen name="dashboard" options={{title: "Dashboard"}}/>
      <Stack.Screen name="Skill_matches" options={{title: "Skill"}}/>
      <Stack.Screen name="Skill_matches/[id]" options={{title: "Skill"}}/>
      <Stack.Screen name="buy_tokens" options={{title: "Buy Tokens"}}/>
      <Stack.Screen name="token_wallet" options={{title: "Your wallet"}}/>
      <Stack.Screen name="payment" options={{title: "Payment"}}/>
      <Stack.Screen name="logout." options={{title: "log out"}}/>
      <Stack.Screen name="buyPrimiumTokens" options={{title: "Buy Premium Tokens"}}/>
      <Stack.Screen name="ChatScreen" options={{title: "Chat"}} />
       <Stack.Screen name="MessagesTab" options={{title: "Message"}} />
       <Stack.Screen name="transactionHistory" options={{title: "Transaction History"}} />
       <Stack.Screen name="bookingScreen" options={{title: "Book a Session"}} />
       <Stack.Screen name="notificationScreen" options={{title: "Notification"}} />


      
      </Stack>
  )
}


////  8:20   20:20