const BruteForceSchema = require("express-brute-mongoose/dist/schema");
const mongoose = require("mongoose");

const Bruteforce = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));

module.exports = Bruteforce;
