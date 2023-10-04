import React,{useState, useEffect, useContext} from 'react'
import Friendrequestitem from './Friendrequestitem'
import Appcontext from '../AppContext/Appcontext'
import { reactLocalStorage } from 'reactjs-localstorage';

function Friendrequestcontainer() {
    const context = useContext(Appcontext)


    const [height, setheight] = useState('10')
    const [display, setdisplay] = useState('hidden')
    useEffect(() => {
      setheight('96');
      setdisplay('visible');
    }, [])
    
  return (
    <div className={`h-${height} w-60 overflow-y-scroll bg-white shadow-lg absolute z-30 transition-all`}>
      {
      context.friendRequests.length==0?<span className='h-full w-full flex items-center justify-center'>You have no friend request.</span>:
      
        context.friendRequests.map((item, i)=>{
          return <Friendrequestitem key={i} user={item} index={i}/>
        })
      }
    </div>
  )
}

export default Friendrequestcontainer;
