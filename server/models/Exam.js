// models/Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Un examen doit avoir un sujet']
  },
  date: {
    type: Date,
    required: [true, 'Une date est requise']
  },
  duration: {
    type: Number, // en minutes
    required: [true, 'La durée est requise']
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Une salle est requise']
  },
  proctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un surveillant est requis']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Populate automatique
examSchema.pre(/^find/, function(next) {
  this.populate('room').populate('proctor');
  next();
});

module.exports = mongoose.model('Exam', examSchema);