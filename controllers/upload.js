const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.files[0];

    const url = 'https://canday.site:3000/' + file.path;

    const originalname = req.files[0].originalname;

    res.status(200).json({ url, name: originalname });
  } catch(err) {
    next(err);
  }
}