const prompt = require('prompt-sync')({ sigint: true });
const { CREATURE_ACTION } = require('../constants');
const Battle = require('./BattleClass');

class BattleComp extends Battle {
  constructor(creatures, arena) {
    super(creatures, arena);
  }

  getComputerInput = (isHumanPlayerCreature) => {
    const isComputerPlayerCreature = this.getCreatureOpponent(
      isHumanPlayerCreature,
    );
    const { ammunition: compAmmo } = isComputerPlayerCreature.overview();
    const { action: humanAction } = isHumanPlayerCreature.overview();

    const attackIfAmmoIsAvailable = () => {
      if (compAmmo > 0) {
        isComputerPlayerCreature.setAction(CREATURE_ACTION.ATTACK);
      } else {
        isComputerPlayerCreature.setAction(CREATURE_ACTION.RECHARGE);
      }
    };

    if (humanAction === CREATURE_ACTION.ATTACK) {
      isComputerPlayerCreature.setAction(CREATURE_ACTION.DEFEND);
    } else if (humanAction === CREATURE_ACTION.DEFEND) {
      isComputerPlayerCreature.setAction(CREATURE_ACTION.RECHARGE);
    } else if (humanAction === CREATURE_ACTION.RECHARGE) {
      attackIfAmmoIsAvailable();
    } else {
      attackIfAmmoIsAvailable();
    }
  };

  getPlayersInput = () => {
    const isHumanPlayerCreature = this.listOfCreaturesInBattle.find(
      (c) => !c.isComputer,
    );

    let playerInput = prompt(`
        ++++++++++++++++++ ${isHumanPlayerCreature.name} ++++++++++++++++
        life: ${isHumanPlayerCreature.life} | ammo: ${isHumanPlayerCreature.ammunition} 
        Choose an action for ${isHumanPlayerCreature.name}:
        \ta) Attack
        \td) Defend
        \tr) Recharge
        `);

    if (playerInput === 'a') {
      isHumanPlayerCreature.setAction(CREATURE_ACTION.ATTACK);
    } else if (playerInput === 'd') {
      isHumanPlayerCreature.setAction(CREATURE_ACTION.DEFEND);
    } else if (playerInput === 'r') {
      isHumanPlayerCreature.setAction(CREATURE_ACTION.RECHARGE);
    } else {
      console.error(
        `You choose a valid action for ${isHumanPlayerCreature.name}`,
      );
    }
    this.getComputerInput(isHumanPlayerCreature);
  };
}

module.exports = BattleComp;
