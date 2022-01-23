const express = require('express');
const commonController = require('../controllers/common');
const userController = require('../controllers/user');
const roleController = require('../controllers/role');
const menuController = require('../controllers/menu');

const router = express.Router();

router
  .post('/login', commonController.login)
  .get('/permissions', commonController.permissions)
  .get('/person', commonController.person)
  .post('/personUpdate', commonController.personUpdate)

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

module.exports = router;
