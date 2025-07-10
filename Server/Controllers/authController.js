import jwt from "jsonwebtoken";
import { hashPassword } from "../Helper/Helper.js";
import { comparePassword } from "../Helper/Helper.js";
import User from "../Schema/UserSchema.js";
import transporter from "../Helper/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../Helper/emailTemplates.js'; 

// Register User
export const register = async (req,res) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.json({success : false,msg : "Missing Details!"});
    }

    try{

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({success : false,msg : "User already exists"});
        }
        const hashed = hashPassword(password);
        const user = new User({name,email,password : hashed});
        const saveUser = await user.save();
        const token = jwt.sign({id : saveUser._id},process.env.JWT_SECRET,{expiresIn : '7d'});
        res.cookie('token',token,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        // email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome To SSM",
            text : `Welcome To SSM Group Of Companies.Your account has been created with email
            id: ${email}`
        }
       try{
        await transporter.sendMail(mailOptions);
       }catch(err){
        return res.json({msg : err.message});
       }
        res.json({success : true});
    }catch(err){
        res.json({success : false,msg : err.message});
    }
};

// Login User
export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.json({success : false,msg : 'Email and Password are Required'});
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({success : false,msg : 'User not found!'});
        }
        const isMatch = comparePassword(password,user.password);
        if(!isMatch){
            return res.json({success : false,msg : "Invalid Password"});
        }

        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7d'});
        res.cookie('token',token,{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
        res.json({success : true});

    } catch (err) {
        return res.json({success : false,msg : err.message});
    }
};

// Logout User
export const logout = async (req,res) => {
    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? 'none' : 'strict'
        });
        res.json({success : true,msg : "Logged Out"});
    } catch (err) {
        return res.json({success : false,msg : err.message})
    }
}

// Send Verify OTP To The User's Email
export const sendVerifyOtp = async (req,res) => {
    try{
        const {userId} = req.body;
        const user = await User.findById(userId);
        if(user.isAccountVerified){
            return res.json({success : false,msg : "Account Already Verified!"});
        }
        const otp = String(Math.floor(Math.random() * 900000) + 100);
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        const saveUser = await user.save(); 

        // email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : saveUser.email,
            subject : "Account Verification OTP",
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",saveUser.email)
        }
       try{
        await transporter.sendMail(mailOptions);
       }catch(err){
        return res.json({msg : err.message});
       }
       res.json({success : true,msg : 'Verification OTP Sent on email'});
    }
    catch(err){
        res.json({sucess : false,msg : err.message});
    }
}

// Verify Email
export const verifyEmail = async (req,res) => {
    const {userId,otp} = req.body;
    if(!userId || !otp){
        return res.json({success : false,msg : 'Missing Details'});
    }
    try{

        const user = await User.findById(userId);
        if(!user){
            res.json({sucess : false,msg : 'User not found!'});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success : false,msg : "Invalid OTP"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success : false,msg : "OTP Expired"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        const saveUser = await user.save();
        res.json({success : true,msg : 'Email Verified Successfully'});
    }catch(err){
        res.json({sucess : false,msg : err.message});
    }
}

// Check If User is Authenticated
export const isAuthenticated = async (req,res) => {
    try{
        res.json({success : true})
    }catch(err){
        res.json({success : false,msg : err.message});
    }
}

// Reset Password 
export const sendResetOtp = async (req,res) => {
    const { email } = req.body;
    if(!email){
        return res.json({success : false,msg : "Email is required"})
    }
   try{
    const user = await User.findOne({email});
    if(!user){
        return res.json({success : false,msg : 'User Not Found'});
    }
    const otp = String(Math.floor(Math.random() * 900000) + 100);
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        const saveUser = await user.save(); 

        // email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : saveUser.email,
            subject : "Password Reset OTP",
            html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",saveUser.email)
        }
       try{
        await transporter.sendMail(mailOptions);
       }catch(err){
        return res.json({msg : err.message});
       }
    res.json({success : true,msg : 'OTP Sent to your email'});
   }catch(err){
    res.json({success : false,msg : err.message});
   }
}

// Reset User Password
export const resetPassword = async (req,res) => {
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success : false,msg : 'Email, OTP and new Password are required'});
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.json({sucess : false,msg : 'User not found!'});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success : false,msg : 'Invalid OTP'});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success : false,msg : "OTP Expired"});
        }
        const hashed = hashPassword(newPassword);
        user.password = hashed;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        const saveUser = await user.save();
        res.json({success : true,msg : 'Password has been reset successfully'});
    }catch(err){
        res.json({success : false,msg : err.message});
    }
}