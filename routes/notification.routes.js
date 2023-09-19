const express = require('express');
const router = express.Router();

const { protect } = require('../middleware');
const {
  index,
  Notifications,
  MarkAsRead
} = require('../controllers/notification.controller');

router.use(protect);
router.get('/', index);
router.get('/:id/', Notifications);
router.put('/', MarkAsRead);
module.exports = router;
