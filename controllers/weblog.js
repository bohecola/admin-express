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
      category
    } = req.query

    const filter = {};

    if (tag) {
      filter.tags = [tag];
    }

    if (category) {
      filter.category = category;
    }

    await Article.find(filter)
      .populate('category', 'name')
      .populate('tags', 'name color')
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });
        const ret = doc.map(item => {
          item.category = item.category.name;
          item.tags = item.tags.map(tag => ({ name: tag.name, color: tag.color }));
          item.author = item.author.username;
          return item;
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

exports.articleOne = async function (req, res, next) {
  try {
    await Article.findById(req.params.id)
      .populate('category', 'name')
      .populate('tags', 'name color')
      .populate('author', 'username')
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });

        doc.category = doc.category.name;
        doc.tags = doc.tags.map(tag => ({ name: tag.name, color: tag.color }));
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
    const ret = await Tag.find();
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
    const ret = await Category.find();
    res.status(200).json({
      code: '200',
      message: 'success',
      data: ret
    });
  } catch (err) {
    next(err)
  }
}
