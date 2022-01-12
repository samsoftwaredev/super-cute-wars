const Creature = require('../classes/CreatureClass');
const CompCreature = require('../classes/CompCreatureClass');
const CompAttackerCreatureClass = require('../classes/CompAttackerCreatureClass');
const CompDefenderCreatureClass = require('../classes/CompDefenderCreatureClass');
const { COMPUTER_DIFFICULTY } = require('../constants');

const killerCroc = () => new Creature('Killer Croc', 2, 100);
const compKillerCrocAttacker = () =>
  new CompAttackerCreatureClass(
    'Killer Croc',
    2,
    100,
    COMPUTER_DIFFICULTY.LEGENDARY,
  );
const compKillerCrocDefender = () =>
  new CompDefenderCreatureClass(
    'Killer Croc',
    2,
    100,
    COMPUTER_DIFFICULTY.LEGENDARY,
  );
const compKillerCroc = () =>
  new CompCreature('Killer Croc', 2, 100, COMPUTER_DIFFICULTY.NOVICE);

module.exports = {
  killerCroc,
  compKillerCroc,
  compKillerCrocAttacker,
  compKillerCrocDefender,
};
