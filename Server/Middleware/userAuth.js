import jwt from 'jsonwebtoken'

const userAuth = async (req,res,next) => {
    const { token } = req.cookies;
    if(!token){
        return res.json({success : false,msg : "Not Authorized.Login Again"});
    }
    try{

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            res.json({success : false,msg : "Not Authorized.Login Again"});
        }
        next();

    }catch(err){
        res.json({sucess : false,msg : err.message});
    }
}

export default userAuth