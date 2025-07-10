import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    email : {
        type : mongoose.Schema.Types.String,
        required : true,
        unique : true
    },
    password : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    verifyOtp : {
        type : mongoose.Schema.Types.String,
        default : ""
    },
    verifyOtpExpireAt : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
    isAccountVerified : {
        type : mongoose.Schema.Types.Boolean,
        default : false
    },
    resetOtp : {
        type : mongoose.Schema.Types.String,
        default : ""
    },
    resetOtpExpireAt : {
        type : mongoose.Schema.Types.Number,
        default : 0
    },
});

const User = mongoose.models.user || mongoose.model('user',userSchema);
export default User;