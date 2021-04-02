require('dotenv').config();
const { Seeder } = require('mongo-seeding');
const path = require('path');

let database = 'mongodb://127.0.0.1:27017/';

switch (process.env.NODE_ENV) {
  case 'test':
    database += process.env.TEST_DB_NAME;
    break;
  case 'prod':
    database += process.env.PROD_DB_NAME;
    break;
  case 'dev':
    database += process.env.DEV_DB_NAME;
    break;
}

const config = {
  database,
  dropDatabase: true,
  export: 'objectOrArray',
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(path.resolve('./db/seeds'), {
  transformers: [
    Seeder.Transformers.setCreatedAtTimestamp,
    Seeder.Transformers.setUpdatedAtTimestamp
  ]
});

(async () => {
  try {
    await seeder.import(collections);
  } catch (err) {
    console.warn(err);
  }
})();
