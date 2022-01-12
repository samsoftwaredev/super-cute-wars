const { CREATURE_ACTION } = require('../constants');
const CompCreature = require('./CompCreatureClass');

class CompAttackerCreature extends CompCreature {
  constructor(name, ammunition, accuracy, difficulty) {
    super(name, ammunition, accuracy, difficulty);
  }

  isLastRoundLastAction = () => CREATURE_ACTION.ATTACK;

  getSmartAction = (action) => {
    if (action === CREATURE_ACTION.ATTACK) {
      return this.makeRandomActionExcluding([CREATURE_ACTION.DEFEND]);
    } else if (
      action === CREATURE_ACTION.DEFEND ||
      action === CREATURE_ACTION.RECHARGE
    ) {
      return this.isAmmoAvailable()
        ? CREATURE_ACTION.ATTACK
        : CREATURE_ACTION.RECHARGE;
    } else {
      return this.makeRandomActionExcluding([CREATURE_ACTION.DEFEND]);
    }
  };
}

module.exports = CompAttackerCreature;
