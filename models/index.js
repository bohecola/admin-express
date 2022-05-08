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

User.plugin(mongoosePaginate);
Role.plugin(mongoosePaginate);
Menu.plugin(mongoosePaginate);
Article.plugin(mongoosePaginate);
Category.plugin(mongoosePaginate);
Tag.plugin(mongoosePaginate);

const { DB_SERVER, DB_NAME, DB_USER, DB_SECRET } = require('../config/db');

// 连接数据库
main().catch((err) => console.log('数据库连接失败', err))

async function main() {
  await mongoose.connect(`mongodb://${DB_SERVER}:27017/${DB_NAME}`, {
    authSource: 'admin',
    auth: {
      username: DB_USER,
      password: DB_SECRET
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
