const { Article, Category, Tag } = require('../models');
const Common = require('./common');
const Constant = require('../constant');

exports.page = (req, res) => {
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
          leanWithId: false,
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

exports.one = (req, res) => {
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
    addRef: ['add', (results, cb) => {
      const { add } = results.add;
      if(add?.category) {
        Category
          .findById(add.category)
          .then(ret => {
            ret.addArticleToCategory(add._id);
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      if(add?.tags) {
        Tag
          .find({ _id: { $in: add.tags } })
          .then(ret => {
            ret.forEach(tag => tag.addArticleToTag(add._id));
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

exports.update = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Article
        .findById(req.params.id)
        .then(ret => {
          cb(null, ret);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        })
    },
    removeRef: ['query', (results, cb) => {
      const { query } = results;
      if(query?.category) {
        Category
          .findById(query.category)
          .then(ret => {
            ret.deleteArticleFromCategory(query._id);
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      if(query?.tags) {
        Tag
          .find({ _id: { $in: query.tags } })
          .then(ret => {
            ret.forEach(tag => tag.deleteArticleFromTag(query._id));
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      cb(null);
    }],
    update: ['removeRef', (results, cb) => {
      Article
        .findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        )
        .then(ret => {
          resObj.data = ret;
          cb(null, ret);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }],
    addRef: ['update', (results, cb) => {
      const { update } = results;
      if(update?.category) {
        Category
          .findById(update.category)
          .then(ret => {
            ret.addArticleToCategory(update._id);
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      if(update?.tags) {
        Tag
          .find({ _id: { $in: update.tags } })
          .then(ret => {
            ret.forEach(tag => tag.addArticleToTag(update._id));
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

exports.delete = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    remove: cb => {
      Article
        .findByIdAndRemove(req.params.id)
        .then(ret => {
          resObj.data = ret;
          cb(null, ret);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    },
    removeRef: ['remove', (results, cb) => {
      const { remove } = results;
    
      if(remove?.category) {
        Category
          .findById(remove.category)
          .then(ret => {
            ret.deleteArticleFromCategory(remove._id)
          })
          .catch(err => {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          });
      }
      if(remove?.tags) {
        Tag
          .find({ _id: { $in: remove.tags } })
          .then(ret => {
            ret.forEach(tag => tag.deleteArticleFromTag(remove._id))
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
