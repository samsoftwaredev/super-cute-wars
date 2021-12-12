const { generateRandomId } = require('../tools');

class Arena {
  id = generateRandomId();
  name = '';

  constructor(name) {
    this.name = name;
  }
}

module.exports = Arena;
