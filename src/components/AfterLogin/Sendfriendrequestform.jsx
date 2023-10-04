import React, { useEffect, useState, useContext } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import Appcontext from '../AppContext/Appcontext';


export default function Sendfriendrequestform() {
  const context = useContext(Appcontext);

  const sendFriendRequest = async (user) => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/modifyfriends/sendfriendrequest', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'authToken': reactLocalStorage.get('authToken'),
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'email': user
        })
      });
      if (!response.ok) {
        const jsonRes = await response.json();
        context.setAlert({ status: false, message: jsonRes.message });
        return;
      }
      const jsonRes = await response.json();
      context.setAlert({ status: true, message: jsonRes.message })
      context.socket.emit('send-request', user)
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong, Unable to fetch friends :(" });
    }
  }

  const [textFieldValue, setTextFieldValue] = useState()
  const [height, setHeight] = useState(10)
  const [display, setdisplay] = useState('hidden')
  useEffect(() => {
    setHeight(48);
    setTimeout(() => setdisplay('visible'), 100)
  }, [])

  return (
    <div className={` h-${height} overflow-hidden w-80 bg-white absolute z-30 rounded-sm shadow-lg flex justify-center items-center flex-col transition-all`}>
      <input onChange={(e) => setTextFieldValue(e.target.value)} onKeyUp={(e)=>{if(e.code==='Enter')sendFriendRequest(textFieldValue.toLowerCase())}} type="text" name="" id="" className={` w-3/4 outline-none border-b-2 border-slate-400 focus:border-blue-500 font-xl py-2 px-4 placeholder:flex placeholder:items-center placeholder:justify-center ${display}`} placeholder="Enter friend's Email" />
      <input type='button' onClick={(e) => sendFriendRequest(textFieldValue.toLowerCase())} className={` hover:bg-blue-700 active:bg-blue-300 rounded-sm cursor-pointer bg-blue-500 text-white border-none outline-none px-4 py-2 mt-4 ${display}`} value='Send request' />
    </div>
  )
}

