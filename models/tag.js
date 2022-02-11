const { Schema } = require('mongoose');

const tagSchema = new Schema({
  // 标签名
  name: {
    type: String,
    unique: true,
    required: true
  },
  
  // 标签颜色
  color: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = tagSchema;