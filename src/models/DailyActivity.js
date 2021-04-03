const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

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

DailyActivitySchema.plugin(mongoose_delete, { overrideMethods: true });

const DailyActivity = mongoose.model('dailyActivity', DailyActivitySchema);

module.exports = DailyActivity;
