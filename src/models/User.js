const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
// TODO: replace age with date of birth

const StatsSchema = {
  averageWeight: {
    type: Number,
    default: null,
  },
  averageCaloriesPerDay: {
    type: Number,
    default: 0,
  },
  averageActivityPerDay: {
    type: Number,
    default: 0,
  },
}

const TokenSchema = {
  token: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  }
}

const UserSchema = new Schema({
  username: {
    type: String,
    default: 'Маленький пирожочек',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  caloriesPerDay: {
    type: Number,
    default: null,
  },
  stats: StatsSchema,
  isRegistrationComplete: {
    type: Boolean,
    default: false,
  },
  tokens: [TokenSchema],
}, { timestamps: true });

UserSchema.plugin(mongoose_delete, { overrideMethods: true });

UserSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

UserSchema.toJSON = function () {
  let user = this;
  user.toObject();

  delete user.password;
  delete user.tokens;

  return user;
}

const User = mongoose.model('user', UserSchema);

module.exports = User;
