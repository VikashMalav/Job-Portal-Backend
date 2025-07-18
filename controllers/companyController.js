const { Mongoose, default: mongoose } = require("mongoose")
const CompanyModel = require("../models/CompanyModel")

exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyModel.find()
    res.json({ success: true, message: "all companies data", companies, length: companies.length })
  } catch (error) {
    console.log(error)
  }
}


exports.getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await CompanyModel.findById(id)
    res.status(201).json({
      success: true,
      message: "Company details ",
      company,
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
}


exports.createCompany = async (req, res, next) => {
  try {
    const { name, industry, location, website, about } = req.body;

    if (!name || !industry || !location || !website || !about) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }


    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }


    if (!['admin', 'employer'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only employers or admins can create companies"
      });
    }


    const company = new CompanyModel({
      name,
      industry,
      location,
      website,
      about,
      createdBy: user.id
    });

    const savedCompany = await company.save();
    if (!savedCompany) {
      return res.status(500).json({
        success: false,
        message: "Failed to create company"
      });
    }
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: savedCompany,
      length: savedCompany.length
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};



exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params; // assuming you're passing company ID in the URL
    const updateFields = req.body;
    const user = req.user;

    // 1. Check Authentication
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

 if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }
  
    const existingCompany = await CompanyModel.findById(id);
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const updatedCompany = await CompanyModel.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });


    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    next(error); 
  }
};



exports.deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user
    if (!user) return res.status(400).json({ success: false, message: "Unauthorised:Employer Please Login First" })
    const deletedCompany = await CompanyModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User Deleted Successfull !", })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

