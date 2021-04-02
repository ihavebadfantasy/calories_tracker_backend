const User = require('../models/User');

module.exports = {
  async getOne(req, res) {
    const id = req.params.id;

    try {
      let user = await User.findOne({ _id: id });
      user = user.toObject();
      delete user.password;
      res.send({
        data: {
          user
        }
      });
    } catch (err) {
      console.warn(err);
    }
  },

  async updateOne(req, res) {
    const id = req.params.id;
    const userProps = {};
    // TODO: add validation
    for (let key in req.body) {
      if (key === 'username' || key === 'email' || key === 'weight' || key === 'age') {
        userProps[key] = req.body[key];
      }
    }

    try {
      await User.updateOne({ _id: id }, userProps);
      let updatedUser = await User.findOne({ _id: id });
      updatedUser = updatedUser.toObject();
      delete updatedUser.password;
      console.log(updatedUser);
      res.send({
        data: updatedUser,
      });
    } catch (e) {
      console.warn(err);
    }
  }
}
