const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');

router.get('/users', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  res.json(users);
});

router.post('/users', async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
});

router.post('/claim/:userId', async (req, res) => {
  const userId = req.params.userId;
  const randomPoints = Math.floor(Math.random() * 10) + 1;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalPoints: randomPoints } },
    { new: true }
  );

  const history = new History({ userId, points: randomPoints });
  await history.save();

  res.json({ user, pointsClaimed: randomPoints });
});

router.get('/history', async (req, res) => {
  const history = await History.find().populate('userId', 'name');
  res.json(history);
});

module.exports = router;
