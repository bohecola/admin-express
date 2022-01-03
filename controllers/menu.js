const { Menu } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const ret = await Menu.find();
    res.status(200).json(ret);
  } catch (err) {
    next(err)
  }
}

exports.one = async (req, res, next) => {
  try {
    const ret = await Menu.findById(req.params.id);
    res.status(200).json(ret);
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

