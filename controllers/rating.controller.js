const { asyncHandler } = require('../core');
const { ModelUser, ModelRate } = require('../models');

/**
 * @description Create A new rating
 * @route `/v1/rating`
 * @access Private
 * @type POST
 */
exports.index = asyncHandler(async (req, res, next) => {
  req.body._user = req.user._id;
  const data = await ModelRate.findOne(req.body);
  res.status(201).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description All Rating For A Asset
 * @route `/v1/rating`
 * @access Private
 * @type GET
 */
exports.Rating = asyncHandler(async (req, res, next) => {
  const data = await ModelRate.find({
    _asset: req.params.id
  }).populate('_user', {
    name: 1,
    image: 1
  });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description All Ratingin System
 * @route `/v1/rating/admin/r`
 * @access Private
 * @type GET
 */
exports.Rating = asyncHandler(async (req, res, next) => {
  const data = await ModelRate.find({}).populate('_user', {
    name: 1,
    image: 1
  });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
