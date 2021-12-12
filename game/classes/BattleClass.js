const prompt = require('prompt-sync')({ sigint: true });
const Arena = require('./ArenaClass');
const { log, generateRandomId } = require('../tools');
const { CREATURE_ACTION, GAME_STATE } = require('../constants');

class Battle {
  gameId = generateRandomId();
  gameHistory = [];
  listOfCreaturesInBattle = [];
  currentGameState = null;
  isGameOver = false;
  winner = null;
  arena = null;

  constructor(creatures, arena) {
    this.listOfCreaturesInBattle = creatures;
    this.arena = arena;
    this.isGameOver = false;
  }

  getGameState = () => ({
    isGameOver: this.isGameOver,
    winner: this.winner,
    creaturesBattling: this.listOfCreaturesInBattle.map((c) => c.overview()),
    gameState: this.currentGameState,
  });

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
    const listOfActionsOrganized = [];
    // organize actions
    this.listOfCreaturesInBattle.forEach((creature) => {
      const status = creature.getState();
      if (creature.isAttacking()) {
        // attacks should be executed last
        listOfActionsOrganized.push({ creature, status });
      } else {
        // if action is not an attack it should be executed first
        listOfActionsOrganized.unshift({ creature, status });
      }
    });
    // execute actions
    listOfActionsOrganized.forEach(({ creature, status }) => {
      const opponent = this.getCreatureOpponent(creature);
      creature.executeCreatureAction(status.action, opponent);
    });
  };

  startBattle = () => {
    this.currentGameState = GAME_STATE.STARTING;
    this.addToGameHistory('Game started');
    const creature = this.listOfCreaturesInBattle[0];
    const opponent = this.getCreatureOpponent(creature);
    this.addToGameHistory(`${creature.name} vs ${opponent.name}`);
    this.battling();
  };

  battling = () => {
    this.currentGameState = GAME_STATE.BATTLING;
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
    this.currentGameState = GAME_STATE.ENDING;
    this.addToGameHistory('Game ended');
    this.isGameOver = true;
    // if both creatures die
    const isEveryCreatureDead = this.listOfCreaturesInBattle.every((creature) =>
      creature.isDead(),
    );
    if (isEveryCreatureDead) {
      this.addToGameHistory(`There was a Draw!`);
      this.winner = null;
      return;
    }
    // if one creature dies
    const creatureWon = this.listOfCreaturesInBattle.find(
      (creature) => !creature.isDead(),
    );
    if (creatureWon) {
      this.addToGameHistory(`${creatureWon.name} Won the Game!`);
      this.winner = creatureWon;
      return;
    }
  };
}

module.exports = Battle;
