const express = require('express');
const router = express.Router();

const roleController = require('../controllers/role');

router
  .get('/roles', roleController.page)
  .get('/roles-list', roleController.list)
  .get('/roles/:id', roleController.one)
  .post('/roles', roleController.create)
  .put('/roles/:id', roleController.update)
  .delete('/roles/:id', roleController.delete);

module.exports = router;
