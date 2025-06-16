const { default: mongoose } = require("mongoose");
const ApplicationModel = require("../models/ApplicationModel");
const JobModel = require("../models/JobModel");

exports.applyToJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "UnAuthorised : Applicant Needs To Be Logged In" });
        }
        if (!mongoose.Types.ObjectId.isValid(jobId)) return res.status(400).json({ success: false, message: "Invalid Job ID" })

        const existing = await ApplicationModel
        .findOne({ job: jobId, applicant: user.id });
        if (existing) {
            return res.status(400).json({ success: false, message: "You have already applied to this job." });
        }
        const application = new ApplicationModel({
            job: jobId,
            applicant: user.id,
            resume: `${user.name}.pdf`
        })
        await application.save()
        res.json({ success: true, message: "Job Applied Succesfully !" })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getUserApplications = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "UnAuthorised : Applicant Needs To Be Logged In" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: "Invalid Job ID" })
        const allApplications = await ApplicationModel
            .find({ applicant: userId })
            .populate("job", "title location salary jobType")
        res.json({ success: true, message: "All Applications Of Applicant !", data: allApplications, length: allApplications.length })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

 
    const job = await JobModel.findById(jobId);
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


