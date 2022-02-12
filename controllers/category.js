const { Category } = require('../models');

exports.list = async (req, res, next) => {
  try {
    await Category.find()
      .populate('creator', 'username avatar')
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });
        const ret = doc.map(item => {
          item.creator = {
            username: item.creator.username,
            avatar: item.creator.avatar
          };
          return item;
        });
        res.status(200).json(ret);
      });
  } catch (err) {
    next(err);
  }
}

exports.one = async (req, res, next) => {
  try {
    const ret = await Category.findById(req.params.id);
    res.status(200).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    req.body.creator = req.user._id;
    const ret = await new Category(req.body).save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const ret = await Category.findById(req.params.id);
    Object.assign(ret, req.body);
    await ret.save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err)
  }
}
