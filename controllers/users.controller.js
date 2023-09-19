const { asyncHandler } = require('../core');
const { ModelUser } = require('../models');

/**
 * @description Getting User Detail
 * @route `/v1/user/profile`
 * @access Private
 * @type GET
 */
exports.profile = asyncHandler(async (req, res, next) => {
  const data = await ModelUser.findOne({
    _id: req.user._id
  });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
