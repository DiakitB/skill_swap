const User = require('../models/user');
const TokenTransaction = require('../models/tokenTransaction');
const PendingTokenTransfer = require('../models/pendingTokenTransfer');

// Get token balances
exports.getTokenBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      skillTokens: user.tokenBalance,
      premiumTokens: user.premiumTokenBalance,
      totalEarnedTokens: user.totalEarnedTokens || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Transfer skill tokens to another user


exports.initiateTokenTransfer = async (req, res) => {
  console.log('Initiating token transfer...'); // Debugging line
  const { toUserId, amount, description } = req.body;
  const fromUserId = req.user.id;

  if (!toUserId || !amount) return res.status(400).json({ message: 'Missing fields' });
  if (fromUserId === toUserId) return res.status(400).json({ message: "Can't send tokens to yourself" });

  try {
    const fromUser = await User.findById(fromUserId);
    if (!fromUser || fromUser.tokenBalance < amount) {
      return res.status(400).json({ message: 'Insufficient tokens or user not found' });
    }

    fromUser.tokenBalance -= amount;
    await fromUser.save();

    const pending = new PendingTokenTransfer({
      fromUser: fromUserId,
      toUser: toUserId,
      amount,
      description,
    });

    await pending.save();

    res.json({ message: 'Token held in escrow. Awaiting confirmation.', pendingId: pending._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Cash out tokens (500 tokens = $50)
exports.cashOutTokens = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.tokenBalance < 500) {
      return res.status(400).json({ message: 'Not enough tokens to cash out (min 500).' });
    }

    user.tokenBalance -= 500;
    user.totalEarnedTokens = (user.totalEarnedTokens || 0) + 500;

    // TODO: Add payment logic (e.g., integrate PayPal/Stripe)
    await user.save();

    res.json({ message: 'Cashout successful! $50 will be sent shortly.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Buy premium tokens
exports.buyPremiumTokens = async (req, res) => {
  console.log('Buying premium tokens...');
  const { amount } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update premium token balance
    user.premiumTokenBalance += amount;

    // Record transaction
    user.transactions.push({
      type: 'purchase',
      amount,
      details: `Purchased ${amount} premium tokens`
    });

    await user.save();

    res.json({ message: `${amount} Premium Tokens added.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.confirmTokenTransfer = async (req, res) => {
  const { pendingId } = req.body;
  const userId = req.user.id;

  try {
    const pending = await PendingTokenTransfer.findById(pendingId);
    if (!pending || pending.fromUser.toString() !== userId) {
      return res.status(404).json({ message: 'Pending transfer not found or unauthorized' });
    }

    if (pending.confirmed) {
      return res.status(400).json({ message: 'Transfer already confirmed' });
    }

    const toUser = await User.findById(pending.toUser);
    if (!toUser) return res.status(404).json({ message: 'Receiver not found' });

    toUser.tokenBalance += pending.amount;
    pending.confirmed = true;

    await toUser.save();
    await pending.save();

    const transaction = new TokenTransaction({
      fromUser: pending.fromUser,
      toUser: pending.toUser,
      tokens: pending.amount,
      description: pending.description || 'Confirmed token transfer',
    });

    await transaction.save();

    res.json({ message: 'Token released to teacher', transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
