const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB models
const User = require('./models/User');

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  // 🔽 Seed users if collection is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const names = [
      'Rohit',
      'Rohan',
      'Mahir',
      'Tom',
      'Silva',
      'David',
      'John',
      'Jane',
      'Jason',
      'Rahul',
      'Dune'
    ];

    const usersToInsert = names.map(name => ({
      name,
      totalPoints: Math.floor(Math.random() * 451) + 50 // Random points: 50–500
    }));

    try {
      await User.insertMany(usersToInsert);
      console.log('🔰 Seeded 11 users');
    } catch (seedError) {
      console.error('Error seeding users:', seedError);
    }
  }

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error(' MongoDB connection error:', err);
});
