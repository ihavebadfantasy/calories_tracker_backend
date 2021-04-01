const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_plugin = require('@abslibs/mongoose-plugin');

const MealSchema = new Schema({
  nutriment: String,
  calories: {
    type: Number,
    required: true,
  },
  weight: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
}, { timestamps: true });

MealSchema.plugin(mongoose_plugin, {
  paranoid: true
});

const Meal = mongoose.model('meal', MealSchema);

module.exports = Meal;
