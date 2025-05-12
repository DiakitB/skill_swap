import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TokenWallet() {
  const navigation = useNavigation();
  const tokenBalance = 120; // Replace this with dynamic value from backend later

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Token Wallet</Text>

      <View style={styles.walletCard}>
        <Image
          source={require('./../assets/images/token.png')} // Replace with your token icon
          style={styles.tokenIcon}
        />
        <Text style={styles.balanceLabel}>Token Balance</Text>
        <Text style={styles.balanceValue}>{tokenBalance} 🪙</Text>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('BuyTokens')}>
        <Text style={styles.buyButtonText}>Buy More Tokens</Text>
      </TouchableOpacity>

      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('WithdrawTokens')}>
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransferTokens')}>
          <Text style={styles.actionText}>Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TokenHistory')}>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tokenIcon: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  buyButton: {
    marginTop: 24,
    backgroundColor: '#6366F1',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  actionGroup: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    fontWeight: '600',
    color: '#374151',
  },
});
