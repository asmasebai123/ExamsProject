const Exam = require('../models/Exam');
const Room = require('../models/Room');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllExams = catchAsync(async (req, res, next) => {
  const exams = await Exam.find()
    .populate('room')
    .populate('proctor', 'firstName lastName email');

  res.status(200).json({
    status: 'success',
    results: exams.length,
    data: {
      exams
    }
  });
});

exports.createExam = catchAsync(async (req, res, next) => {
  const { subject, date, duration, roomId, proctorId } = req.body;

  // Check if room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  // Check if proctor exists
  const proctor = await User.findById(proctorId);
  if (!proctor || proctor.role !== 'teacher') {
    return next(new AppError('No valid proctor found with that ID', 404));
  }

  const newExam = await Exam.create({
    subject,
    date,
    duration,
    room: roomId,
    proctor: proctorId
  });

  res.status(201).json({
    status: 'success',
    data: {
      exam: newExam
    }
  });
});

exports.deleteExam = catchAsync(async (req, res, next) => {
  const exam = await Exam.findByIdAndDelete(req.params.id);

  if (!exam) {
    return next(new AppError('No exam found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});