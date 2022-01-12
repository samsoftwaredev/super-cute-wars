const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const BattleComp = require('./game/classes/BattleCompClass');
const { compRobotoAttacker, killerCroc } = require('./game/creatures');
const { getRandomArena } = require('./game/arenas');

const PORT = 3000;

const app = express();
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());

let games = {};
app.post('/battle/start', (req, res) => {
  const id = uuidv4();
  // TODO: pass in players creature selection
  const battle = new BattleComp(
    [compRobotoAttacker(), killerCroc()],
    getRandomArena(),
  );
  battle.startBattle();
  games[id] = { battle };

  const payload = {
    id,
    game: battle.getGameState(),
  };

  res.json(payload);
});

app.post('/battle/status/:id', (req, res) => {
  const { id } = req.params;
  const { battle } = games[id];

  const payload = {
    id,
    game: battle.getGameState(),
  };

  res.json(payload);
});

app.post('/battle/:id', async (req, res) => {
  // players input
  const { id } = req.params;
  const { playerInput } = req.body;
  const { battle } = games[id];

  battle.setPlayerInput(playerInput, () => {
    const payload = {
      id,
      game: battle.getGameState(),
    };

    res.json(payload);
  });
});

app.get('/battle', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/pages/battle/index.html'));
});

app.get('/waiting-room', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/pages/waitingRoom/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/pages/notFound/index.html'));
});

app.listen(PORT, () => {
  console.log('Listening on ' + PORT);
});
