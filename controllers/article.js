const { Article, Category, Tag } = require('../models');

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
          item.category = item.category.name;
          item.tags = item.tags.map(tag => ({ name: tag.name, color: tag.color }));
          item.author = {
            username: item.author.username,
            avatar: item.author.avatar
          };
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
    await Category.updateOne(
      { _id: { $in: ret.category } },
      { $push: { 'articles': ret._id } }
    ).exec();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const ret = await Article.findById(req.params.id);
    Object.assign(ret, req.body);
    // await Category.updateOne(
    //   { _id: { $in: ret.category } },
    //   { $addToSet: { 'articles': ret._id } }
    // ).exec();
    await ret.save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const ret = await Article.findById(req.params.id);
    await Article.findByIdAndRemove(req.params.id);
    await Category.updateOne(
      { _id: { $in: ret.category } },
      { $pull: { 'articles': ret._id } }
      ).exec();
    res.status(204).end();
  } catch (err) {
    next(err)
  }
}
