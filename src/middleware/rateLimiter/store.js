const Bruteforce = require('../../models/Bruteforce');
const MongooseStore = require("express-brute-mongoose");

module.exports = new MongooseStore(Bruteforce);
