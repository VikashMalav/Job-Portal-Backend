const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: String,
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['user', 'employer', 'admin'],
    default: 'user',
  },
  resume: String, // file URL or path
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
}, { timestamps: true });

// Pre-save: hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: {
//     type: String,
//     required: true,
   
//   },
//   email:{
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       "Please enter a valid email address",
//     ],
   
//   },
//    password:{
//       type:String,
//       required:[true,"password is required"],
//       trim:true,
      
//     },
//     role: {
//   type: String,
//   enum: ["user", "admin"], 
//   default: "user",         
// },

//   message: String
// }, { timestamps: true });

// module.exports = mongoose.model('User_details', userSchema);
