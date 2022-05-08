const { Article, Category, Tag } = require('../models');
const Common = require('./common');
const Constant = require('../constant');
const { forEach } = require('async');

exports.list = async (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    checkParams: cb => {
      Common.checkParams(req.query, ['page', 'limit'], cb);
    },
    query: ['checkParams', (result, cb) => {
      const { tags, category, page, limit } = req.query;

      const filter = {};
      if (tags) filter.tags = tags;
      if (category) filter.category = category;
      Article
        .paginate(filter, {
          sort: { createdAt: -1 },
          populate: [
            { path: 'category', select: 'name' },
            { path: 'tags', select: 'name color' },
            { path: 'author', select: 'username avatar' },
          ],
          lean: true,
          leanWithId: true,
          page: parseInt(page),
          limit: parseInt(limit)
        })
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }]
  };

  Common.autoFn(tasks, res, resObj);
}

exports.one = async (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Article
        .findById(req.params.id)
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR)
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.create = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    add: cb => {
      req.body.author = req.user._id;
      new Article(req.body)
        .save()
        .then(ret => {
          resObj.data = ret;
          cb(null, resObj.data);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    },
    updateRef: ['add', (results, cb) => {
      const { _id: articleId, category, tags } = results.add;
      if(category) {
        Category
          .findById(category)
          .then(ret => {
            ret.addArticleToCategory(articleId);
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      if(tags) {
        Tag
          .find({ _id: { $in: tags } })
          .then(ret => {
            ret.forEach(tag => tag.addArticleToTag(articleId));
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      cb(null);
    }]
  };

  Common.autoFn(tasks, res, resObj);
}

exports.update = async (req, res, next) => {
  // const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  // let tasks = {
  //   add: cb => {
      
  //   }
  // };

  // Common.autoFn(tasks, res, resObj);
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
  // const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  // let tasks = {
  //   add: cb => {
      
  //   }
  // };

  // Common.autoFn(tasks, res, resObj);
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
