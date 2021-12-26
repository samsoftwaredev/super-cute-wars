const colosseum = require('./colosseum');
const swamp = require('./swamp');

const arenas = { colosseum, swamp };

const getRandom = () => {
  const list = Object.values(arenas);
  const randomIndex = Math.round(Math.random() * list.length);
  const randomArena = list[randomIndex];
  return randomArena;
};

module.exports = {
  ...arenas,
  getRandom,
};
