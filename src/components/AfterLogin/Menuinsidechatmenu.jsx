import React, { useState, useEffect, useContext } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import Appcontext from '../AppContext/Appcontext';


export default function Menuinsidechatmenu() {
  const context = useContext(Appcontext)

  const [menuWidth, setmenuWidth] = useState('10')
  useEffect(() => {
    setmenuWidth('48');
  })
  
  return (
    <span className={`w-${menuWidth} transition-all overflow-hidden bg-white flex flex-col py-3 shadow-lg rounded-md text-sm text-slate-700 z-20 absolute top-10 right-4`}>
        <span className=' hover:bg-gray-100 py-2 cursor-pointer pl-6 ' onClick={()=>{
          context.socket.emit('remove-user', context.loggedIn.email);
          context.socket.disconnect();
          reactLocalStorage.remove('authToken');
          context.loginSetter(null);
        }}>Log out</span>
    </span>
  )
}
