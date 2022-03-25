const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menu');

router.get('/menus', menuController.list)
  .get('/menus/:id', menuController.one)
  .post('/menus', menuController.create)
  .put('/menus/:id', menuController.update)
  .delete('/menus/:id', menuController.delete);

module.exports = router;
