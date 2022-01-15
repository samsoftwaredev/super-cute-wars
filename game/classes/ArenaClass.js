const { generateRandomId } = require('../tools');

class Arena {
  id = generateRandomId();
  name = '';
  name = null;

  constructor(name, image) {
    this.name = name;
    this.image = image;
  }
}

module.exports = Arena;
