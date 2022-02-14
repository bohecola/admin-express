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
  },

  // 创建人
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // 文章集合
  articles: {
    type: [Schema.Types.ObjectId],
    ref: 'Article'
  }
}, { timestamps: true });

module.exports = tagSchema;