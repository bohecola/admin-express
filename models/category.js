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

categorySchema.methods.addArticleToCategory = function (articleId) {
  const articleIndex = this.articles.findIndex(id => {
    return id.toString() === articleId.toString();
  });

  // 插入文章id相同时
  if (articleIndex >= 0) {
    return false;
  }

  this.articles.push(articleId);

  return this.save();
}

categorySchema.methods.deleteArticleFromCategory = function (articleId) {
  this.articles = this.articles.filter(id => {
    return id.toString() !== articleId.toString();
  });

  return this.save();
}

module.exports = categorySchema;