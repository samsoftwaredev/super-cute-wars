const { CREATURE_ACTION } = require('../constants');
const Creature = require('./CreatureClass');

class CompCreature extends Creature {
  isComputer = true;
  difficulty = null;
  constructor(
    name,
    damageCapacity = 1,
    ammunition = 3,
    accuracy = 100,
    difficulty,
  ) {
    super(name, damageCapacity, ammunition, accuracy);
    this.difficulty = difficulty;
  }

  makeComputerDecision = (humanAction) => {
    const isSmart = Math.random() < this.difficulty.smartness / 100;
    console.log(isSmart, this.difficulty.smartness);
    const attackIfAmmoIsAvailable = () => {
      if (this.ammunition > 0) {
        this.setAction(CREATURE_ACTION.ATTACK);
      } else {
        this.setAction(CREATURE_ACTION.RECHARGE);
      }
    };

    if (isSmart && humanAction === CREATURE_ACTION.ATTACK) {
      this.setAction(CREATURE_ACTION.DEFEND);
    } else if (isSmart && humanAction === CREATURE_ACTION.DEFEND) {
      this.setAction(CREATURE_ACTION.RECHARGE);
    } else if (isSmart && humanAction === CREATURE_ACTION.RECHARGE) {
      attackIfAmmoIsAvailable();
    } else {
      attackIfAmmoIsAvailable();
    }
  };
}

module.exports = CompCreature;
