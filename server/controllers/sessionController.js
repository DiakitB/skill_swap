const MatchingSession = require('../models/matchingSession');
const PendingTokenTransfer = require('../models/pendingTokenTransfer');
const User = require('../models/user');
const Notification = require('../models/notification');

exports.bookSession = async (req, res) => {
  const { teacherId, skill, tokenAmount, learnerId , scheduledTime} = req.body;

  if (!teacherId || !skill || !tokenAmount || tokenAmount <= 0) {
    return res.status(400).json({ message: 'Missing or invalid data' });
  }

  try {
    const learner = await User.findById(learnerId);
    const teacher = await User.findById(teacherId);
    if (!learner || !teacher) return res.status(404).json({ message: 'User not found' });
    if (learner.tokenBalance < tokenAmount) return res.status(400).json({ message: 'Insufficient tokens' });

    // Deduct tokens from learner and hold them
    learner.tokenBalance -= tokenAmount;
    await learner.save();

    const pendingTransfer = new PendingTokenTransfer({
      fromUser: learnerId,
      toUser: teacherId,
      tokenAmount, // Use tokenAmount here
      description: `Teaching session for ${skill}`,
    });
    await pendingTransfer.save();

    const session = new MatchingSession({
      learner: learnerId,
      teacher: teacherId,
      skill,
      pendingTransferId: pendingTransfer._id,
    });
    await session.save();
    // Notify teacher about the new session
    await Notification.create({
      user: teacherId, // recipient
      message: `${learner.name} booked a session with you on ${scheduledTime}  for ${skill}.`,
    });
    
    res.status(201).json({ message: 'Session created. Tokens held.', session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.confirmSession = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;
  
    try {
      const session = await MatchingSession.findById(sessionId).populate('pendingTransferId');
      if (!session) return res.status(404).json({ message: 'Session not found' });
      if (session.learner.toString() !== userId) return res.status(403).json({ message: 'Only learner can confirm' });
      if (session.status === 'confirmed') return res.status(400).json({ message: 'Already confirmed' });
  
      const transfer = session.pendingTransferId;
      if (!transfer || transfer.status !== 'pending') return res.status(400).json({ message: 'Invalid transfer state' });
  
      // Release tokens to teacher
      const teacher = await User.findById(transfer.toUser);
      teacher.premiumTokenBalance += transfer.tokenAmount;
      await teacher.save();
  
      transfer.status = 'completed';
      await transfer.save();
  
      session.status = 'confirmed';
      await session.save();
  
      res.json({ message: 'Session confirmed and tokens transferred.', session });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

   