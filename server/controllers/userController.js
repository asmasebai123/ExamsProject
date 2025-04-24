const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getAllProctors = catchAsync(async (req, res, next) => {
  const proctors = await User.find({ role: 'teacher' });
  
  res.status(200).json({
    status: 'success',
    results: proctors.length,
    data: {
      proctors
    }
  });
});