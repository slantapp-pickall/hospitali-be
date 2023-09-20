const { asyncHandler, ErrorResponse } = require('../core');
const {
  ModelUser,
  ModelRate,
  ModelAssets,
  ModelBooking
} = require('../models');

/**
 * @description Create a new Book Requests
 * @route `/v1/booking`
 * @access Private
 * @type POST
 */
exports.index = asyncHandler(async (req, res, next) => {
  const { start, end, asset, total, services } = req.body;

  if (!start) {
    return next(new ErrorResponse('Please Date Of Reserveation is required'));
  }

  if (!end) {
    return next(new ErrorResponse('Please Date Of Exit is required'));
  }

  if (!asset) {
    return next(new ErrorResponse('Please an Asset is required'));
  }

  if (!(Array.isArray(services) && services.length > 0)) {
    return next(new ErrorResponse('A Valid service Is required is required'));
  }

  if (!total) {
    return next(new ErrorResponse('Total is required'));
  }
  // Check the asset and the sevrice then the total
  const isAssets = await ModelAssets.findOne({
    _id: asset
  });
  if (!isAssets) {
    return next(
      new ErrorResponse(
        'Invalid Asset or Content Do Not Exist Or Has Been Deleted',
        404
      )
    );
  }

  if (!isAssets.available) {
    return next(new ErrorResponse('Asset is Currently Not Avalible', 403));
  }
  let vtotal = 0;

  for (let i = 0; i < services.length; i++) {
    const e = services[i];
    if (!e.service) {
      return next(new ErrorResponse('Invalid Service at ' + i + 1, 403));
    }
    if (Number.isNaN(e.amount)) {
      return next(new ErrorResponse('Invalid Amount at ' + i + 1, 403));
    }
    vtotal += e.amount;
  }
  // Create and send the id back
  const data = await ModelBooking.create({
    start,
    end,
    _asset: asset,
    total,
    vtotal,
    services,
    _user: req.user._id
  });
  res.status(201).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description All my Bookings
 * @route `/v1/booking`
 * @access Private
 * @type GET
 */
exports.myBookings = asyncHandler(async (req, res, next) => {
  const data = await ModelBooking.find({
    _user: req.user._id
  }).populate('_asset', {
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
 * @description My Active bookgs
 * @route `/v1/booking`
 * @access Private
 * @type GET
 */
exports.myActiveBookings = asyncHandler(async (req, res, next) => {
  const data = await ModelBooking.find({
    _user: req.user._id,
    status: 'success',
    isCompleted: true
  }).populate('_asset', {
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
 * @description read one booking
 * @route `/v1/rating/admin/r`
 * @access Private
 * @type GET
 */
exports.read = asyncHandler(async (req, res, next) => {
  const data = await ModelBooking.findOne({ _id: req.params.id })
    .populate('_user', {
      name: 1,
      image: 1
    })
    .populate('_asset')
    .populate('_payment');

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description All my Bookings
 * @route `/v1/booking`
 * @access Private
 * @type GET
 */
exports.adminBookings = asyncHandler(async (req, res, next) => {
  const data = await ModelBooking.find({})
    .populate('_asset', {
      name: 1,
      image: 1
    })
    .populate('_user');

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description My Active bookgs
 * @route `/v1/booking`
 * @access Private
 * @type GET
 */
exports.adminActiveBookings = asyncHandler(async (req, res, next) => {
  const data = await ModelBooking.find({
    status: 'success',
    isCompleted: true
  })
    .populate('_asset', {
      name: 1,
      image: 1
    })
    .populate('_user');

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
