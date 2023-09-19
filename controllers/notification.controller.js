const { asyncHandler } = require('../core');
const { ModelNotification } = require('../models');

/**
 * @description Get All notification
 * @route `/v1/notifications`
 * @access Private
 * @type POST
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = await ModelNotification.find({ _user: req.user._id });
  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description A Notification
 * @route `/v1/notification`
 * @access Private
 * @type GET
 */
exports.Notifications = asyncHandler(async (req, res, next) => {
  const data = await ModelNotification.findOne({
    _user: req.user._id,
    _id: req.params.id
  }).populate('_asset');

  data.seen = true;
  await data.save();
  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Mark All As Read
 * @route `/v1/notifications`
 * @access Private
 * @type PUT
 */
exports.MarkAsRead = asyncHandler(async (req, res, next) => {
  const data = await ModelNotification.updateMany(
    { _user: req.user._id },
    { seen: true }
  );

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
