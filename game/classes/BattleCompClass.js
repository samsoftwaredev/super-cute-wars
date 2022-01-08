const { CREATURE_ACTION, GAME_STATE } = require('../constants');
const Battle = require('./BattleClass');
class BattleComp extends Battle {
  playerInput = null;
  timerToEnterInput = null;
  timeToWaitForPlayerInput = 5000;

  constructor(creatures, arena) {
    super(creatures, arena);
  }

  setPlayerInput = (playerInput) => {
    this.playerInput = playerInput;
  };

  getPlayersInput = async () => {
    let id = null;
    let timeLeft = this.timeToWaitForPlayerInput;
    return new Promise((resolve, reject) => {
      id = setTimeout(() => {
        timeLeft -= 1;
        resolve(this.playerInput);
      }, this.timeToWaitForPlayerInput);
      if (timeLeft <= 0) clearTimeout(id);
    });
  };
  setPlayersActions = () => {
    const { round } = this.getGameState();
    const notComp = (c) => !c.isComputer;
    const isHumanPlayer = this.listOfCreaturesInBattle.find(notComp);
    const isCompPlayer = this.getCreatureOpponent(isHumanPlayer);

    if (this.playerInput === 'a') {
      isHumanPlayer.setAction(CREATURE_ACTION.ATTACK);
    } else if (this.playerInput === 'd') {
      isHumanPlayer.setAction(CREATURE_ACTION.DEFEND);
    } else if (this.playerInput === 'r') {
      isHumanPlayer.setAction(CREATURE_ACTION.RECHARGE);
    } else {
      console.error(
        `Human player choose an invalid action "${this.playerInput}"`,
      );
    }

    isCompPlayer.makeComputerDecision(
      isHumanPlayer,
      round.isMaxGameRoundReached,
    );

    console.log(`
      ++++++++++++++++++ ${isCompPlayer.name} ++++++++++++++++
      life: ${isCompPlayer.life} | ammo: ${isCompPlayer.ammunition} 
      Choose an action for ${isCompPlayer.name}:
      ++++++++++++++++++ ${isHumanPlayer.name} ++++++++++++++++
      life: ${isHumanPlayer.life} | ammo: ${isHumanPlayer.ammunition} 
      Choose an action for ${isHumanPlayer.name}:`);
  };

  battling = async () => {
    if (this.currentGameState === GAME_STATE.BATTLING) {
      this.currentGameState = GAME_STATE.BATTLING;
      this.addToGameHistory('Battling');
    }

    // wait for 10 second for player's input, then continue program
    await this.getPlayersInput();
    this.setPlayersActions();
    this.executePlayersAction();

    const isCreatureDead = this.listOfCreaturesInBattle.some((creature) =>
      creature.isDead(),
    );
    if (isCreatureDead || this.isMaxGameRoundReached()) {
      this.endBattle();
      // exit
      return;
    } else {
      this.increaseGameRound();
    }
    this.battling();
  };
}

module.exports = BattleComp;
