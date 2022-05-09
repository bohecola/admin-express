const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category');

router
  .get('/category', categoryController.page)
  .get('/category-list', categoryController.list)
  .get('/category/:id', categoryController.one)
  .post('/category', categoryController.create)
  .put('/category/:id', categoryController.update)
  .delete('/category/:id', categoryController.delete);

module.exports = router;
