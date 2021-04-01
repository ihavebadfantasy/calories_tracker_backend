const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_plugin = require('@abslibs/mongoose-plugin');

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

ActivitiesSchema.plugin(mongoose_plugin, {
  paranoid: true,
});

const Activity = mongoose.model('activity', ActivitiesSchema);

module.exports = Activity;
