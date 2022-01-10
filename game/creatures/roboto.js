const Creature = require('../classes/CreatureClass');
const CompCreature = require('../classes/CompCreatureClass');
const { COMPUTER_DIFFICULTY } = require('../constants');

const roboto = () => new Creature('Roboto Mustachon', 2, 100, true);
const compRoboto = () =>
  new CompCreature('Roboto Mustachon', 2, 100, COMPUTER_DIFFICULTY.MEDIUM);

module.exports = { compRoboto, roboto };
