const colosseum = require('./colosseum');
const swamp = require('./swamp');

const arenas = { colosseum, swamp };

const getRandomArena = () => {
  const list = Object.values(arenas);
  const randomIndex = Math.abs(Math.round(Math.random() * list.length - 1));
  return list[randomIndex];
};

module.exports = {
  ...arenas,
  getRandomArena,
};
