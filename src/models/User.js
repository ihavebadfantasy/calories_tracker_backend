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
}, { timestamps: true });

UserSchema.plugin(mongoose_delete, { overrideMethods: true });

UserSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
