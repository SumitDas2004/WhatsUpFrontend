import React from 'react'
import Logo from '../Logo.png'

export default function Emptychatsection() {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <img loading="lazy" loading="lazy"  src={Logo} alt="" srcSet="" className=' h-72 w-72'/>
      <span className='font-[borel] mt-4 text-5xl text-blue-600 font-semibold'>WhatsUp!!</span>
    </div>
  )
}
