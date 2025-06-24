const { default: mongoose } = require("mongoose");
const ApplicationModel = require("../models/ApplicationModel");
const JobModel = require("../models/JobModel");
const userModel = require("../models/userModel");

exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    // Check if user is authenticated
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Applicant needs to be logged in"
      });
    }

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID"
      });
    }


    const existing = await ApplicationModel.findOne({
      job: jobId,
      applicant: user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job."
      });
    }


    const application = new ApplicationModel({
      job: jobId,
      applicant: user.id,
      resume: `${user.name}.pdf`,
      appliedAt: new Date(),
    });

    await application.save();
    console.log("Application created:", application);


    await userModel.findByIdAndUpdate(
      user.id,
      { $push: { appliedJobs: jobId } },
      { new: true }
    );

    await JobModel.findByIdAndUpdate(
      { _id: jobId },
      {
        $push: { applicants: user.id },
        $inc:{applicantCount:1}
      }
    )

    res.json({
      success: true,
      message: "Job applied successfully!",
      applicationId: application._id
    });

  } catch (error) {
    console.error("Error in applyToJob:", error);
    next(error);
  }
};


exports.getUserApplications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "UnAuthorised : Applicant Needs To Be Logged In" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: "Invalid Job ID" })
    if(user.id.toString()!==userId.toString()) return res.status(400).json({ success: false, message: "UnAuthorized :Check Job Id" })
    const appliedJobs = await userModel
      .findOne({ _id: userId },"appliedJobs")
      .populate("appliedJobs", "title company ")

    res.json({ success: true, message: "All Jobs Are Fetching Successfull !", data: appliedJobs, length: appliedJobs.length })
  } catch (error) {
    console.log(error)
    next(error)
  }
}


exports.getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = req.user;
    console.log(user)

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }


    const job = await JobModel.findById(jobId);
    console.log("job", job)
    if (!job || job.createdBy.toString() !== user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to view applicants for this job." });
    }

    const applications = await ApplicationModel.find({ job: jobId }).populate("applicant", "name email");

    res.status(200).json({
      success: true,
      message: "Applicants fetched successfully.",
      data: applications,
      total: applications.length,
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};


