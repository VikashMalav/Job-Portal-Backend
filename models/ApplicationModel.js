const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: String, // optional override if user uploads a different resume
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied',
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
