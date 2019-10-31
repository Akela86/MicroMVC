const router = require('express').Router();

router.use('/', require('./pages'));
router.use('/api', require('./api'));

module.exports = router;
