const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  register,
  sendEmailVerification,
  emailVerification,
  forgotRequestPass,
  forgotVerify,
  forgotUpdate
} = require('../controllers/authentication.controller');
const { protect } = require('../middleware/');

router.post('/register/', register);
router.post('/login/', login);
router.get('/logout/', logout);

// verify Email
router.post('/verify/send/', protect, sendEmailVerification);
router.post('/verify/email/', protect, emailVerification);

// Forget Password
router.post('/forgot/request/', forgotRequestPass);
router.post('/forgot/validate/', forgotVerify);
router.put('/forgot/new/password/', protect, forgotUpdate);

module.exports = router;
