const { User, Article, Category, Tag } = require('../models');

exports.me = async function (req, res, next) {
  try {
    const ret = await User.findOne(
      { username: 'bohecola' },
      'name desc avatar -_id'
    );
    res.status(200).json({
      code: '200',
      message: 'success',
      data: ret
    });
  } catch (err) {
    next(err)
  }
}

exports.articleList = async function (req, res, next) {
  try {
    const {
      tag,
      category,
      page = 1,
      limit = 15,
    } = req.query;

    const query = {};

    if (tag) {
      query.tags = tag;
    }

    if (category) {
      query.category = category;
    }

    const options = {
      sort: { date: -1 },
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

    await Article.paginate(query, options)
      .then(function (ret) {
        ret.docs.map(item => {
          item.category = item.category.name;
          item.author = item.author.username;
        });

        res.status(200).json({
          code: '200',
          message: 'success',
          data: ret
        });
      })
  } catch (err) {
    next(err)
  }
}

exports.archiveList = async function (req, res, next) {
  try {
    await Article.aggregate([
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
        $sort: { _id: -1 }
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
      if (err) res.status(500).json({ message: err });
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
      res.status(200).json({
        code: '200',
        message: 'success',
        data: doc
      });
    });
  } catch (err) {
    next(err)
  }
}

exports.articleOne = async function (req, res, next) {
  try {
    await Article.findById(req.params.id, '-__v')
      .populate('category', 'name')
      .populate('tags', 'name color')
      .populate('author', 'username')
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });

        doc.author = doc.author.username;
        
        res.status(200).json({
          code: '200',
          message: 'success',
          data: doc
        });
      })
  } catch (err) {
    next(err);
  }
}

exports.tagList = async function (req, res, next) {
  try {
    const ret = await Tag.find({}, {_id: 1, name: 1, color: 1});
    res.status(200).json({
      code: '200',
      message: 'success',
      data: ret
    });
  } catch (err) {
    next(err)
  }
}

exports.categoryList = async function (req, res, next) {
  try {
    const ret = await Category.aggregate([
      { 
        $project: {
          _id: 1,
          name: 1,
          count: { $size: '$articles' } 
        }
      }
    ]);
    res.status(200).json({
      code: '200',
      message: 'success',
      data: ret
    });
  } catch (err) {
    next(err)
  }
}
