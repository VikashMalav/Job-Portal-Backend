const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  description: String,
  location: String,
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote'],
    default: 'Full-time',
  },
  salary: Number,
  skills: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // employer who posted the job
    required: true,
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
 
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
