const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');

router.get('/articles', articleController.list)
  .get('/articles/:id', articleController.one)
  .post('/articles', articleController.create)
  .put('/articles/:id', articleController.update)
  .delete('/articles/:id', articleController.delete);

module.exports = router;
