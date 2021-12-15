const prompt = require('prompt-sync')({ sigint: true });
const { CREATURE_ACTION } = require('../constants');
const Battle = require('./BattleClass');

class BattleComp extends Battle {
  constructor(creatures, arena) {
    super(creatures, arena);
  }

  getPlayersInput = () => {
    const isHumanPlayer = this.listOfCreaturesInBattle.find(
      (c) => !c.isComputer,
    );
    const isCompPlayer = this.getCreatureOpponent(isHumanPlayer);

    let playerInput = prompt(`
        ++++++++++++++++++ ${isCompPlayer.name} +++++++++++++++++
        life: ${isCompPlayer.life} | ammo: ${isCompPlayer.ammunition}
        
        ++++++++++++++++++ ${isHumanPlayer.name} ++++++++++++++++
        life: ${isHumanPlayer.life} | ammo: ${isHumanPlayer.ammunition} 
        Choose an action for ${isHumanPlayer.name}:
        \ta) Attack
        \td) Defend
        \tr) Recharge
        `);

    if (playerInput === 'a') {
      isHumanPlayer.setAction(CREATURE_ACTION.ATTACK);
    } else if (playerInput === 'd') {
      isHumanPlayer.setAction(CREATURE_ACTION.DEFEND);
    } else if (playerInput === 'r') {
      isHumanPlayer.setAction(CREATURE_ACTION.RECHARGE);
    } else {
      console.error(`You choose a valid action for ${isHumanPlayer.name}`);
    }

    const { round } = this.getGameState();
    isCompPlayer.makeComputerDecision(
      isHumanPlayer,
      round.isMaxGameRoundReached,
    );
  };
}

module.exports = BattleComp;
