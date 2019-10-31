'use strict';
const router = require('express').Router();

router.get('/', (req, res) => {
   const obj = {
      title: 'Titolo Pagina'
   };

   res.render('main', obj);
});

module.exports = router;
