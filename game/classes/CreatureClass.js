const { log, generateRandomId } = require('../tools');
const { CREATURE_ACTION, CREATURE_MODE } = require('../constants');

class Creature {
  id = generateRandomId();
  creatureCurrentAction = CREATURE_ACTION.NONE;
  creatureCurrentMode = CREATURE_MODE.IS_ALIVE;
  life = 5;
  history = [];

  constructor(name, damageCapacity = 1, ammunition = 3, accuracy = 100) {
    this.name = name;
    this.damageCapacity = damageCapacity;
    this.ammunition = ammunition;
    this.accuracy = accuracy;
  }

  addToCreatureGameHistory = (action) => {
    log(`${this.name} - ${action}`);
    this.history.push(action);
  };

  isAttacking = () => this.creatureCurrentAction === CREATURE_ACTION.ATTACK;

  isDead = () => this.creatureCurrentMode === CREATURE_MODE.IS_DEAD;

  setAction = (action) => {
    if (action === CREATURE_ACTION.DEFEND)
      this.creatureCurrentAction = CREATURE_ACTION.DEFEND;
    else if (action === CREATURE_ACTION.ATTACK)
      this.creatureCurrentAction = CREATURE_ACTION.ATTACK;
    else if (action === CREATURE_ACTION.RECHARGE)
      this.creatureCurrentAction = CREATURE_ACTION.RECHARGE;
    else if (action === CREATURE_ACTION.NONE)
      this.creatureCurrentAction = CREATURE_ACTION.NONE;
    else console.error(`Setting an invalid action ${action}`);
  };

  setNoAction = () => {
    this.setAction(CREATURE_ACTION.NONE);
  };

  getState = () => ({
    action: this.creatureCurrentAction,
    mode: this.creatureCurrentMode,
    life: this.life,
  });

  wasAttacked = (numOfAttacks = 1, amountOfDamage = 0) => {
    // if creature was attack while in defence
    let damageDoneToCurrentCreature = amountOfDamage + numOfAttacks;

    if (this.creatureCurrentAction === CREATURE_ACTION.DEFEND) {
      this.addToCreatureGameHistory('Was in Defence when attacked');
      damageDoneToCurrentCreature = 0.5;
    } else {
      // if creature was attack while not in defence
      this.addToCreatureGameHistory('Was NOT in defence when attacked.');
    }

    this.life = this.life - damageDoneToCurrentCreature;

    if (this.life <= 0) {
      this.addToCreatureGameHistory(`Is dead. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_DEAD;
    } else if (this.life === 1) {
      this.addToCreatureGameHistory(`Is fearful. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_FEARFUL;
    } else {
      this.addToCreatureGameHistory(`Is still alive. HP ${this.life}`);
      this.creatureCurrentMode = CREATURE_MODE.IS_ALIVE;
    }
  };

  attack = (opponentCreature) => {
    this.setAction(CREATURE_ACTION.ATTACK);
    this.addToCreatureGameHistory('Is Attacking');
    if (this.ammunition <= 0) {
      this.addToCreatureGameHistory('but has no ammunition');
      return;
    }
    // attacks can miss if accuracy is low
    const attackedMissed = this.accuracy / 100;
    if (Math.random() < attackedMissed) {
      opponentCreature.wasAttacked(this.ammunition, this.damageCapacity);
    } else {
      this.addToCreatureGameHistory('Attacked missed');
    }
    // creature uses all ammo once an attack is done
    this.ammunition = 0;
  };

  defend = () => {
    this.setAction(CREATURE_ACTION.DEFEND);
    this.addToCreatureGameHistory('Is Defending');
  };

  recharge = () => {
    this.setAction(CREATURE_ACTION.RECHARGE);
    // creature gains ammo
    this.ammunition += 1;
    this.addToCreatureGameHistory('Is Recharging');
  };

  executeCreatureAction = (action, opponentCreature) => {
    if (action === CREATURE_ACTION.DEFEND) this.defend();
    else if (action === CREATURE_ACTION.ATTACK) this.attack(opponentCreature);
    else if (action === CREATURE_ACTION.RECHARGE) this.recharge();
    else console.error(`Executing an invalid action: ${action}`);
  };
}

module.exports = Creature;
