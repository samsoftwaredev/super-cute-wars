const { CREATURE_ACTION } = require('../constants');
const Creature = require('./CreatureClass');

class CompCreature extends Creature {
  difficulty = null;

  constructor(name, ammunition = 3, accuracy = 100, difficulty) {
    super(name, ammunition, accuracy, true);
    this.difficulty = difficulty;
  }

  isLastRoundLastAction = (opponentAmmunition) => {
    // In last round the computer should attack or defend, but not recharge
    if (
      !this.isAmmoAvailable() ||
      this.canSurviveAttack(this.life, this.powerShield, opponentAmmunition)
    ) {
      return CREATURE_ACTION.DEFEND;
    }
    return CREATURE_ACTION.ATTACK;
  };

  makeRandomActionExcluding = (excludedActions = []) => {
    const allActions = Object.values(CREATURE_ACTION);
    const invalidActions = [...excludedActions, CREATURE_ACTION.NONE];
    const validActions = allActions.filter((a) => {
      const isFound = invalidActions.indexOf(a);
      return isFound === -1;
    });

    const randomNum = Math.floor(Math.random() * validActions.length);
    const action = validActions[randomNum];

    if (action === CREATURE_ACTION.ATTACK && !this.isAmmoAvailable()) {
      return this.makeRandomActionExcluding([
        ...invalidActions,
        CREATURE_ACTION.ATTACK,
      ]);
    }

    return action;
  };

  getSmartAction = (action, opponentAmmo, opponentLife, opponentShield) => {
    const opponentHasAmmo = opponentAmmo > 0;
    if (action === CREATURE_ACTION.ATTACK) {
      if (opponentHasAmmo) return CREATURE_ACTION.DEFEND;
      return this.makeRandomActionExcluding([CREATURE_ACTION.DEFEND]);
    } else if (action === CREATURE_ACTION.DEFEND) {
      const willSurviveAttack = this.canSurviveAttack(
        opponentLife,
        opponentShield,
        this.ammunition,
      );
      if (!willSurviveAttack) return CREATURE_ACTION.ATTACK;
      return CREATURE_ACTION.RECHARGE;
    } else if (action === CREATURE_ACTION.RECHARGE) {
      return this.isAmmoAvailable()
        ? CREATURE_ACTION.ATTACK
        : CREATURE_ACTION.RECHARGE;
    } else {
      return CREATURE_ACTION.RECHARGE;
    }
  };

  makeComputerDecision = (isHumanPlayer, isLastRound) => {
    const {
      action: humanAction,
      ammunition: opponentAmmo,
      life: opponentLife,
      powerShield: opponentShield,
    } = isHumanPlayer.overview();
    const smartAction = this.getSmartAction(
      humanAction,
      opponentAmmo,
      opponentLife,
      opponentShield,
    );
    const isSmart = Math.random() < this.difficulty.smartness / 100;
    console.log(
      'Computer played smart:',
      isSmart,
      ' Difficulty: ',
      this.difficulty.smartness,
    );

    if (isLastRound) {
      this.setAction(this.isLastRoundLastAction(opponentAmmo));
    } else if (isSmart) {
      this.setAction(smartAction);
    } else {
      this.setAction(this.makeRandomActionExcluding([smartAction]));
    }
  };
}

module.exports = CompCreature;
