const express = require('express');
const router = express.Router();

const {
  index,
  deleteB,
  editB,
  create
} = require('../controllers/blog.controller');
const { protect } = require('../middleware');

router.get('/', index);

router.use(protect);
router.post('/', create);
router.put('/:id', editB);
router.delete('/:id', deleteB);

module.exports = router;
