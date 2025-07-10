import React,{useContext, useState} from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContent } from '../Context/AppContext.jsx'
import { ToastContainer,toast } from 'react-toastify'

function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");  
  const navigate = useNavigate();

  const { backendUrl,setIsLoggedin,getUserData } = useContext(AppContent);

  async function handleSubmit(e){
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/api/auth/register",{
        name,email,password
      });
      if(data.success){
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      }else{
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error(err.msg);
    }
  }

  return (
    <>
        <div className='flex items-center px-10'>
            <img src={assets.logo} className='cursor-pointer' onClick={(e) => navigate('/')} />
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className='w-[350px] bg-slate-900 p-10 shadow-lg mt-10
            rounded-lg border-gray-200 flex flex-col items-center justify-center m-auto'>
            <h1 className='text-white text-xl font-medium'>Registration Form</h1>
            <h2 className='text-white font-semibold mt-3 mb-5'>Create your account</h2>
            <div className='mb-4 flex items-center rounded-full gap-3 w-full bg-[#333A5C] px-5 py-2.5'>
                <img src={assets.person_icon} alt="icon" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className='bg-transparent outline-none text-white' placeholder='Enter name' />
            </div>
            <div className='mb-4 flex items-center rounded-full gap-3 w-full bg-[#333A5C] px-5 py-2.5'>
                <img src={assets.mail_icon} alt="icon" />
                <input type="text"  value={email} onChange={(e) => setEmail(e.target.value)}
                className='bg-transparent outline-none text-white' placeholder='Enter email' />
            </div>
            <div className='mb-4 flex items-center rounded-full gap-3 w-full bg-[#333A5C] px-5 py-2.5'>
                <img src={assets.lock_icon} alt="icon" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className='bg-transparent outline-none text-white' placeholder='Enter password' />
            </div>
            <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
              py-2 w-full'>Sign Up</button>
            <p className='text-gray-400 text-center mt-2'>Already have an account? 
                  <span className='cursor-pointer underline text-blue-400' onClick={(e) => navigate('/login')}>Login here</span>
            </p>
        </form>    
    </>
  )
}

export default Register