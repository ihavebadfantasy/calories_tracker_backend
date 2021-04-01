const { Seeder } = require('mongo-seeding');
const path = require('path');
// TODO: remove to test and initiate a new one for production
const config = {
  database: 'mongodb://127.0.0.1:27017/calories_tracker_test',
  dropDatabase: true,
  export: 'objectOrArray'
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(path.resolve('./db/seeds'));

(async () => {
  try {
    await seeder.import(collections);
  } catch (err) {
    console.warn(err);
  }
})();
