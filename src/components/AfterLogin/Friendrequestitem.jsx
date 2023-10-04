import React, {useContext, useRef, useEffect} from 'react'
import { reactLocalStorage } from 'reactjs-localstorage';
import Appcontext from '../AppContext/Appcontext';

export default function friendrequestitem(props) {
  const ref=useRef(null);
  const context = useContext(Appcontext);

  const updateFriendRequestState=()=>{
    context.setfriendRequests(context.friendRequests.filter((e, i)=>i!==props.index))
  }

  const acceptFriendRequest = async () => {
    try {
      const friends = await fetch(import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/modifyfriends/acceptfriendrequest", {
        method: 'PUT',
        mode: "cors",
        headers: {
          'Content-type':'application/json',
          'authToken': reactLocalStorage.get('authToken')
        },
        body: JSON.stringify({
          'email': props.user.email
        })
      });
      if (!friends.ok) {
        const jsonRes = await friends.json();
        context.setAlert({ status: false, message: jsonRes.message });
      }
      const jsonRes = await friends.json();
      context.setAlert({ status: true, message: jsonRes.message })
      context.setfriendRequests(context.friendRequests.splice(props.index, 1));
      updateFriendRequestState();
      context.setFriendRequestCnt(context.friendRequestCnt-1);
      context.socket.emit('send-notification', props.user.email);
      return jsonRes.friendrequests;
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong, Unable to accept friend request :(" });
    }
  }

  const rejectFriendRequest = async () => {
    try {
      const friends = await fetch(import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/modifyfriends/rejectfriendrequest", {
        method: 'PUT',
        mode: "cors",
        headers: {
          'Content-type':'application/json',
          'authToken': reactLocalStorage.get('authToken')
        },
        body: JSON.stringify({
          'email': props.user.email
        })
      });
      if (!friends.ok) {
        const jsonRes = await friends.json();
        context.setAlert({ status: false, message: jsonRes.message });
      }
      const jsonRes = await friends.json();
      context.setAlert({ status: true, message: jsonRes.message })
      context.setfriendRequests(context.friendRequests.splice(props.index, props.index+1));
      updateFriendRequestState();
      context.setFriendRequestCnt(context.friendRequestCnt-1);
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong, Unable to accept friend request :(" });
    }
  }
  
  return (
    <div ref={ref} className=' w-full bg-slate-100 my-2 flex flex-col break-words p-2 text-sm justify-between'>
        <span>You have a friend Request from {`${props.user.username}`}</span>
        <span className='w-full flex justify-evenly mt-2'>
            <button onClick={acceptFriendRequest} className=' border-2 bg-green-500 text-white rounded-md px-5 py-1'>Accept</button>
            <button onClick={rejectFriendRequest} className=' border-2 bg-red-500 text-white rounded-md px-5 py-1'>Reject</button>
        </span>
    </div>
  )
}
