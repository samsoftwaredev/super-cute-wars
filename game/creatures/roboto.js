const Creature = require('../classes/CreatureClass');
const CompCreature = require('../classes/CompCreatureClass');
const CompAttackerCreatureClass = require('../classes/CompAttackerCreatureClass');
const CompDefenderCreatureClass = require('../classes/CompDefenderCreatureClass');
const { COMPUTER_DIFFICULTY } = require('../constants');

const roboto = () => new Creature('Roboto Mustachon', 2, 100, true);
const compRobotoAttacker = () =>
  new CompAttackerCreatureClass(
    'Roboto Mustachon',
    2,
    100,
    COMPUTER_DIFFICULTY.IMPOSSIBLE,
  );
const compRobotoDefender = () =>
  new CompDefenderCreatureClass(
    'Roboto Mustachon',
    2,
    100,
    COMPUTER_DIFFICULTY.IMPOSSIBLE,
  );
const compRoboto = () =>
  new CompCreature('Roboto Mustachon', 2, 100, COMPUTER_DIFFICULTY.IMPOSSIBLE);

module.exports = { compRoboto, roboto, compRobotoAttacker, compRobotoDefender };
