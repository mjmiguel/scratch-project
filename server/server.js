const express = require('express');
const path = require('path');
const itemRouter = require('./routes/itemsRouter.js');
const userRouter = require('./routes/userRouter.js');
const filterRouter = require('./routes/filterRouter.js');
const http = require('http');
const socket = require('socket.io');

// require dotenv to hide server uri
require('dotenv').config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socket(server);

// Handle Parsing of Request Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  socket.emit('your id', socket.id); // emits the 'your id' event to client, along with user's socket ID
  //socket.client
  // socket.join('some room');
  // socket.on('room', (room) => {
  //   socket.join(room)
  // })
  socket.on('send message', (body) => {
    // when the client emits the 'send message' event, (i.e. when user sends msg), server emits the 'message' event
    io.emit('message', body); // the client listens for the 'message' event, and appends the 'body' (sent from server) to the DOM
  });
});
// from client, send message to scoket when room is created

// Handle Requests for Static Files
app.use('/', express.static(path.resolve(__dirname, '../')));

// Define Route Handlers
app.use('/item', itemRouter);
app.use('/user', userRouter);
app.use('/filter', filterRouter);

// Get Home Route
app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../index.html')));

app.get('/profile', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/login', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/signup', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/chat', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/messages', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/item/category/Appliances', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../index.html'))
);
app.get('/item/category/Kitchen', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../index.html'))
);
app.get('/item/category/Sports', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../index.html'))
);
app.get('/item/category/Clothing', (req, res) =>
  res.sendFile(path.resolve(__dirname, '../index.html'))
);
app.get('/logIn', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));

// Catch-All to handle unknown routes
app.use('*', (req, res) => {
  res.status(404).send('Bad Request');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log('Global error handler: ', err);
  res.status(500).send(err);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
// Start Server
// app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
