const Room = require('../models/Room');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await Room.find();

  res.status(200).json({
    status: 'success',
    results: rooms.length,
    data: {
      rooms
    }
  });
});

exports.createRoom = catchAsync(async (req, res, next) => {
  const { name, capacity } = req.body;

  const newRoom = await Room.create({
    name,
    capacity
  });

  res.status(201).json({
    status: 'success',
    data: {
      room: newRoom
    }
  });
});