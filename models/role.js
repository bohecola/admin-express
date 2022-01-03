const { Schema } = require('mongoose');

const roleSchema = new Schema({
  // 角色名称
  name: {
    type: String,
    required: true
  },

  // 角色描述
  description: {
    type: String,
    default: ''
  },

  // 角色菜单权限
  menus: {
    type: [Schema.Types.ObjectId],
    ref: 'Menu'
  },

  // // 资源权限
  // resources: {
  //   type: [Schema.Types.ObjectId],
  //   ref: 'Resource'
  // }

  /**
   * 是否启用
   * 0：禁用
   * 1：启用
   */

  status: {
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

module.exports = roleSchema;