import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transcriptRoutes from './routes/transcriptRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Contextual Learning API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
