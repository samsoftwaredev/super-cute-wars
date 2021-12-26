const express = require('express');
const path = require('path');
const app = express();

const BattleComp = require('./game/classes/BattleCompClass');
const { compRoboto, killerCroc } = require('./game/creatures');
const { getRandomArena } = require('./game/arenas');

const arena = getRandomArena();
const firstBattle = new BattleComp([compRoboto, killerCroc], arena);
firstBattle.startBattle();

const PORT = 3000;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/battle', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/battle/index.html'));
});

app.get('/waiting-room', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/waitingRoom/index.html'));
});

app.listen(PORT, () => {
  console.log('Listening on PORT: ' + PORT);
});
