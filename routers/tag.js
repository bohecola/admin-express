const express = require('express');
const router = express.Router();

const tagController = require('../controllers/tag');

router
  .get('/tags', tagController.page)
  .get('/tags-list', tagController.list)
  .get('/tags/:id', tagController.one)
  .post('/tags', tagController.create)
  .put('/tags/:id', tagController.update)
  .delete('/tags/:id', tagController.delete);

module.exports = router;
