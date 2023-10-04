import React from 'react'
import { PacmanLoader } from 'react-spinners'

export default function Loading() {
  return (
    // <></>
    <div className='absolute bg-white h-full w-full z-50 top-0 flex flex-col justify-center items-center'>
        <PacmanLoader color='#2563eb' size={50}/>
        <span className='font-[Borel] text-blue-600 text-bold text-7xl mt-12 select-none'>WhatsUp!!</span>
        <span className='text-xs relative -bottom-28 w-[70%] flex justify-center text-gray-700'>*This webapp is not responsive, hence it is recommended to use large screen devices. eg, laptop</span>
    </div>
  )
}
