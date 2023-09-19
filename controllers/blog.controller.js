const { asyncHandler, ErrorResponse } = require('../core');
const { ModelBlog } = require('../models');

/**
 * @description Get All Blogs
 * @route `/v1/blog`
 * @access Private/Public
 * @type GET
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = await ModelBlog.find({});

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Create Or Add To  Blogs
 * @route `/v1/blog`
 * @access Private/Public
 * @type POST
 */
exports.create = asyncHandler(async (req, res, next) => {
  const { image, author, body, read, title } = req.body;

  if (!title || !image) {
    return next(new ErrorResponse('Please Title And Image Are Required'));
  }

  const data = await ModelBlog.create({ image, author, body, read, title });

  res.status(201).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Delete A blog
 * @route `/v1/blog`
 * @access Private/Public
 * @type Delete
 */
exports.deleteB = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Please Blog ID is Required'));
  }
  const data = await ModelBlog.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Edit a Blog
 * @route `/v1/blog`
 * @access Private/Public
 * @type PUT
 */
exports.editB = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Please Blog ID is Required'));
  }
  const data = await ModelBlog.updateOne({ _id: req.params.id }, req.body);
  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});
