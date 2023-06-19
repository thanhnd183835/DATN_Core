require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 2500;
console.log('MONGO_URL', process.env.MONGO_URL);

const conectDB = require('./config/db');
conectDB();
//routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const notificationRoutes = require('./routes/notification');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const transactionRoutes = require('./routes/Transaction');
const cartRoutes = require('./routes/cart');
app.use(
  cors({
    exposedHeaders: '*',
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    limit: '500mb',
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'success oke',
  });
});
app.use((req, res) => {
  res.status(404).json({
    msg: 'Page not founded',
  });
});
const server = http.createServer(app);

// define socket
const io = new Server(server, {
  cors: {
    method: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log(`${socket.id} connecting`);
  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  });
  socket.on('like_post', (data) => {
    io.emit('getNoti', data);
  });
  socket.on('add_cart', (data) => {
    io.emit('getNoti', data);
  });
});
server.listen(PORT, () => {
  console.log('Server on running on PORT ' + PORT);
});
