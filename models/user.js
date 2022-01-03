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

  roles: {
    type: [Schema.Types.ObjectId],
    ref: 'Role'
  },

  createAt: {
    type: Date,
    default: Date.now
  },

  updateAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = userSchema;