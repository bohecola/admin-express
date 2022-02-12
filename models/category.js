const { Schema } = require('mongoose');

const categorySchema = new Schema({
  // 分类名称
  name: {
    type: String,
    unique: true,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = categorySchema;