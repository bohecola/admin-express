const express = require('express');
const router = express.Router();

const weblogController = require('../controllers/weblog');

router
  .get('/me', weblogController.me)
  .get('/articles', weblogController.articleList)
  .get('/articles/:id', weblogController.articleOne)
  .get('/tags', weblogController.tagList)
  .get('/category', weblogController.categoryList)
  .get('/archive', weblogController.archiveList);

module.exports = router;
