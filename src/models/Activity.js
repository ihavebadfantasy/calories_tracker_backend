const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const ActivitiesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  caloriesPerMin: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

ActivitiesSchema.plugin(mongoose_delete, { overrideMethods: true });

const Activity = mongoose.model('activity', ActivitiesSchema);

module.exports = Activity;
