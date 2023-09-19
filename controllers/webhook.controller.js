const { asyncHandler } = require('../core');
const { ModelPayment } = require('../models');

/**
 * @description Webhook From Third Party
 * @route `/v1/webhook`
 * @access Private
 * @type Post
 */
exports.index = asyncHandler(async (req, res, next) => {
  // const data = await ModelPayment.findOne({
  //   _id: req.user._id
  // });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
