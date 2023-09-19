const { ErrorResponse, asyncHandler, sendTokenResponse } = require('../core');
const { ModelUser } = require('../models');

/**
 * @description Registeration using Form Input For user
 * @route `/v1/authentication/register`
 * @access Public
 * @type POST
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { uid, name, image, device } = req.body;
  try {
    if (!req.body.email) {
      return next(new ErrorResponse('Email Address Is Required', 403));
    }
    if (!req.body.uid) {
      return next(new ErrorResponse('UID Is Required', 403));
    }
    if (!req.body.name) {
      return next(new ErrorResponse('Name Is Required', 403));
    }
    if (!req.body.device) {
      return next(new ErrorResponse('Device ID for FCM Is Required', 403));
    }
    if (!req.body.image) {
      return next(new ErrorResponse('Image return by google', 403));
    }
    const email = req.body.email.toLowerCase()
      ? req.body.email.toLowerCase()
      : '';
    const checkAccount = await ModelUser.findOne({
      email: email
    });

    if (checkAccount) {
      return next(
        new ErrorResponse(`Email Address already exist, Please Login`, 400)
      );
    }

    const incoming = {
      email,
      device,
      name,
      image,
      uid
    };
    const newUser = await ModelUser.create([incoming]);
    sendTokenResponse(newUser, 201, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @description Login using Form Input
 * @route `/v1/authentication/login`
 * @access Public
 * @type POST
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, uid } = req.body;

  // Validate email & uid
  if (!email || !uid) {
    return next(new ErrorResponse('Please provide an email and uid', 400));
  }

  // Check for user
  const user = await ModelUser.findOne({ email: email.toLowerCase() })
    .select('+uid')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if UID matches
  const isMatch = await user.matchUID(uid);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

/**
 * @description Logout
 * @route `/v1/authentication/logout`
 * @access Public
 * @type GET
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @description Login using Form Input Admin
 * @route `/v1/authentication/login/admin`
 * @access Public
 * @type POST
 */
exports.admin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await ModelUser.findOne({ email: email.toLowerCase() })
    .select('+password')
    .select('+email');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});
