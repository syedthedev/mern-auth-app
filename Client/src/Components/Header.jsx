import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../Context/AppContext';

function Header() {

  const { userData } = useContext(AppContent);
  
  return (
    <>
        <div className='flex flex-col items-center justify-center text-center mt-20 ml-[250px] px-4 text-gray-800'>
            <img src={assets.header_img} alt="Image" className='w-36 h-36 rounded-full mb-6'/>
            <h1 className='flex items-center gap-3 sm:text-3xl text-xl font-medium mb-2'>Hey{" "} 
              {userData ? userData.name : "Developer"}!<img src={assets.hand_wave} className='w-9 aspect-square' /></h1>
            <h2 className='text-xl sm:text-5xl font-semibold mb-4'>Welcome To Our App</h2>
            <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have you up and running in no time!</p>
            <button className='border-gray-500 border rounded-full px-8 py-2
            hover:bg-gray-200 transition-all'>Get Started</button>
        </div>
    </>
  )
}

export default Header