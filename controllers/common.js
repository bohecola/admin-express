const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config');

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const ret = await User.findOne({ username: req.body.username });
    if (!ret) {
      return res.status(400).json({
        message: '用户不存在'
      });
    }

    if (req.body.password !== ret.password) {
      return res.status(400).json({
        message: '用户密码错误'
      })
    }

    // 生成 token
    const token = jwt.sign({
      userId: ret._id
    }, tokenSecret, {
      expiresIn: '7d'
    })

    const data = ret.toJSON();
    // delete data.password;

    res.status(200).json({
      token,
      ...data
    })
  } catch(err) {
    next(err);
  }
};

// 用户权限
exports.permissions = async (req, res, next) => {
  try {
    // 先拿到当前登录用户：req.user
    // 获取当前登录用户的角色
    // 获取所有角色的权限

    const user = await req.user.populate({
      path: 'roles',
      populate: {
        path: 'menus'
      }
    });
    
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// 用户信息
exports.person = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch(err) {
    next(err);
  }
}

// 更新用户信息
exports.personUpdate = async (req, res, next) => {
  try {
    Object.assign(req.user, req.body);
    req.user.save();
    res.status(200).json(req.user);
  } catch(err) {
    next(err);
  }
}