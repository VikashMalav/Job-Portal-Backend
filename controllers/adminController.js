const userModel = require("../models/userModel");





exports.getAllUsers = async (req, res,next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      userModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password'), // exclude password field
      userModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      page,
      limit,
      totalPages,
      totalUsers
    });
  } catch (err) {
    console.log( "Error fetching users:", err);
    next(new Error("Failed to fetch users"));
  }
};


exports.getAllJobs = async (req, res, next) => {
    try {
        console.log("getAllJobs")
    } catch (error) {
        console.log(error)
    }
}


exports.getAllApplications = async (req, res, next) => {
    try {
        console.log("getAllApplications")
    } catch (error) {
        console.log(error)
    }
}


exports.deleteUserByAdmin = async (req, res, next) => {
    try {
        console.log("deleteUserByAdmin")
    } catch (error) {
        console.log(error)
    }
}


exports.deleteJobByAdmin = async (req, res, next) => {
    try {
        console.log("deleteJobByAdmin")
    } catch (error) {
        console.log(error)
    }
}



const JobModel = require("../models/JobModel");
const ApplicationModel = require("../models/ApplicationModel");

exports.getDashboardStats = async (req, res, next) => {
    try {
        const [totalUsers, activeJobs, totalApplications] = await Promise.all([
            userModel.countDocuments(),
            JobModel.countDocuments(),
            ApplicationModel.countDocuments()
        ]);
        res.json({
            totalUsers,
            activeJobs,
            totalApplications
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

