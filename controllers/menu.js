const { Menu } = require('../models');
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

      Menu
        .paginate(filter, {
          sort: { createdAt: -1 },
          populate: { path: 'parentId' },
          lean: true,
          leanWithId: false,
          page: parseInt(page),
          limit: parseInt(limit)
        })
        .then(ret => {
          ret.docs.forEach(item => {
            if (item.parentId !== null) {
              item.parentName = item.parentId.name;
              item.parentId = item.parentId._id;
            }
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
      Menu
        .findById(req.params.id)
        .populate({ path: 'parentId' })
        .lean()
        .then(ret => {
          if (ret.parentId !== null) {
            ret.parentName = ret.parentId.name;
            ret.parentId = ret.parentId._id;
          }
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
      new Menu(req.body)
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
      Menu
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
      Menu
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
