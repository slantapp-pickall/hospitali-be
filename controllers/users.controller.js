const { asyncHandler } = require('../core');
const { ModelUser } = require('../models');

/**
 * @description Getting User Detail
 * @route `/v1/user/`
 * @access Private
 * @type GET
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = await ModelUser.find({});

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Getting a User Detail
 * @route `/v1/user/`
 * @access Private
 * @type GET
 */
exports.signle = asyncHandler(async (req, res, next) => {
  const data = await ModelUser.findOne({
    _id: req.user._id
  });

  //Add Bookings

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Blocking/Unblock User Detail
 * @route `/v1/user/:id`
 * @access Private
 * @type GET
 */
exports.block = asyncHandler(async (req, res, next) => {
  const data = await ModelUser.findOne({
    _id: req.params.id
  });

  data.blocked = !data.blocked;
  await data.save();

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
