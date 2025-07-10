import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../Context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';

function EmailVerify() {

  axios.defaults.withCredentials = true;
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { backendUrl,isLoggedin,getUserData,userData} = useContext(AppContent);

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


  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const OtpArray = inputRefs.current.map(e => e.value);
      const otp = OtpArray.join('');
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account',{ otp });
      if(data.success){
        toast.success(data.msg);
        getUserData();
        navigate('/');
      }else{
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error(err.msg);
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData]);

  return (
    <>
        <div className='flex items-center px-10'>
          <img src={assets.logo} className='cursor-pointer' onClick={(e) => navigate('/')} />
        </div>
        <form className='w-[400px] bg-slate-900 p-10 shadow-lg mt-10
        rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto' 
        onSubmit={(e) => handleSubmit(e)}>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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
          py-2 w-full'>Verify Email</button>
        </form>
    </>
  )
}

export default EmailVerify