const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  register,
  admin
} = require('../controllers/authentication.controller');

router.post('/register/', register);
router.post('/login/', login);
router.get('/logout/', logout);

router.post('/login/admin/', admin);

module.exports = router;
