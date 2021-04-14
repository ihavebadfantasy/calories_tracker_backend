const fs = require('fs');
const crypto = require("crypto");

(() => {
  const jwtSecret = crypto.randomBytes(20).toString('hex');

  let readableStream = fs.createReadStream(".env.example", "utf8");

  let writeableStream = fs.createWriteStream(".env");

  readableStream.pipe(writeableStream);

  writeableStream.write(`JWT_SECRET=${jwtSecret}\n`);
})()
