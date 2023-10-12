import React from 'react'
import {SyncLoader} from "react-spinners"

export default function ThreeDotLoader() {
  return (
    <span className=' h-16 w-14 flex items-center justify-center cursor-not-allowed mr-4 ml-2'><SyncLoader color="#2563eb" size={7}/></span>
  )
}
