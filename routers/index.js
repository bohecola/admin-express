const express = require('express');
const uploadController = require('../controllers/upload');
const commonController = require('../controllers/common');
const userController = require('../controllers/user');
const roleController = require('../controllers/role');
const menuController = require('../controllers/menu');
const articleController = require('../controllers/article');
const categoryController = require('../controllers/category');
const tagController = require('../controllers/tag');

const router = express.Router();

router
  .post('/login', commonController.login)
  .get('/permmenu', commonController.permmenu)
  .get('/person', commonController.person)
  .post('/personUpdate', commonController.personUpdate);

router
  .post('/uploadFile', uploadController.uploadFile);

router.get('/users', userController.list)
  .get('/users/:id', userController.one)
  .post('/users', userController.create)
  .put('/users/:id', userController.update)
  .delete('/users/:id', userController.delete);

router.get('/roles', roleController.list)
  .get('/roles/:id', roleController.one)
  .post('/roles', roleController.create)
  .put('/roles/:id', roleController.update)
  .delete('/roles/:id', roleController.delete);

router.get('/menus', menuController.list)
  .get('/menus/:id', menuController.one)
  .post('/menus', menuController.create)
  .put('/menus/:id', menuController.update)
  .delete('/menus/:id', menuController.delete);

router.get('/articles', articleController.list)
  .get('/articles/:id', articleController.one)
  .post('/articles', articleController.create)
  .put('/articles/:id', articleController.update)
  .delete('/articles/:id', articleController.delete);

router.get('/category', categoryController.list)
  .get('/category/:id', categoryController.one)
  .post('/category', categoryController.create)
  .put('/category/:id', categoryController.update)
  .delete('/category/:id', categoryController.delete);

router.get('/tags', tagController.list)
  .get('/tags/:id', tagController.one)
  .post('/tags', tagController.create)
  .put('/tags/:id', tagController.update)
  .delete('/tags/:id', tagController.delete);

module.exports = router;
