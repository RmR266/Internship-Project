const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');

// GET users with pagination and setting page limit
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find()
      .sort({ totalPoints: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, totalPages });
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching users' });
  }
});

// POST new user with duplicate name check
router.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const existingUser = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this name already exists' });
    }

    const user = new User({ name: name.trim() });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating user' });
  }
});

// POST claim points
router.post('/claim/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: randomPoints } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const history = new History({ userId, points: randomPoints });
    await history.save();

    res.json({ user, pointsClaimed: randomPoints });
  } catch (err) {
    res.status(500).json({ error: 'Server error during claim' });
  }
});

// GET claim history
router.get('/history', async (req, res) => {
  try {
    const history = await History.find()
      .populate('userId', 'name')
      .sort({ claimedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching history' });
  }
});

module.exports = router;
