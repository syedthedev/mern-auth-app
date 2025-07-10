import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './Routes/authRouter.js';
import userRoute from './Routes/userRoute.js';
import userAuth from './Middleware/userAuth.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

// App 
const app = express();

// Database Connection
mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
        .then(() => console.log('Connected To Database'))
        .catch(() => console.log('Not Connected'));

// Origin
const allowedOrigins = ['http://localhost:5173'];

// Body-Parser 
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// Cookie-Parse
app.use(cookieParser());

// Cors
app.use(cors({origin : allowedOrigins,credentials : true}));

// Routes
app.use('/api/auth',authRouter);
app.use('/api/user',userAuth,userRoute);

app.listen(PORT,() => console.log(`Server is running in http://localhost:${PORT}`));
