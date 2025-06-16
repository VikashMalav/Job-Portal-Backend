const { default: mongoose } = require("mongoose");
const JobModel = require("../models/JobModel");
const CompanyModel = require("../models/CompanyModel");
const ApplicationModel = require("../models/ApplicationModel");

exports.getMyJobs = async (req, res, next) => {
    try {

        const user = req.user;
        console.log(user.id)
        if (!user) return res.status(400).json({ success: false, message: "Employer Need To Be Login First" })
        const jobList = await JobModel.find({ createdBy: user.id }).populate("company", "name industry location")
        if (!jobList?.length > 0) return res.status(404).json({ success: true, message: "No Jobs Posted " })
        res.json({ success: true, message: "Jobs Fetched Successfully ", data: jobList, length: jobList.length })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.postNewJob = async (req, res, next) => {
    try {
        const { title, company, description, jobType, salary, location, skills } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(400).json({ success: false, message: "Employer needs to be logged in" });
        }
        // if (!mongoose.Types.ObjectId.isValid(company)) return res.status(400).json({ success: false, message: "Invalid Company ID" })
        const existingCompany = await CompanyModel.findOne({ name: { $regex: new RegExp(`^${company}$`, 'i') } });
console.log(existingCompany)
        if (!existingCompany) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        console.log("company ", existingCompany._id)
        const job = new JobModel({
            title,
            company: existingCompany._id,
            description,
            jobType,
            salary,
            location,
            skills,
            createdBy: user.id
        });

        await job.save();

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            job
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};



exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const updateData = req.body;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: Please log in first" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

  
    const job = await JobModel.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.createdBy.toString() !== user.id.toString()) {
      return res.status(403).json({ success: false, message: "You are not allowed to update this job" });
    }

   
    const updatedJob = await JobModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });

  } catch (error) {
    console.error("Error updating job:", error);
    next(error);
  }
};



exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Employer needs to be logged in" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Job ID" })
        const deletedJob = await JobModel.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: " Job Deleted Successfull " })

    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getJobApplications = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Employer needs to be logged in" });
        }
        if (!mongoose.Types.ObjectId.isValid(jobId)) return res.status(400).json({ success: false, message: "Invalid Job ID" })
            const jobApplications = await ApplicationModel.find({job:jobId}).populate("applicant","name email")
    res.status(200).json({success:true,message:"All Applications On This Job",data:jobApplications,length:jobApplications.length})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

