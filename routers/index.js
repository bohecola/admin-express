const express = require('express');
const router = express.Router();

router.use(require('./common'));
router.use(require('./upload'));
router.use(require('./user'));
router.use(require('./role'));
router.use(require('./menu'));
router.use(require('./article'));
router.use(require('./category'));
router.use(require('./tag'));

router.use('/weblog', require('./weblog'));

module.exports = router;
