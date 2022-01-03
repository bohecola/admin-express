const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config');
const { User } = require('../models');

module.exports = function checkLogin () {
  return async (req, res, next) => {
    try {
      // 拿到 token
      const token = req.get('Authorization');
      // 验证 token 的有效性（解token）
      const ret = jwt.verify(token, tokenSecret);

      const user = await User.findById(ret.userId);

      // 把当前用户数据放到 req 请求对象上， 后面的中间件就可以直接访问 req.user 获取当前的用户了，非常方便
      req.user = user;

      next();
    } catch (err) {
      res.status(401).end();
    }
  }
}