const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const BattleComp = require('./game/classes/BattleCompClass');
const { compRoboto, killerCroc } = require('./game/creatures');
const { getRandomArena } = require('./game/arenas');

const PORT = 3000;
const WS_PORT = 8080;

const app = express();

app.use(express.static(path.join(__dirname + '/public')));

const server = new WebSocket.Server({ port: WS_PORT }, () =>
  console.log('Web socket listening on ' + WS_PORT),
);

let clients = {};
server.on('connection', (socket) => {
  const clientId = uuidv4();
  const battle = new BattleComp([compRoboto, killerCroc], getRandomArena());
  battle.startBattle();

  const payload = {
    clientId,
    game: battle.getGameState(),
  };

  clients[clientId] = {
    socket,
  };

  // When you receive a message, send that message to every socket.
  socket.on('message', function message(message) {
    const result = JSON.parse(message);
    console.log(result);
    battle.setPlayerInput(result.playerInput);
    socket.send(JSON.stringify(payload));
  });
  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', () => {
    // const clientsArr = Object.values(clientsArr)
    // sockets = clientsArr.filter((c) => c !== socket);
    // console.log('sockets:', clients.length);
  });
});

app.get('/battle', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/battle/index.html'));
});

app.get('/waiting-room', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/waitingRoom/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/notFound/index.html'));
});

app.listen(PORT, () => {
  console.log('Listening on ' + PORT);
});
