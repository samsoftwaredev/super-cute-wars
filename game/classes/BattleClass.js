const prompt = require('prompt-sync')({ sigint: true });
const Arena = require('./ArenaClass');
const { log, generateRandomId } = require('../tools');
const { CREATURE_ACTION } = require('../constants');

class Battle {
  gameId = generateRandomId();
  gameHistory = [];
  listOfCreaturesInBattle = [];
  isGameOver = false;
  arena = null;

  constructor(creatures, arenaName) {
    this.listOfCreaturesInBattle = creatures;
    this.arena = new Arena(arenaName);
    this.isGameOver = false;
  }

  addToGameHistory = (action) => {
    log(`Arena (${this.arena.name}) - ${action}`);
    this.gameHistory.push(action);
  };

  getCreatureOpponent = (currentCreature) =>
    this.listOfCreaturesInBattle.find((c) => currentCreature.id !== c.id);

  getPlayersInput = () => {
    this.listOfCreaturesInBattle.forEach((creature) => {
      let playerInput = prompt(`
      ++++++++++++++++++ ${creature.name} ++++++++++++++++
      life: ${creature.life} | ammo: ${creature.ammunition} 
      Choose an action for ${creature.name}:
      \ta) Attack
      \td) Defend
      \tr) Recharge
      `);
      if (playerInput === 'a') {
        creature.setAction(CREATURE_ACTION.ATTACK);
      } else if (playerInput === 'd') {
        creature.setAction(CREATURE_ACTION.DEFEND);
      } else if (playerInput === 'r') {
        creature.setAction(CREATURE_ACTION.RECHARGE);
      } else {
        console.error(`You choose a valid action for ${creature.name}`);
      }
    });
  };

  executePlayersAction = () => {
    const listOfActions = [];
    // organize actions
    this.listOfCreaturesInBattle.forEach((creature) => {
      const status = creature.getState();
      if (creature.isAttacking()) {
        // attacks should be executed last
        listOfActions.push({ creature, status });
      } else {
        // if action is not an attack it should be executed first
        listOfActions.unshift({ creature, status });
      }
    });
    // execute actions
    listOfActions.forEach(({ creature, status }) => {
      const opponent = this.getCreatureOpponent(creature);
      creature.executeCreatureAction(status.action, opponent);
    });
    // check modes
    return listOfActions;
  };

  startBattle = () => {
    this.addToGameHistory('Game started');
    const creature = this.listOfCreaturesInBattle[0];
    const opponent = this.getCreatureOpponent(creature);
    this.addToGameHistory(
      `Creatures ready to battle... 
      ${creature.id}:${creature.name} vs ${opponent.id}:${opponent.name}`,
    );

    this.battling();
  };

  battling = () => {
    this.addToGameHistory('Battling');
    while (this.isGameOver != true) {
      this.getPlayersInput();
      this.executePlayersAction();
      const creatureDied = this.listOfCreaturesInBattle.some((creature) =>
        creature.isDead(),
      );
      if (creatureDied) {
        this.endBattle();
      }
    }
  };

  endBattle = () => {
    this.addToGameHistory('Game ended');
    this.isGameOver = true;
    // if both creatures die
    const everyCreatureIsDead = this.listOfCreaturesInBattle.find((creature) =>
      creature.isDead(),
    );
    if (everyCreatureIsDead) {
      this.addToGameHistory(`There was a Draw!`);
      return;
    }
    // if one creature dies
    const creatureWon = this.listOfCreaturesInBattle.find(
      (creature) => !creature.isDead(),
    );
    if (creatureWon) {
      this.addToGameHistory(`${creatureWon.name} Won the Game!`);
      return;
    }
  };
}

module.exports = Battle;
