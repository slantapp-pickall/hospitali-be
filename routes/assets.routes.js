const express = require('express');
const router = express.Router();

const {
  index,
  deleteB,
  editB,
  create,
  single
} = require('../controllers/assets.controller');
const { admin } = require('../middleware');

router.get('/', index);
router.get('/:id', single);

router.use(admin);
router.post('/', create);
router.put('/:id', editB);
router.delete('/:id', deleteB);

module.exports = router;
