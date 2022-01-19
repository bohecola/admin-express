const { Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  name: {
    type: String,
    default: ''
  },

  desc: {
    type: String,
    default: ''
  },

  avatar: {
    type: String,
    default: ''
  },

  roles: {
    type: [Schema.Types.ObjectId],
    ref: 'Role'
  }
}, { timestamps: true });

module.exports = userSchema;