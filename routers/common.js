const express = require('express');
const router = express.Router();

const commonController = require('../controllers/common');

router
  .post('/login', commonController.login)
  .get('/permmenu', commonController.permmenu)
  .get('/person', commonController.person)
  .post('/personUpdate', commonController.personUpdate);

module.exports = router;
