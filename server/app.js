const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ---- Global middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map(n => n.trim())
      : 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'UpBridge Rwanda API is running.' });
});

// ---- Routes ----
const mentorRoutes = require('./routes/mentorRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');

app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentorship-sessions', mentorshipRoutes);

// ---- Error handling ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
