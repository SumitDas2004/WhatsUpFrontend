import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loginform from './Loginform'
import Signupform from './Signupform';


export default function LoginInterface() {
  
  return (
    <BrowserRouter>
      <div className=' h-48 w-full bg-blue-500 absolute'></div>
      <section className=' bg-[#0000001c] h-[100vh] w-full z-0 flex items-end justify-center'>
        <section className=' h-[85%] w-[55%] bg-white rounded-t-lg flex items-center justify-start flex-col z-10'>
          <span className=' text-5xl mt-20 mb-5 font-semibold text-blue-600 font-[Borel]'>WhatsUp!!</span>
          <Routes>
            <Route path='' element={<Loginform />} />
            <Route path='signup' element={<Signupform />} />
          </Routes>
        </section>
      </section>
    </BrowserRouter>
  )
}
