const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_plugin = require('@abslibs/mongoose-plugin');

const DailyActivitySchema = new Schema({
  name: String,
  calories: {
    type: Number,
    required: true,
  },
  duration: Number,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
}, { timestamps: true });

DailyActivitySchema.plugin(mongoose_plugin, {
  paranoid: true
});

const DailyActivity = mongoose.model('dailyActivity', DailyActivitySchema);

module.exports = DailyActivity;
