const { Schema } = require('mongoose');

const roleSchema = new Schema({
  // 角色名称
  name: {
    type: String,
    unique: true,
    required: true
  },

  label: {
    type: String,
    unique: true,
    required: true
  },

  // 角色描述
  remark: {
    type: String,
    default: null
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
}, { timestamps: true });

module.exports = roleSchema;