import express from 'express'
import userAuth from '../Middleware/userAuth.js'
import { getUserData } from '../Controllers/userController.js'

const userRoute = express.Router();

userRoute.get('/data',userAuth,getUserData);

export default userRoute;
