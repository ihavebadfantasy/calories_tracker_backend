const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_plugin = require('@abslibs/mongoose-plugin');

const StatsSchema = new Schema({
  averageWeight: {
    type: Number,
    required: true,
  },
  averageCaloriesPerDay: {
    type: Number,
    default: 0,
  },
  averageActivityPerDay: {
    type: Number,
    default: 0,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

StatsSchema.plugin(mongoose_plugin, {
  paranoid: true
});

const Stats = mongoose.model('stats', StatsSchema);

module.exports = Stats;
