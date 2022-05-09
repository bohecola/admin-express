const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/users', userController.page)
  .get('/users/:id', userController.one)
  .post('/users', userController.create)
  .put('/users/:id', userController.update)
  .delete('/users/:id', userController.delete);

module.exports = router;
