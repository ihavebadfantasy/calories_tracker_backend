const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

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
    index: true,
  },
}, { timestamps: true });

MealSchema.plugin(mongoose_delete, { overrideMethods: true });

const Meal = mongoose.model('meal', MealSchema);

module.exports = Meal;
