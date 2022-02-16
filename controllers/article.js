const { Article, Category, Tag } = require('../models');
const { post } = require('../models/user');

exports.list = async (req, res, next) => {
  try {
    await Article.find()
      .populate('category', 'name')
      .populate('tags', 'name color')
      .populate('author', 'username avatar')
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });
        const ret = doc.map(item => {
          if (item.category) {
            item.category = item.category.name;
          }
          if (item.tags) {
            item.tags = item.tags.map(tag => ({ name: tag.name, color: tag.color }));
          }
          if (item.author) {
            item.author = {
              username: item.author.username,
              avatar: item.author.avatar
            };
          }
          return item;
        })
        res.status(200).json(ret);
      });
  } catch (err) {
    next(err);
  }
}

exports.one = async (req, res, next) => {
  try {
    const ret = await Article.findById(req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    const ret = await new Article(req.body).save();

    if (ret.category) {
      // 向目录中添加对应的文章
      const category = await Category.findById(ret.category);
      category.addArticleToCategory(ret._id);
    }

    if (ret.tags) {
      // 向标签中添加对应的文章
      const tags = await Tag.find({ _id: { $in: ret.tags } });
      tags.forEach(async (tag) => {
        await tag.addArticleToTag(ret._id);
      })
    }

    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const ret = await Article.findById(req.params.id);
    const postCategoryId = req.body.category;
    const oldCategoryId = ret.category ? ret.category.toString() : null;

    const postTags = req.body.tags;
    const oldTags = ret.tags ? ret.tags.map(tag => tag.toString()) : [];

    if (postCategoryId && postCategoryId !== oldCategoryId) {
      if (oldCategoryId) {
        // 旧目录中移除对应的文章
        const oldCategory = await Category.findById(oldCategoryId);
        await oldCategory.deleteArticleFromCategory(ret._id);
      }
      // 新目录中添加对应的文章
      const newCategory = await Category.findById(postCategoryId);
      await newCategory.addArticleToCategory(ret._id);
    }

    if (postTags) {
      const postTagsSet = new Set(postTags);
      const oldTagsSet = new Set(oldTags);
      const deletedTagsSet = new Set([...oldTagsSet].filter(x => !postTagsSet.has(x)));
      const addedTagsSet = new Set([...postTagsSet].filter(x => !oldTagsSet.has(x)));

      const deletedTags = Array.from(deletedTagsSet);
      const addedTags = Array.from(addedTagsSet);

      // 新标签中添加对应的文章
      const added = await Tag.find({ _id: { $in: addedTags } });
      added.forEach(async (tag) => {
        await tag.addArticleToTag(ret._id);
      });
      // 旧标签中移除对应的文章
      const deleted = await Tag.find({ _id: { $in: deletedTags } });
      deleted.forEach(async (tag) => {
        await tag.deleteArticleFromTag(ret._id);
      });
    }
    
    Object.assign(ret, req.body);
    await ret.save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const ret = await Article.findById(req.params.id);

    if (ret.category) {
      // 目录中移除对应的文章
      const category = await Category.findById(ret.category);
      category.deleteArticleFromCategory(ret._id);
    }

    if (ret.tags) {
      // 标签中移除对应的文章
      const tags = await Tag.find({ _id: { $in: ret.tags } });
      tags.forEach(async (tag) => {
        await tag.deleteArticleFromTag(ret._id);
      });
    }

    await Article.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err)
  }
}
