// 引入公共方法
const Common = require('./common');
// 引入相关表的model
const { User, Article, Category, Tag } = require('../models');
// 引入常量
const Constant = require('../constant');

exports.me = function (req, res) {
  // 定义一个返回对象
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
  // 定义一个async任务
  let tasks = {
    query: cb => {
      User
        .findOne(
          { username: 'bohecola' },
          'name desc avatar -_id'
        )
        .then(ret => {
          resObj.data = ret;
          // 继续后续操作
          cb(null);
        })
        .catch(err => {
          // 错误处理
          // 打印错误日志
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };
  // 执行公共方法中的autoFn方法，返回数据
  Common.autoFn(tasks, res, resObj);
}

exports.articleList = function (req, res) {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
  
  let tasks = {
    checkParams: cb => {
      Common.checkParams(req.query, ['page', 'limit'], cb);
    },
    query: ['checkParams', (result, cb) => {
      const {
        tagId,
        categoryId,
        page,
        limit,
      } = req.query;
  
      const query = {};
      if (tagId) query.tags = tagId;
      if (categoryId) query.category = categoryId;
  
      const options = {
        sort: { createdAt: -1 },
        select: '-__v -content',
        populate: [
          { path: 'author', select: 'username -_id' },
          { path: 'tags', select: 'name color -_id' },
          { path: 'category', select: 'name -_id' }
        ],
        leanWithId: false,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      Article
        .paginate(query, options)
        .then(ret => {
          ret.docs.map(item => {
            item.category = item.category.name;
            item.author = item.author.username;
          });

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

exports.archiveList = function (req, res) {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Article.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            pipeline: [
              {
                $project: { name: 1, _id: 0 }
              }
            ],
            as: 'author',
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            pipeline: [
              {
                $project: { name: 1, _id: 0 }
              }
            ],
            as: 'category',
          }
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            pipeline: [
              {
                $project: { name: 1, color: 1, _id: 0 }
              }
            ],
            as: 'tags',
          }
        },
        { $unwind: '$author' },
        { $unwind: '$category' },
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            tags: 1,
            author: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        {
          $group: {
            _id: { 
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              _id: '$_id',
              title: '$title',
              category: '$category',
              tags: '$tags',
              author: '$author',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt'
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              year: '$_id.year',
              month: '$_id.month',
            },
            daily: { 
              $push: { 
                _id: '$_id._id',
                title: '$_id.title',
                category: '$_id.category',
                tags: '$_id.tags',
                author: '$_id.author',
                createdAt: '$_id.createdAt',
                updatedAt: '$_id.updatedAt',
                day: '$_id.day' 
              }
            },
          },
        },
        {
          $group: {
            _id: '$_id.year',
            yearList: {
              $push: { month: '$_id.month', monthList: '$daily' }
            }
          }
        }
      ]).exec((err, doc) => {
        if (err) {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        } else {
          doc.map(item => {
            item.year = item._id;
            delete item._id;
            item.yearList.map(monthItem => {
              monthItem.monthList.map(article => {
                article.author = article.author.name;
                article.category = article.category.name;
              })
            })
            return item;
          });
          resObj.data = doc;
          cb(null);
        }
      });
    }
  }

  Common.autoFn(tasks, res, resObj);
}

exports.articleOne = function (req, res) {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Article
        .findById(req.params.id, '-__v')
        .populate('category', 'name')
        .populate('tags', 'name color')
        .populate('author', 'username')
        .lean()
        .exec((err, doc) => {
          if (err) {
            console.log(err);
            cb(Constant.DEFAULT_ERROR);
          } else {
            doc.author = doc.author.username;
            resObj.data = doc;
            cb(null);
          }
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.tagList = function (req, res) {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Tag
        .find({}, {_id: 1, name: 1, color: 1})
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.categoryList = function (req, res) {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      Category
        .aggregate([
          { 
            $project: {
              _id: 1,
              name: 1,
              count: { $size: '$articles' } 
            }
          }
        ])
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        })
    }
  };

  Common.autoFn(tasks, res, resObj);
}
