const { Schema } = require('mongoose');

const articleSchema = new Schema({
  // 文章标题
  title: {
    type: String,
    unique: true,
    required: true
  },
  
  // 文章内容
  content: {
    type: String
  },

  // 文章标签
  tags: {
    type: [Schema.Types.ObjectId],
    ref: 'Tag'
  },

  // 文章分类
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },

  // 状态
  status: {
    type: Number,
    default: 0  // 草稿0 发布1
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = articleSchema;