const { getAllUsers } = require("./userController")

exports.getAllUsers = async (req, res, next) => {
    try {
        console.log("getAllUsers")
    } catch (error) {
        console.log(error)
    }
}


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


exports.getDashboardStats = async (req, res, next) => {
    try {
        console.log("getDashboardStats")
    } catch (error) {
        console.log(error)
    }
}

