const express = require('express');
const router = express.Router();

const {
  index,
} = require('../controllers/blog.controller');


router.get('/', index);


module.exports = router;
