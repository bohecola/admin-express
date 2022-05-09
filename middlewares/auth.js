const jwt = require('jsonwebtoken');
const { tokenSecret } = require('../config');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Get token
    const token = req.get('Authorization');

    if (!token) {
      return res.status(401).end();
    }
    // 验证 token 的有效性（解token）
    const ret = jwt.verify(token, tokenSecret);

    const user = await User.findById(ret.userId);

    req.user = user;

    next();
  } catch (err) {
    res.status(401).end();
  }
}
