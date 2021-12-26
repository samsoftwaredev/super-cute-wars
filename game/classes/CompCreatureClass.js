const { CREATURE_ACTION, GAME_RULES } = require('../constants');
const Creature = require('./CreatureClass');

class CompCreature extends Creature {
  isComputer = true;
  difficulty = null;

  constructor(name, ammunition = 3, accuracy = 100, difficulty) {
    super(name, ammunition, accuracy);
    this.difficulty = difficulty;
  }

  isAmmoAvailable = () => this.ammunition > 0;

  hasEnoughAmmoToKill = (opponentLife) => this.ammunition >= opponentLife;

  isLastRoundLastAction = (opponentAmmunition) => {
    // In last round the computer should attack or defend, but not recharge
    const opponentHasAmmoToKill = opponentAmmunition > this.life;
    const canSurviveInDefence = this.life > GAME_RULES.DAMAGE_WHILE_IN_DEFENCE;
    if (
      !this.isAmmoAvailable() ||
      (opponentHasAmmoToKill && canSurviveInDefence)
    ) {
      return CREATURE_ACTION.DEFEND;
    }
    return CREATURE_ACTION.ATTACK;
  };

  makeRandomDecision = () => {
    const validActions = Object.values(CREATURE_ACTION).filter(
      (a) => a != CREATURE_ACTION.NONE,
    );
    const randomNum = Math.floor(Math.random() * validActions.length);
    const action = validActions[randomNum];

    if (action === CREATURE_ACTION.ATTACK) {
      // if creature doesn't have ammo, make another randomDecision
      if (!this.isAmmoAvailable()) return this.makeRandomDecision();
    }

    return action;
  };

  shouldAttackOrDefend = (isSmart, humanAction) => {
    return isSmart && humanAction === CREATURE_ACTION.ATTACK
      ? CREATURE_ACTION.DEFEND
      : CREATURE_ACTION.ATTACK;
  };

  makeComputerDecision = (isHumanPlayer, isLastRound) => {
    const {
      action: humanAction,
      ammunition: opponentAmmo,
      life: opponentLife,
    } = isHumanPlayer.overview();
    const isSmart = Math.random() < this.difficulty.smartness / 100;
    console.log(
      'Computer played smart:',
      isSmart,
      ' Difficulty: ',
      this.difficulty.smartness,
    );

    if (isLastRound) {
      this.setAction(this.isLastRoundLastAction(opponentAmmo));
    } else if (hasEnoughAmmoToKill(opponentLife)) {
      this.setAction(this.shouldAttackOrDefend(isSmart, humanAction));
    } else if (isSmart && humanAction === CREATURE_ACTION.ATTACK) {
      this.setAction(CREATURE_ACTION.DEFEND);
    } else if (isSmart && humanAction === CREATURE_ACTION.DEFEND) {
      this.setAction(CREATURE_ACTION.RECHARGE);
    } else if (isSmart && humanAction === CREATURE_ACTION.RECHARGE) {
      const act = this.isAmmoAvailable()
        ? CREATURE_ACTION.ATTACK
        : CREATURE_ACTION.RECHARGE;
      this.setAction(act);
    } else {
      this.setAction(this.makeRandomDecision());
    }
  };
}

module.exports = CompCreature;
