const { default: mongoose } = require("mongoose")
const JobModel = require("../models/JobModel")

exports.getAllJobs = async (req, res, next) => {
    try {
        console.time("getAllJobs")
        const { page = 1, limit = 10 } = req.query
        const skip = (page - 1) * limit
        console.time("jobsPromise")
        const jobsPromise = await JobModel.find().skip(parseInt(skip)).limit(parseInt(limit)).sort({ createdAt: -1 }).populate("company", "name")
        console.timeEnd("jobsPromise")
        console.time("totalPromise")
        // Using Promise.all to run both queries concurrently
        const totalPromise = await JobModel.countDocuments()
        console.timeEnd("totalPromise")
        const [jobs, total] = await Promise.all([jobsPromise, totalPromise])
        res.json({ success: true, message: "All Jobs List", jobs, page: parseInt(page), totalJobs: total, totalPages: Math.ceil(total / limit) })
        console.timeEnd("getAllJobs")
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid ID " })
        }

        const job = await JobModel.findById(id).populate("company")
        if (!job) return res.status(404).json({ success: false, message: "Job Not Found" })
        res.json({ success: true, message: "Job Details", job })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.searchJobs = async (req, res, next) => {
    try {

        const { q } = req.query
        if (!q && !q.trim()) return res.json({ success: false, message: "Search Query is Required" })
        const trimQuery = q.trim()
        const searchResult = await JobModel.find({
            $or: [
                { title: { $regex: trimQuery, $options: "i" } },
                { description: { $regex: trimQuery, $options: "i" } },
                { skills: { $regex: trimQuery, $options: "i" } },
            ]
        }).populate("company")
        console.log(searchResult)
        if (searchResult.length === 0) return res.status(404).json({ success: false, message: "Result Not Found...", searchResult })

        res.json({ success: true, message: "Find Query Result ", searchResult, length: searchResult.length })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

