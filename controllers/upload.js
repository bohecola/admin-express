const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.files[0];
    const pathArray = req.files[0].path.split('\\');
    pathArray.pop();

    const newPath = pathArray.join('/') + '/' + file.originalname;
    const url = 'http://localhost:3000/' + newPath;

    const originalname = req.files[0].originalname;
    const fileName = originalname.split('.').shift();

    fs.rename(req.files[0].path, newPath, function (err) {
      if (err) res.send('上传失败'); 

      res.status(200).json({ url, fileName });
    });
  } catch(err) {
    next(err);
  }
}