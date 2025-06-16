// const User = require("../models/userModel");
// let userList = async (req, res) => {
//     try {
//         const users = await User.find().select('-password');
//         console.log("Fetched Users:", users);
//         res.json({success:true, users, length: users.length });
//     } catch (err) {
//         console.error("Error on GET path:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// }

const userModel = require("../models/userModel");

// let createUser = async (req, res) => {
//     try {
//         const { name, phone, email, message } = req.body;
//         if (!name || !phone || !email || !message) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         const newUser = new User({ name, email, phone, message });
//         const result = await newUser.save();

//         res.status(201).json({
//             message: "User created successfully!",
//             user: result
//         });
//     } catch (err) {
//         console.error("Error at adding new user:", err);
//         res.status(500).json({ error: "Failed to create user" });
//     }
// }

// let deleteUser = async (req, res) => {
//     try {
//         let { id } = req.params;

//         let deletedUser = await User.deleteOne({ _id: id });
//         res.status(200).json({ message: "user deleted ", deletedUser })
//     }
//     catch (err) {
//         res.status(400).json({ message: "somthing went wrong", err })
//     }
// }

// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedData = req.body;

//         if (!id) {
//             return res.status(400).json({ message: "User ID is required" });
//         }

//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const updatedUser = await User.findByIdAndUpdate(id, updatedData);

//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

exports.getAllUsers = async (req, res, next) => {
    try {
        const { user } = req;
        // console.log(req.user)
        if (!user) return res.status(400).json({ success: false, message: "user not authenticate or expired token" })
        const result = await userModel.find().select('-password')
        res.status(200).json({ success: true, message: "all user list", user: result, length: result.length })
    }
    catch (error) {
        console.log(error)
        next(new Error("error on retrive userlist"))
    }

}
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "user not authenticate or expired token" })
        }
        if (user?.id.toString() !== id) {

            return res.status(403)
                .json({ success: false, message: "You are not authorized to update this user" });
        }
        const result = await userModel.findById(id).select('-password')
        res.status(200).json({ success: true, user: result })
    }
    catch (error) {
        console.log(error)
        next(error)
    }

}

exports.updateUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = req.user;
        if (!user) return res.status(400).json({ success: false, message: "user not authenticate or expired token" })

        if (user.id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this user"
            });
        }
        const allowedFields = {};
        if (req.body.name) allowedFields.name = req.body.name
        if (req.body.email) allowedFields.email = req.body.email
        if (Object.keys(allowedFields).length === 0) return res({ success: false, message: "Only Name and Email is Allowed to Update" })
        const updatedUser = await userModel.findByIdAndUpdate(id, allowedFields, {
            new: true,
            runValidators: true
        }).select("-password");
        console.log(updatedUser)
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    }
    catch (error) {
        console.log(error)
        next(error)
    }

}
exports.deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
       const user =req.user; 
       
        if(user.id.toString()!==id && user.role!=="admin"){
            res.status(403).json({
                success:false,
                message:"You are not authorized to delete this user"
            })
        }
        
        const deletedUser =await userModel.findByIdAndDelete(id)
         if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.log(error)
        next(error)
    }

}
exports.getSavedJobs = async (req, res, next) => {
    try {
      
    } catch (error) {
        console.log(error)
    }

}
exports.saveJob = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error)
    }

}
