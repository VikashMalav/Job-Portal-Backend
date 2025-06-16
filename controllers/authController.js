
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

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

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

        if (!isMatch) {
            res.status(401);
            return next(new Error("Invalid Credentials"))
        }
        let token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production' })
        res.status(200).json({
            success: true,
            message: "login successfully!",
            user: {id:user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        next(err)
    }
}

const logoutUser = async (req, res, next) => {
    try {
       const {user} =req?.user
       res.clearCookie('token',{httpOnly:true})
       res.status(200).json({success:true,message:"user logout successfull !"})
    } catch (error) {
        console.log(error)
        next(new Error("Error In Logout"))
    }
}

const getUserProfile = async (req, res, next) => {
    try {
       if(!req.user) return res.status(401).json({success:false,message:"UnAuthorized: Please Login First"})
         res.json({success:true,message:"User Profile",user:req.user})
    } catch (error) {
        console.log(error)
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
    }
}

module.exports = { signUp, login, authCheck, logout, getUserProfile, updateUserProfile, loginUser, logoutUser, registerUser };


