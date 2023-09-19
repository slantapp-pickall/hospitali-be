const express = require('express');
const router = express.Router();

const { profile } = require('../controllers/users.controller');
const { protect } = require('../middleware/');

router.use(protect);

router.get('/', profile);

module.exports = router;
