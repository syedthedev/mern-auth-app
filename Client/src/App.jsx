import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import EmailVerify from './Pages/EmailVerify.jsx'

function App() {
  const routes = createBrowserRouter([
    {
      path : '/',
      element : <Home />
    },
    {
      path : '/login',
      element : <Login />
    },
    {
      path : '/register',
      element : <Register />
    },
    {
      path : '/verify-email',
      element : <EmailVerify />
    },
    {
      path : '/reset-password',
      element : <ResetPassword />
    }
  ])
  return (
    <>
      <RouterProvider router={routes}>
        
      </RouterProvider>
    </>
  )
}

export default App