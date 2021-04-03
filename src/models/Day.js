const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const DaySchema = new Schema({
  caloriesLeft: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  meals: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'meal'
    }],
    default: [],
  },
  dailyActivities: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'dailyActivity'
    }],
    default: [],
  },
  statisticsEnabled: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

DaySchema.plugin(mongoose_delete, { overrideMethods: true });

const Day = mongoose.model('day', DaySchema);

module.exports = Day;
