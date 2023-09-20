const { asyncHandler } = require('../core');
const { ModelPayment, ModelBooking } = require('../models');

/**
 * @description Webhook From Third Party
 * @route `/v1/webhook`
 * @access Private
 * @type Post
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const transaction = data.data.meta.id;

  // Find Transact
  const booking = await ModelBooking.findOne({
    _id: transaction
  });

  if (!booking) {
    return res.send('reversed');
  }

  if (!booking == 'pending') {
    await ModelPayment.create({
      _user: booking._user,
      _asset: booking._asset,
      amount: booking.total,
      status: 'failed'
    });

    return res.send('reversed');
  }

  if (!req.body.event) {
    await ModelPayment.create({
      _user: booking._user,
      _asset: booking._asset,
      amount: booking.total,
      status: 'failed'
    });
    booking.status = 'failed';
    await booking.save();
    return res.send('saved');
  }

 await ModelPayment.create({
    _user: booking._user,
    _asset: booking._asset,
    amount: booking.total,
    status: 'success'
  });
  booking.status = 'success';
  await booking.save();

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
