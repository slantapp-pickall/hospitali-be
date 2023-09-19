const { ErrorResponse, asyncHandler, sendTokenResponse } = require('../core');
const { ModelUser } = require('../models');
const sendEmail = require('../mail');
const { generateOTP } = require('../core/core.utils');

/**
 * @description Registeration using Form Input For user
 * @route `/v1/authentication/register`
 * @access Public
 * @type POST
 */
exports.register = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.email) {
      return next(new ErrorResponse('Email Address Is Required', 403));
    }
    if (!req.body.password) {
      return next(new ErrorResponse('Password Is Required', 403));
    }
    if (!req.body.name) {
      return next(new ErrorResponse('Name Is Required', 403));
    }
    const email = req.body.email.toLowerCase()
      ? req.body.email.toLowerCase()
      : '';
    const checkAccount = await ModelUser.findOne({
      email: email
    });
    const checkPhone = await ModelUser.findOne({
      phone: req.body.name
    });

    if (checkAccount) {
      return next(
        new ErrorResponse(
          `Email Address already exist, \n Please Login or Reset password if Forgotten`,
          400
        )
      );
    }

    if (checkPhone) {
      return next(
        new ErrorResponse(
          ` ${checkPhone.tag.toUpperCase()} already exist, \n Please Use Another phone Number 👀`,
          400
        )
      );
    }

    const incoming = {
      email,
      password: req.body.password,
      name: req.body.name,
      phone: req.body.phone,
      Token: generateOTP(4),
      TokenExpire: Date.now() + 10 * 60 * 1000
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
 * @description Forgot Password
 * @access Public
 * @type POST
 */
exports.forgotRequestPass = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse('Email is Require, To Process', 400));
  }
  const user = await ModelUser.findOne({
    email: req.body.email.toLowerCase()
  });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const token = user.getResetPasswordToken();
  try {
    await user.save({ validateBeforeSave: false });
    sendEmail({
      to: req.body.email,
      subject: 'Reset Your Password',
      message: `Reset url is https://test/reset/${token}/${generateOTP(
        7
      )}/?email=${user.email}`
    });
    res.status(200).json({ success: true, data: 'Email sent successfully' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Something Went Wrong', 500));
  }
});

/**
 * @description Verify OTP For Forget Password
 * @access Public
 * @type POST
 */
exports.forgotVerify = asyncHandler(async (req, res, next) => {
  const { token, email } = req.body;

  // Token
  if (!token) {
    return next(new ErrorResponse('Please provide an email and token', 400));
  }

  // Check for user
  const user = await ModelUser.findOne({ resetPasswordToken: token, email });

  if (!user) {
    return next(
      new ErrorResponse(
        'Invalid credentials Or Token Has Expired, Resend a New Token',
        401
      )
    );
  }

  if (user.resetPasswordExpire < Date.now()) {
    return next(
      new ErrorResponse('Token Has Expired, Resend a New Token', 400)
    );
  }

  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  user._email = true;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @description Update Password For Forget Password
 * @access Private
 * @type PUT
 */
exports.forgotUpdate = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  // Token
  if (!password) {
    return next(new ErrorResponse('Please provide a Valid Password', 400));
  }

  // Check for user
  const user = await Users.findOne({ _id: req.user._id });

  user.password = password;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @description Logout
 * @route `/v1/verify/send`
 * @access Private
 * @type POST
 */
exports.sendEmailVerification = asyncHandler(async (req, res, next) => {
  const user = await ModelUser.findOne({ _id: req.user._id });

  const otp = generateOTP(4);
  user.TokenExpire = Date.now() + 10 * 60 * 1000;

  user.Token = otp;
  await user.save();

  sendEmail({
    to: user.email,
    subject: 'One More Step',
    message: `There Your OTP ${otp}  `
  });

  res.status(200).json({
    success: true,
    message: 'OTP Sent Successful'
  });
});

/**
 * @description Verify Email Account
 * @route `/v1/verify/email`
 * @access Private
 * @type POST
 */
exports.emailVerification = asyncHandler(async (req, res, next) => {
  const user = await ModelUser.findOne({ _id: req.user._id });
  const { otp } = req.body;

  // Validate email & password
  if (!otp) {
    return next(new ErrorResponse('Please provide an otp', 400));
  }

  if (user.Token !== otp) {
    return next(new ErrorResponse('OTP Is Wrong', 400));
  }

  if (user.TokenExpire < Date.now()) {
    return next(
      new ErrorResponse('Token Has Expired, Resend a New Token', 400)
    );
  }

  user.Token = null;
  user.TokenExpire = null;
  user._email = true;
  await user.save();

  sendEmail({
    to: user.email,
    subject: 'Congrate You Are Now Verified',
    message: `Happy to get you onboard `
  });

  //TODO: Invitation has Been Sent

  sendTokenResponse(user, 200, res);
});
