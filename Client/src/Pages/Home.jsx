import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Header from '../Components/Header.jsx'

function Home() {
  return (
    <>
       <div className="container flex flex-col justify-center min-h-screen
       bg-[url('/bg_img.png')] bg-center bg-cover">
          <Navbar />
          <Header />
       </div>
    </>
  )
}

export default Home