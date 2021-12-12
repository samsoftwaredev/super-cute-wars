const { v4: uuidv4 } = require('uuid');

const generateRandomId = () => uuidv4();

module.exports = generateRandomId;
