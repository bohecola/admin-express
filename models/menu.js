const { Schema } = require('mongoose');

const menuSchema = new Schema({
  // 菜单名称
  name: {
    type: String,
    unique: true,
    required: true
  },

  // 节点路由
  path: {
    type: String
  },
  
  // 菜单类型
  type: {
    type: Number,  // 0 目录, 1 菜单
    required: true
  },

  // 菜单图标
  icon: {
    type: String,
    default: ''
  },

  // 上级菜单id
  parentId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Menu'
  },

  // 视图文件路径
  viewPath: {
    type: String,
    default: null
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
  }
}, { timestamps: true });

module.exports = menuSchema;