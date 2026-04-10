const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Globals logic
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading local images
}));
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io for Real-time Communication
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import Routes
const routes = require('./routes');
app.use('/api', routes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safebond')
.then(() => console.log('MongoDB successfully connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
