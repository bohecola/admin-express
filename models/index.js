const mongoose = require('mongoose');

// 连接数据库
main().catch((err) => console.log('数据库连接失败', err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/admin-demo');
  console.log('数据库连接成功');
}

module.exports = {
  User: mongoose.model('User', require('./user')),
  Role: mongoose.model('Role', require('./role')),
  Menu: mongoose.model('Menu', require('./menu'))
}
