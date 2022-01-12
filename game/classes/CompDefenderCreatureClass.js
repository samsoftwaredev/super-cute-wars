const { CREATURE_ACTION } = require('../constants');
const CompCreature = require('./CompCreatureClass');

class CompDefenderCreature extends CompCreature {
  constructor(name, ammunition, accuracy, difficulty) {
    super(name, ammunition, accuracy, difficulty);
  }

  isLastRoundLastAction = () => CREATURE_ACTION.DEFEND;

  getSmartAction = (action, opponentAmmo, opponentLife, opponentShield) => {
    const willSurviveAttack = this.canSurviveAttack(
      opponentLife,
      opponentShield,
      this.ammunition,
    );
    if (this.powerShield <= 0) {
      this.makeRandomActionExcluding([CREATURE_ACTION.DEFEND]);
    } else if (!willSurviveAttack && this.isAmmoAvailable()) {
      return CREATURE_ACTION.ATTACK;
    } else if (action === CREATURE_ACTION.ATTACK) {
      if (opponentAmmo > 0) return CREATURE_ACTION.DEFEND;
      return this.makeRandomActionExcluding();
    } else if (
      action === CREATURE_ACTION.DEFEND ||
      action === CREATURE_ACTION.RECHARGE
    ) {
      return this.makeRandomActionExcluding([CREATURE_ACTION.ATTACK]);
    } else {
      return CREATURE_ACTION.DEFEND;
    }
  };
}

module.exports = CompDefenderCreature;
