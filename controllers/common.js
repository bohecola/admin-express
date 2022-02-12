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

// 用户权限菜单
exports.permmenu = async (req, res, next) => {
  try {
    // 当前登录用户 -> 角色 -> 权限
    const user = await req.user
      .populate({
        path: 'roles',
        populate: {
          path: 'menus'
        }
      });
    // 用户的所有角色
    const { roles } = user;
    // 所有角色拥有的菜单集合
    const menus = roles.reduce((menus, role) => {
      menus.push(...role.menus);
      return menus;
    }, []);

    // 去掉重复的菜单
    for (let i=0; i<menus.length; i++) {
      for (let j=i+1; j<menus.length; j++) {
        if (menus[i]._id === menus[j]._id) {
          menus.splice(j, 1);
          // 删除重复元素后，后面元素会向前进一位，所以需要 j-- 一次
          // 以确保下一次比较的是[被删除元素]后一位的元素
          j--; 
        }
      }
    }
    // 最终的权限菜单
    const permMenu = menus.sort((a, b) => a.sort - b.sort);
    res.status(200).json(permMenu);
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