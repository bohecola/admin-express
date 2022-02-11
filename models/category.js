const { Schema } = require('mongoose');

const categorySchema = new Schema({
  // 分类名称
  name: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

module.exports = categorySchema;