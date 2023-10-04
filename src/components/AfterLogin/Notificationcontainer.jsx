import React, {useEffect, useState, useContext} from 'react'
import Appcontext from '../AppContext/Appcontext'
import { reactLocalStorage } from 'reactjs-localstorage';
import Notificationitem from './Notificationitem';


export default function Notificationcontainer() {
  const context = useContext(Appcontext)
    const [height, setHeight] = useState(10)
    useEffect(() => {
      setHeight(80);
    },[])
    
  return (
    <span className={`transition-all absolute z-30 h-${height} w-60 bg-white shadow-lg flex flex-col items-center overflow-y-scroll`}>
      {context.notifications.length==0?<span className='h-full w-full flex items-center justify-center'>You have no notification.</span>:
        context.notifications.map((e, i)=>{
          return <Notificationitem key={i} notification={e} index={i}/>
        })
      }
    </span>
  )
}
