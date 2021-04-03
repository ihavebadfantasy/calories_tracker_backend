const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
// TODO: fix defaults, check if not available in seeds only or in general
// TODO: replace age with date of birth

const UserSchema = new Schema({
  username: {
    type: String,
    default: 'Маленький пирожочек',
  },
  email: {
    type: String,
    required: true,
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
  isRegistrationComplete: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

UserSchema.plugin(mongoose_delete, { overrideMethods: true });

UserSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
