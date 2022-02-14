const { Schema } = require('mongoose');

const categorySchema = new Schema({
  // 分类名称
  name: {
    type: String,
    unique: true,
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

module.exports = categorySchema;