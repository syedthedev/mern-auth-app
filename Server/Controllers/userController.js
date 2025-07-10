import User from "../Schema/UserSchema.js"

export const getUserData = async (req,res) => {
    try{
        const {userId} = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.json({success : false,msg : 'User Not Found'});
        }
        res.json({success : true,
            userData : {
                name : user.name,
                isAccountVerified : user.isAccountVerified
            }
        })
    }catch(err){
        res.json({success : false,msg : err.message});
    }
}