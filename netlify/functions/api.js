const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const gamesRouter = require('../../server/routes/games');
const scoresRouter = require('../../server/routes/scores');
const usersRouter = require('../../server/routes/users');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/.netlify/functions/api/games', gamesRouter);
app.use('/.netlify/functions/api/scores', scoresRouter);
app.use('/.netlify/functions/api/users', usersRouter);

// Export handler for serverless
module.exports.handler = serverless(app);
