
const User = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");



const signUp = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;


        if (!name || !phone || !email || !password) {
            const err = new Error("missing required fields ")
            return next(err)
        }


        let isUser = await User.findOne({ email });
        if (isUser) {
            const err = new Error("Email already exists")
            res.status(409)
            return next(err)

        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });


        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(201).json({
            success: true,
            msg: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
            },
        });
    } catch (err) {
        next(err)
    }
};


const login = async (req, res, next) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return next(new Error("missing required fields"))

        }
        let user = await User.findOne({ email })
        if (!user) {
            res.status(404)
            return next(new Error("User Not Registered Please SignUp First"))
        }
        let isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(401);
            return next(new Error("Invalid Credentials"))
        }
        let token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production' })
        res.status(200).json({
            success: true,
            message: "login successfully!",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        })
    } catch (err) {
        next(err)
    }

}

const authCheck = async (req, res, next) => {
    try {
        const { user } = req
        res.status(200).json({ success: true, message: "User is authenticated", user })
    } catch (error) {
        console.log(error)
        res.status(401)
        next(new Error("unauthorized, login first ..."))
    }
}

const logout = async (req, res, next) => {
    try {
        const { user } = req
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logged out" });

    } catch (error) {
        console.log(error)
        res.status(500)
        next(new Error("Unable To Logout"))
    }
}


const registerUser = async (req, res, next) => {
    try {
        let { name, email, password ,role="user" } = req.body;


        if (!name || !email || !password) {
            const err = new Error("missing required fields ")
            return next(err)
        }


        let isUser = await User.findOne({ email });
        if (isUser) {
            const err = new Error("Email already exists")
            res.status(409)
            return next(err)

        }


        const newUser = await User.create({
            name,
            email,
            password,
            role
        });


        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 ,secure:true,sameSite:"None"})

        res.status(201).json({
            success: true,
            msg: "User registered successfully",
            user: {
                id:newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err)
    }
}

const loginUser = async (req, res, next) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return next(new Error("missing required fields"))

        }
        let user = await User.findOne({ email })
        if (!user) {
            res.status(404)
            return next(new Error("User Not Registered Please SignUp First"))
        }
        
        let isMatch = await bcrypt.compare(password, user.password)
        console.log("Match : ", isMatch)

        if (!isMatch) {
            res.status(401);
            return next(new Error("Invalid Credentials"))
        }
        let token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure:true,sameSite:"None" })
        res.status(200).json({
            success: true,
            message: "login successfully!",
            user: {_id:user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                appliedJobs:user.appliedJobs
            }
        })
    } catch (err) {
        next(err)
    }
}

const logoutUser = async (req, res, next) => {
    try {
       const {user} =req?.user
       res.clearCookie('token',{httpOnly:true,secure:true,sameSite:"None"})
       res.status(200).json({success:true,message:"user logout successfull !"})
    } catch (error) {
        console.log(error)
        next(new Error("Error In Logout"))
    }
}

const getUserProfile = async (req, res, next) => {
    try {
       if(!req.user) return res.status(401).json({success:false,message:"UnAuthorized: Please Login First"})
        allUserDetails =await userModel.findOne({_id:req.user.id},"-password")
    console.log(
        `all user details : ${allUserDetails}`
    )
         res.json({success:true,message:"User Profile",user:allUserDetails})
    } catch (error) {
        console.log(error)
        next(new Error("Error to get profile"))
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
         const { id, name, email, password } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

       
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; 
        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error)
         next(new Error("Error to update profile"))
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new passwords are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: "New password must be different from current password" });
        }
        // Check if the current password matches the stored password
        // Using bcrypt to compare the current password with the hashed password
        const userStored = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, userStored.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        userStored.password = newPassword
        await userStored.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        next(new Error("Error changing password"));
    }
}

module.exports = { signUp, login, authCheck, logout, getUserProfile, updateUserProfile, loginUser, logoutUser, registerUser, changePassword };


