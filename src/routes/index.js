const fs = require('fs');

module.exports = (app) => {
  const routesFiles = fs.readdirSync(__dirname, {
    withFileTypes: true,
  });

  routesFiles.forEach((file) => {
    if (file.name !== 'index.js') {
      const routes = require(`./${file.name}`);
      routes(app);
    }
  });
}
