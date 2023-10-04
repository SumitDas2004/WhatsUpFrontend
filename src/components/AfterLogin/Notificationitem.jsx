import React, {useContext} from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import Appcontext from '../AppContext/Appcontext';

export default function Notificationitem(props) {
  const context = useContext(Appcontext)
  const updateNotificationState =()=>{
    context.setNotifications(context.notifications.filter((e, i)=>i!==props.index))
  }
  const clearnotification = async () => {
    try {
      const notifications = await fetch(import.meta.env.VITE_BACKEND_URL+"/modifyfriends/clearnotification", {
        method: 'PUT',
        mode: "cors",
        headers: {
          'authToken': reactLocalStorage.get('authToken')
        },
        body:JSON.stringify({
          index: props.index
        })
      });
      if (!notifications.ok) {
        const jsonRes = await friends.json();
        context.setAlert({ status: false, message: jsonRes.message });
      }
      const jsonRes = await notifications.json();
      context.setNotificationCnt(context.notificationCnt-1);
      context.setAlert(jsonRes.message);
      updateNotificationState();
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong, unable to fetch notifications :(" });
    }
  }
  return (
    <span className=' text-sm w-full flex bg-gray-50 my-1 p-2  justify-between'>
        <span>{props.notification}</span>
        <span onClick={clearnotification}><i className="fa-solid fa-xmark cursor-pointer"></i></span>
    </span>
  )
}
