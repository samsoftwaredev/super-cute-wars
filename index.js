const express = require('express');
const app = express();

const BattleComp = require('./game/classes/BattleCompClass');
const { compRoboto, killerCroc } = require('./game/creatures');
const { swamp } = require('./game/arenas');

const PORT = 3000;

const firstBattle = new BattleComp([compRoboto, killerCroc], swamp);
firstBattle.startBattle();

app.listen(PORT, () => {
  console.log('Listening on PORT: ' + PORT);
});
