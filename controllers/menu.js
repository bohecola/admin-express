const { Menu } = require('../models');

exports.list = async (req, res, next) => {
  try {
    await Menu.find()
      .populate({ path: 'parentId' })
      .sort({ sort: 1 })
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });
        const ret = doc.map(item => {
          if (item.parentId !== null) {
            item.parentId = item.parentId._id;
            item.parentName = item.parentId.name;
          }
          return item;
        });
        res.status(200).json(ret);
      });
  } catch (err) {
    next(err)
  }
}

exports.one = async (req, res, next) => {
  try {
    let ret = await Menu.findById(req.params.id)
      .populate({ path: 'parentId' })
      .lean()
      .exec((err, doc) => {
        if (err) res.status(500).json({ message: err });
        if (doc.parentId !== null) {
          doc.parentId = doc.parentId._id;
          doc.parentName = doc.parentId.name;
        }
        res.status(200).json(doc);
      });
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const ret = await new Menu(req.body).save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const ret = await Menu.findById(req.params.id);
    Object.assign(ret, req.body);
    await ret.save();
    res.status(201).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    await Menu.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err)
  }
}
