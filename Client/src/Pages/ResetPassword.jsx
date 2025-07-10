import React, { useState,useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function ResetPassword() {

  const { backendUrl } = useContext(AppContent);

  const [email,setEmail] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [isEmailSent,setIsEmailSent] = useState(false);
  const [otp,setOtp] = useState("");
  const [isOtpSubmited,setIsOtpSubmited] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  
   const handleInput = (e,index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e,index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  async function handleEmail(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp',{ email });
      data.success ? toast.success(data.msg) : toast.error(data.msg);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.msg);
    }
  }

  const handleOtp = (e) => {
    e.preventDefault();
    const OtpArray = inputRefs.current.map(e => e.value);
    setOtp(OtpArray.join(''));
    setIsOtpSubmited(true);
  }

  async function handleNewPassword(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password',{
        email,
        otp,
        newPassword
      });
      data.success ? toast.success(data.msg) : toast.error(data.msg);
      data.success && navigate('/');
    } catch (error) {
      toast.error(error.msg);
    }
  }

  return (
   <>
       <div className='flex items-center px-10'>
        <img src={assets.logo} className='cursor-pointer' onClick={(e) => navigate('/')} />
      </div>
      {!isEmailSent && 
      <form className='w-[400px] bg-slate-900 p-10 shadow-lg mt-10
        rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto' 
        onSubmit={(e) => handleEmail(e)} >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-white'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.mail_icon} className='w-3 h-3' />
            <input type="email" required placeholder='Email id' className='bg-transparent outline-none'
            onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
          py-2 w-full'>Submit</button>
      </form>
}
      {/* Rest OTP Form */}
      {!isOtpSubmited && isEmailSent && 
      <form className='w-[400px] bg-slate-900 p-10 shadow-lg mt-10
        rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto'
        onSubmit={(e) => handleOtp(e)} >
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
            <p className='text-center mb-6 text-white'>Enter the 6 digit code sent to your email id.</p>
            <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_,index) => (
                <input type='text' required key={index} maxLength='1'
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md m-1'
                ref={(e) => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e,index)}
                onKeyDown={(e) => handleKeyDown(e,index)}/>
              ))}
            </div>
            <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
          py-2 w-full'>Submit</button>
        </form>
}
      {/* New Password Form */}
      {isOtpSubmited && isEmailSent && 
      <form className='w-[400px] bg-slate-900 p-10 shadow-lg mt-10
        rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto' 
        onSubmit={(e) => handleNewPassword(e)}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-white'>Enter the new password below</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.lock_icon} className='w-3 h-3' />
            <input type="password" required placeholder='Password' className='bg-transparent outline-none'
            onChange={(e) => setNewPassword(e.target.value)} value={newPassword}/>
          </div>
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
          py-2 w-full'>Submit</button>
      </form>
}
   </>
  )
}

export default ResetPassword