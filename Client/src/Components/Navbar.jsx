import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContent } from '../Context/AppContext';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

function Navbar() { 

  const { userData,backendUrl,setUserData,setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (err) {
      toast.error(err.msg);
    }
  }

  async function sendVerificationOtp() {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if(data.success){
        navigate('/verify-email');
        toast.success(data.msg);
      }else{
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.msg);
    }
  }

  return (
    <>
        <div className="text-xl flex justify-between w-full items-center p-4 absolute
        sm:p-6 sm:px-24 top-0">
            <h1 className='text-[1.5rem]'><img src={assets.logo} /></h1>
            {userData ? 
              <div className='w-8 h-8 flex justify-center items-center
               rounded-full bg-black text-white relative group'>
                {userData.name[0].toUpperCase()}
                <div className='absolute hidden group-hover:block top-1 right-0
                z-10 text-black font-semibold rounded pt-10'>
                  <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                    {!userData.isAccountVerified && 
                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
                    onClick={sendVerificationOtp}>Verify email</li>}
                    <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                  </ul>
                </div>
              </div> 
              : 
              <button className=' flex gap-2 items-center justify-center border border-gray-600 rounded-full px-8 py-1.5
              hover:opacity-85 transition-all'
            onClick={() => navigate('/login') }>Login <img src={assets.arrow_icon}/></button>
            }
        </div>
    </>
  )
}

export default Navbar