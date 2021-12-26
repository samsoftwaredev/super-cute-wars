const colosseum = require('./colosseum');
const swamp = require('./swamp');

const arenas = { colosseum, swamp };

const getRandomArena = () => {
  const list = Object.values(arenas);
  const randomIndex = Math.abs(Math.round(Math.random() * list.length - 1));
  console.log('Random: ', randomIndex, list);
  const randomArena = list[randomIndex];
  return randomArena;
};

module.exports = {
  ...arenas,
  getRandomArena,
};
