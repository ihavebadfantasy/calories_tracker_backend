const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_plugin = require('@abslibs/mongoose-plugin');

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
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  caloriesPerDay: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

UserSchema.plugin(mongoose_plugin, {
  paranoid: true
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
