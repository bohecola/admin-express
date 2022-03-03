const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
mongoosePaginate.paginate.options = {
  lean: true,
  page: 1,
  limit: 20
};

const User = require('./user');
const Role = require('./role');
const Menu = require('./menu');
const Article = require('./article');
const Category = require('./category');
const Tag = require('./tag');

Article.plugin(mongoosePaginate);

// 连接数据库
main().catch((err) => console.log('数据库连接失败', err))

async function main() {
  await mongoose.connect('mongodb://localhost:27017/admin-demo', {
    authSource: 'admin',
    auth: {
      username: 'admin-demo',
      password: '123456'
    }
  });
  console.log('数据库连接成功');
}

module.exports = {
  User: mongoose.model('User', User),
  Role: mongoose.model('Role', Role),
  Menu: mongoose.model('Menu', Menu),
  Article: mongoose.model('Article', Article),
  Category: mongoose.model('Category', Category),
  Tag: mongoose.model('Tag', Tag),
}
