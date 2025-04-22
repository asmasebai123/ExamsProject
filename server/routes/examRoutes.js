const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const examController = require('../controllers/examController');
const roomController = require('../controllers/roomController');
const userController = require('../controllers/userController');
const notificationController = require('../controllers/notificationController');

// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Exam routes
router.route('/exams')
  .get(examController.getAllExams)
  .post(examController.createExam);

router.route('/exams/:id')
  .delete(examController.deleteExam);

// Room routes
router.route('/rooms')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom);

// User routes
router.get('/users/proctors', userController.getAllProctors);

// Notification routes
router.post('/notifications/send', notificationController.sendNotifications);

module.exports = router;