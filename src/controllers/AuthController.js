const User = require('../models/User');
const Encryptor = require('../helpers/Encryptor');
const generateAccessToken = require('../helpers/generateAccessToken');

const encryptor = new Encryptor();

module.exports = {
  async register(req, res, next) {
    try {
      const passwordHash = await encryptor.hash(req.body.password);
      const user = new User({
        email: req.body.email,
        password: passwordHash,
      });

      await user.save();

      const accessToken = generateAccessToken(user);

      res.send({ data: {
          accessToken,
        }
      });
    } catch (err) {
      next(new Error('Не удалось зарегестрировать. Обновите страницу и попробуйте еще раз'));
    }
  },

  async login(req, res, next) {
    const { password, email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        next(new Error('Пользователя с таким email не существует'));
      }

      const isRightPassword = encryptor.compare(password, user.password);

      if (!isRightPassword) {
        next(new Error('Неверный пароль'));
      }

      const accessToken = generateAccessToken(user);

      res.send({ data: {
          accessToken,
        }
      });
    } catch (err) {
      next(new Error('Не удалось авторизоваться. Обновите страницу и попробуйте снова'));
    }
  }
};
