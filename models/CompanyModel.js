const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: String,
  location: String,
  website: String,
  about: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Only 'employer' or 'admin' should be allowed
  },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
