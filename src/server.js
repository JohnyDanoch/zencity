const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');

const botsDb = require('./services/botsDb');
const { telegramBotInitialization } = require('./services/botgram.service');
const { getAll } = require('./services/bots.service');

const app = express();
app.use(cors({
  origin: '*',
}));
const port = process.env.PORT || 4000;

const pickBot = ({ _id, name, status }) => ({ _id, name, status });
app.get('/api/bots', async (req, res) => {
  const bots = await getAll();
  res.send(bots.map(pickBot));
});

let id = 0;

const sockets = [];
const addIoConnection = (socket) => {
  const localId = id;
  id += 1;
  sockets.push({ socket, id: localId });
  socket.on('disconnect', () => {
    sockets.splice(sockets.findIndex((el) => el.id === localId), 1);
  });
};

app.use(express.static(path.join(__dirname, '../client', 'build')));
app.use(express.static('public'));

botsDb().then(async () => {
  const bots = await getAll();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });
  bots.map((bot) => telegramBotInitialization(bot, io));
  io.on('connection', addIoConnection);
  server.listen(port, () => console.log(`Listening on port ${port}`));
});
