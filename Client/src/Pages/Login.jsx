import React, { useState,useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContent } from '../Context/AppContext.jsx'
import { ToastContainer,toast } from 'react-toastify'

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const { backendUrl,setIsLoggedin,getUserData } = useContext(AppContent);
  
    async function handleSubmit(e){
      try {
        e.preventDefault();
        axios.defaults.withCredentials = true;
  
        const { data } = await axios.post(backendUrl + "/api/auth/login",{
          email,password
        });
        if(data.success){
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        }else{
          toast.error(data.msg);
        }
      } catch (err) {
        toast.error(data.msg);
      }
    }

  return (
    <>
        <div className='flex items-center px-10'>
            <img src={assets.logo} className='cursor-pointer' onClick={(e) => navigate('/')} />
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className='w-[350px] bg-slate-900 p-10 shadow-lg mt-10
        rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto'>
          <h1 className='text-white text-xl font-medium'>Login Form</h1>
          <h2 className='text-white font-semibold mt-3 mb-5'>Login to your account</h2>
          <div className='mb-4 flex items-center rounded-full gap-3 w-full bg-[#333A5C] px-5 py-2.5'>
            <img src={assets.mail_icon} alt="icon" />
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
            className='bg-transparent outline-none text-white' placeholder='Enter email' />
          </div>
          <div className='mb-4 flex items-center rounded-full gap-3 w-full bg-[#333A5C] px-5 py-2.5'>
            <img src={assets.lock_icon} alt="icon" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className='bg-transparent outline-none text-white' placeholder='Enter password' />
          </div>
          <p className='text-indigo-500 mt-1 mb-4 cursor-pointer text-left relative right-[60px]'
          onClick={(e) => navigate('/reset-password')}>Forgot Password?</p>
          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
          py-2 w-full'>Login</button>
          <p className='text-gray-400 text-center mt-2'>Don't have an account? 
              <span className='cursor-pointer underline text-blue-400'
              onClick={(e) => navigate('/register')}>&nbsp;Sign up</span>
          </p>
        </form>
    </>
  )
}

export default Login