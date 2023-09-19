const express = require('express');
const router = express.Router();

const { protect } = require('../middleware');
const { Rating, index } = require('../controllers/rating.controller');

router.use(protect);
router.post('/', index);
router.get('/:id/', Rating);
router.get('/admin/r', Rating);
module.exports = router;
