module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, {$set: {migrationTest: 'passed'}});
  },

  async down(db, client) {
    await db.collection('users').updateMany({}, {$unset: {migrationTest: 'passed'}});
  }
};
