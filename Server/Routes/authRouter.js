import express from 'express';
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  verifyResetOtp
} from '../Controllers/authController.js';
import userAuth from '../Middleware/userAuth.js';

const authRouter = express.Router();

// Routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-reset-otp', verifyResetOtp); // ✅ NEW
authRouter.post('/reset-password', resetPassword);

export default authRouter;
