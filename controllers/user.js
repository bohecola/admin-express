const { User } = require('../models');
const Common = require('./common');
const Constant = require('../constant');


exports.list = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    checkParams: cb => {
      Common.checkParams(req.query, ['page', 'limit'], cb);
    },
    query: ['checkParams', (results, cb) => {
      const { page, limit } = req.query;

      const filter = {};

      User
        .paginate(filter, {
          sort: { createdAt: -1 },
          populate: { path: 'roles', select: 'name -_id' },
          lean: true,
          leanWithId: false,
          page: parseInt(page),
          limit: parseInt(limit)
        })
        .then(ret => {
          ret.docs.forEach(item => {
            item.roleName = item.roles.map(role => role.name).join(',');
            delete item.roles;
          });

          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }]
  };

  Common.autoFn(tasks, res, resObj);
}

exports.one = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    query: cb => {
      User
        .findById(req.params.id)
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.create = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    add: cb => {
      new User(req.body)
        .save()
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.update = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    update: cb => {
      User
        .findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        )
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}

exports.delete = (req, res) => {
  const resObj = Common.clone(Constant.DEFAULT_SUCCESS);

  let tasks = {
    remove: cb => {
      User
        .findByIdAndRemove(req.params.id)
        .then(ret => {
          resObj.data = ret;
          cb(null);
        })
        .catch(err => {
          console.log(err);
          cb(Constant.DEFAULT_ERROR);
        });
    }
  };

  Common.autoFn(tasks, res, resObj);
}
