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

tagSchema.methods.addArticleToTag = function (articleId) {
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

tagSchema.methods.deleteArticleFromTag = function (articleId) {
  this.articles = this.articles.filter(id => {
    return id.toString() !== articleId.toString();
  });

  return this.save();
}

module.exports = tagSchema;