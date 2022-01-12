const { log, generateRandomId } = require('../tools');
const {
  CREATURE_ACTION,
  CREATURE_MODE,
  CREATURE_STATUS,
} = require('../constants');

class Creature {
  id = generateRandomId();
  creatureCurrentAction = CREATURE_ACTION.NONE;
  creatureCurrentMode = CREATURE_MODE.IS_ALIVE;
  life = CREATURE_STATUS.STANDARD_LIFE_NUMBER;
  powerShield = CREATURE_STATUS.MAX_POWER_SHIELD;
  isComputerPlayer = null;
  history = [];

  constructor(name, ammunition, accuracy, isComputerPlayer = false) {
    this.name = name;
    this.ammunition = ammunition;
    this.accuracy = accuracy;
    this.isComputerPlayer = isComputerPlayer;
  }

  logCreatureHistory = (message) => {
    log(`${this.name} - ${message}`);
  };

  isAttacking = () => this.creatureCurrentAction === CREATURE_ACTION.ATTACK;

  isAmmoAvailable = () => this.ammunition > 0;

  isDead = () => this.creatureCurrentMode === CREATURE_MODE.IS_DEAD;

  hasEnoughAmmoToKill = (opponentsLife, ammo) => ammo >= opponentsLife;

  calcAttackDamage = (powerShield, ammo) => {
    const damageAllowed = 1 - powerShield / 100;
    return damageAllowed * ammo;
  };

  canSurviveAttack = (creatureLife, powerShield, ammo) => {
    const attackDamage = this.calcAttackDamage(powerShield, ammo);
    const life = creatureLife - attackDamage;
    return life > 0;
  };

  setAction = (action) => {
    this.history.push(action);
    if (action === CREATURE_ACTION.DEFEND) {
      this.logCreatureHistory('Is defending');
      this.creatureCurrentAction = CREATURE_ACTION.DEFEND;
    } else if (action === CREATURE_ACTION.ATTACK) {
      this.logCreatureHistory('Is attacking');
      this.creatureCurrentAction = CREATURE_ACTION.ATTACK;
    } else if (action === CREATURE_ACTION.RECHARGE) {
      this.logCreatureHistory('Is recharging');
      this.creatureCurrentAction = CREATURE_ACTION.RECHARGE;
    } else if (action === CREATURE_ACTION.NONE) {
      this.logCreatureHistory('Is doing no action');
      this.creatureCurrentAction = CREATURE_ACTION.NONE;
    } else console.error(`Setting an invalid action ${action}`);
  };

  getState = () => ({
    action: this.creatureCurrentAction,
    mode: this.creatureCurrentMode,
  });

  getStats = () => ({
    id: this.id,
    life: this.life,
    name: this.name,
    ammunition: this.ammunition,
    accuracy: this.accuracy,
    powerShield: this.powerShield,
    isComputerPlayer: this.isComputerPlayer,
  });

  overview = () => ({ ...this.getState(), ...this.getStats() });

  regeneratePowerShield = () => {
    // increase the power shield
    if (this.powerShield < CREATURE_STATUS.MAX_POWER_SHIELD)
      this.powerShield += CREATURE_STATUS.POWER_SHIELD_USAGE;
  };

  wasAttacked = (numOfAttacks = 1) => {
    // if creature was attack while in defence
    let damageToCurrentCreature = numOfAttacks;

    if (this.creatureCurrentAction === CREATURE_ACTION.DEFEND) {
      this.logCreatureHistory('Was in defence when attacked');
      damageToCurrentCreature = this.calcAttackDamage(
        this.powerShield,
        numOfAttacks,
      );
    } else {
      // if creature was attack while not in defence
      this.logCreatureHistory('Was NOT in defence when attacked.');
    }

    this.life = this.life - damageToCurrentCreature;

    if (this.life <= 0) {
      this.logCreatureHistory(`Is dead. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_DEAD;
    } else if (this.life > 0 && this.life <= 1) {
      this.logCreatureHistory(`Is fearful. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_FEARFUL;
    } else {
      this.logCreatureHistory(`Is still alive. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_ALIVE;
    }
  };

  attack = (opponentCreature) => {
    if (this.isAmmoAvailable) {
      this.regeneratePowerShield();
      // attacks can miss if accuracy is low
      const attackedMissed = this.accuracy / 100;
      if (Math.random() < attackedMissed) {
        opponentCreature.wasAttacked(this.ammunition);
      } else {
        this.logCreatureHistory('Attacked missed');
      }
      // creature uses all ammo once an attack is done
      this.ammunition = 0;
    } else {
      this.logCreatureHistory('but has no ammunition');
    }
  };

  defend = () => {
    const hasPowerShield = this.powerShield > 0;
    if (hasPowerShield) this.powerShield -= CREATURE_STATUS.POWER_SHIELD_USAGE;
    this.logCreatureHistory(`Power shield level: ${this.powerShield}`);
  };

  recharge = () => {
    this.regeneratePowerShield();
    // creature gains ammo
    this.ammunition += 1;
  };

  executeCreatureAction = (action, opponentCreature) => {
    if (action === CREATURE_ACTION.DEFEND) this.defend();
    else if (action === CREATURE_ACTION.ATTACK) this.attack(opponentCreature);
    else if (action === CREATURE_ACTION.RECHARGE) this.recharge();
    else console.error(`${this.name} executing an invalid action: ${action}`);
  };
}

module.exports = Creature;
