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

  attackIfAmmoIsAvailable = () => this.ammunition > 0;

  makeRandomDecision = () => {
    const validActions = Object.values(CREATURE_ACTION).filter(
      (a) => a != CREATURE_ACTION.NONE,
    );
    const randomNum = Math.floor(Math.random() * validActions.length);
    const action = validActions[randomNum];
    if (action === CREATURE_ACTION.ATTACK) {
      // if creature doesn't have ammo, make another randomDecision
      if (!this.attackIfAmmoIsAvailable()) return this.makeRandomDecision();
    }
    return action;
  };

  makeComputerDecision = (humanAction) => {
    const isSmart = Math.random() < this.difficulty.smartness / 100;
    console.log(isSmart, this.difficulty.smartness);

    if (isSmart && humanAction === CREATURE_ACTION.ATTACK) {
      this.setAction(CREATURE_ACTION.DEFEND);
    } else if (isSmart && humanAction === CREATURE_ACTION.DEFEND) {
      this.setAction(CREATURE_ACTION.RECHARGE);
    } else if (isSmart && humanAction === CREATURE_ACTION.RECHARGE) {
      const act = this.attackIfAmmoIsAvailable()
        ? CREATURE_ACTION.ATTACK
        : CREATURE_ACTION.RECHARGE;
      this.setAction(act);
    } else {
      this.setAction(this.makeRandomDecision());
    }
  };
}

module.exports = CompCreature;
