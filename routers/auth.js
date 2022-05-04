const express = require('express');
const router = express.Router();

const commonController = require('../controllers/auth');

router
  .post('/login', commonController.login)
  .get('/permmenu', commonController.permmenu)
  .get('/person', commonController.person)
  .post('/personUpdate', commonController.personUpdate);

module.exports = router;
