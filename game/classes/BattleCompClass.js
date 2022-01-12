const { CREATURE_ACTION, GAME_STATE } = require('../constants');
const Battle = require('./BattleClass');
class BattleComp extends Battle {
  playerInput = null;
  timerToEnterInput = null;
  callback = null;
  timeToWaitForPlayerInput = 1000;

  constructor(creatures, arena) {
    super(creatures, arena);
  }

  setPlayerInput = (playerInput, callback) => {
    this.playerInput = playerInput;
    this.callback = callback;
  };

  getPlayerInput = async () => {
    let id = null;
    return new Promise((resolve, reject) => {
      id = setInterval(() => {
        const playerSelectedOption = this.playerInput !== null;

        if (playerSelectedOption) {
          resolve(this.playerInput);
          this.playerInput = null;
          clearInterval(id);
        }

        if (this.isGameOver) {
          clearInterval(id);
        }
      }, this.timeToWaitForPlayerInput);
    });
  };

  setPlayerActions = (humanAction) => {
    const { round } = this.getGameState();
    const notComp = (c) => !c.isComputerPlayer;
    const isHumanPlayer = this.listOfCreaturesInBattle.find(notComp);
    const isCompPlayer = this.getCreatureOpponent(isHumanPlayer);

    if (humanAction === CREATURE_ACTION.ATTACK) {
      isHumanPlayer.setAction(CREATURE_ACTION.ATTACK);
    } else if (humanAction === CREATURE_ACTION.DEFEND) {
      isHumanPlayer.setAction(CREATURE_ACTION.DEFEND);
    } else if (humanAction === CREATURE_ACTION.RECHARGE) {
      isHumanPlayer.setAction(CREATURE_ACTION.RECHARGE);
    } else {
      console.error(`Human player choose an invalid action "${humanAction}"`);
    }

    isCompPlayer.makeComputerDecision(
      isHumanPlayer,
      round.isMaxGameRoundReached,
    );

    console.log(`
      ++++++++++++++++++ ${isCompPlayer.name} ++++++++++++++++
      life: ${isCompPlayer.life} | ammo: ${isCompPlayer.ammunition}
      ++++++++++++++++++ ${isHumanPlayer.name} ++++++++++++++++
      life: ${isHumanPlayer.life} | ammo: ${isHumanPlayer.ammunition}
    `);
  };

  battling = async () => {
    const alreadyInBattle = this.currentGameState === GAME_STATE.BATTLING;
    if (alreadyInBattle) {
      this.currentGameState = GAME_STATE.BATTLING;
      this.addToGameHistory('Battling');
    }

    // wait for player's input, then continue the program
    const humanAction = await this.getPlayerInput();
    this.setPlayerActions(humanAction);
    this.executePlayersAction();
    const isDead = (creature) => creature.isDead();
    const isCreatureDead = this.listOfCreaturesInBattle.some(isDead);
    if (isCreatureDead || this.isMaxGameRoundReached()) {
      this.endBattle();
      this.callback();
      // exit
      return;
    } else {
      this.increaseGameRound();
      this.callback();
    }
    this.battling();
  };
}

module.exports = BattleComp;
