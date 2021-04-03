const User = require('../models/User');

module.exports = {
  async getAll(req, res) {
    try {
      const users = await User.find({});
      return res.send({
        data: users,
      })
    } catch(err) {
      console.warn(err);
    }
  },

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
      res.send({
        data: updatedUser,
      });
    } catch (e) {
      console.warn(err);
    }
  },

  deleteOne(req, res) {
    const id = req.params.id;

    User.delete({ _id: id }, (err) => {
      if (err) {
        return res.status(400).send();
      }

      return res.status(202).send();
    });
  }
}
