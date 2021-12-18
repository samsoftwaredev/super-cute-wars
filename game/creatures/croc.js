const Creature = require('../classes/CreatureClass');
const CompCreature = require('../classes/CompCreatureClass');
const { COMPUTER_DIFFICULTY } = require('../constants');

const killerCroc = new Creature('Killer Croc', 2, 100);
const compKillerCroc = new CompCreature(
  'Killer Croc',
  2,
  100,
  COMPUTER_DIFFICULTY.NOVICE,
);

module.exports = { killerCroc, compKillerCroc };
