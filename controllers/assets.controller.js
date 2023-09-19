const { asyncHandler, ErrorResponse } = require('../core');
const { ModelAssets } = require('../models');

/**
 * @description Get All Assets
 * @route `/v1/assets/`
 * @access Private
 * @type GET
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = await ModelAssets.find({});

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Create Assets
 * @route `/v1/assets/`
 * @access Private
 * @type POST
 */
exports.create = asyncHandler(async (req, res, next) => {
  const {
    rent,
    name,
    address,
    country,
    state,
    local,
    lang,
    long,
    image,
    video,
    images,
    tag,
    bedrooms,
    toilet,
    dinning,
    bathroom,
    pool,
    available,
    additional,
    service
  } = req.body;

  if (!name || !image) {
    return next(new ErrorResponse('Please Name And Image Are Required'));
  }

  if (!rent) {
    return next(new ErrorResponse('Please rent is required'));
  }

  const data = await ModelAssets.create(req.body);

  res.status(201).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Delete A Assets
 * @route `/v1/assets/`
 * @access Private
 * @type Delete
 */
exports.deleteB = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Please Assets ID is Required'));
  }
  const data = await ModelAssets.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Edit a Assets
 * @route `/v1/assets/`
 * @access Private
 * @type PUT
 */
exports.editB = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Please Assets ID is Required'));
  }
  const data = await ModelAssets.updateOne({ _id: req.params.id }, req.body);
  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Get a Signle Assets
 * @route `/v1/assets/`
 * @access Private
 * @type GET
 */
exports.single = asyncHandler(async (req, res, next) => {
  const data = await ModelAssets.findOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
