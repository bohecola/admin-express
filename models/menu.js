const { Schema } = require('mongoose');

const menuSchema = new Schema({
  // 菜单名称
  name: {
    type: String,
    unique: true,
    required: true
  },

  // 菜单描述
  description: {
    type: String,
    default: ''
  },

  // 上级菜单
  parentId: {
    type: Schema.Types.ObjectId
  },

  // 前端名称（标识）
  unique: {
    type: String,
    unique: true,
    required: true
  },

  // 节点路由
  path: {
    type: String,
    unique: true,
    required: true
  },

  // 菜单图标
  icon: {
    type: String,
    default: ''
  },

  // 是否显示
  hidden: {
    type: Boolean,
    default: false
  },

  // 是否启用
  status: {
    type: Number,
    default: 0
  },

  // 排序
  sort: {
    type: Number,
    default: 0
  },

  // 创建时间
  createAt: {
    type: Date,
    default: Date.now
  },

  // 更新时间
  updateAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = menuSchema;