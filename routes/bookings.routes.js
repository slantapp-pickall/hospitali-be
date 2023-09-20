const express = require('express');
const router = express.Router();

const { protect } = require('../middleware');
const {
  read,
  index,
  myBookings,
  myActiveBookings,
  adminBookings,
  adminActiveBookings
} = require('../controllers/bookings.controller');

router.use(protect);
router.post('/', index);
router.get('/', myBookings);
router.get('/active', myActiveBookings);
router.get('/admin', adminBookings);
router.get('/admin/active', adminActiveBookings);
router.get('/admin/r/:id', read);
module.exports = router;
