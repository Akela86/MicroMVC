const router = require('express').Router();

router.use('/', require('./home'));
router.use('*', require('./error404'));

module.exports = router;
