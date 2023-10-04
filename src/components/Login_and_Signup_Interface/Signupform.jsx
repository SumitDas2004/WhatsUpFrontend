import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Appcontext from '../AppContext/Appcontext';
import {reactLocalStorage} from 'reactjs-localstorage';


export default function Signupform() {
  const context = useContext(Appcontext);
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmPassword, setConfirmPassword] = new useState('');
  const [passwordVisible, setpasswordVisible] = useState(false)
  const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(false)

  const googleSignup = async (data) => {
    context.setLoadingScreen(true);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+'/auth/googlesignup',
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username: data.email.split('@')[0],
            email: data.email,
            picture: data.picture
          })
        });
      if (!response.ok) {
        const jsonRes = await response.json();
        setTimeout(()=>context.setLoadingScreen(false), 200);
        context.setAlert({status:false, message:jsonRes.message});
        return;
      }
      const jsonRes = await response.json()
      context.setNotificationCnt(jsonRes.notification);
      context.setFriendRequestCnt(jsonRes.friendRequest);
      context.loginSetter(jsonRes);
      reactLocalStorage.set('authToken', jsonRes.token);
      setTimeout(()=>context.setLoadingScreen(false), 200);
    } catch (e) {
      context.setAlert({status:false, message:"Something went wrong :("});
    }
  }

  
  const normalSignUp= async(data)=>{
    context.setLoadingScreen(true);
    try{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+'/auth/signup',
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username: data.email.split('@')[0],
            email: data.email,
            password: data.password
          })
        });
      if (!response.ok) {
        const jsonRes = await response.json();
        setTimeout(()=>context.setLoadingScreen(false), 200);
        context.setAlert({status:false, message:jsonRes.message});
        return;
      }
      const jsonRes = await response.json()
      context.setNotificationCnt(jsonRes.notification);
      context.setFriendRequestCnt(jsonRes.friendRequest);
      context.loginSetter(jsonRes);
      reactLocalStorage.set('authToken', jsonRes.token);
      setTimeout(()=>context.setLoadingScreen(false), 200);
    } catch (e) {
      context.setAlert({status:false, message:"Something went wrong :("});
    }
  }

  return (
    <>
      <div className=' flex flex-col text-lg items-center'>
        {/* <input type="text" name="" id="displayName" placeholder='Username' className=' my-4 w-96 border-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors' /> */}
        <input onChange={(e)=>setemail(e.target.value)} type="text" name="" id="email" placeholder='Email' className=' my-4 w-96 border-b-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors' />

        <span className='relative'>
        <input onChange={(e)=>setpassword(e.target.value)} type={passwordVisible?'text':'password'} name="" placeholder='Password' className=' my-4 w-96 border-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors pr-8' />
        <i onClick={()=>passwordVisible?setpasswordVisible(false):setpasswordVisible(true)} className={`cursor-pointer absolute bottom-7 right-2 fa-regular text-slate-500 fa-eye${passwordVisible?'-slash':''}`}></i>
        </span>

        <span className='relative'>
        <input onChange={(e)=>setConfirmPassword(e.target.value)} type={confirmPasswordVisible?'text':'password'} name="" placeholder='Confirm Password' className=' my-4 w-96 border-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors pr-8' />
        <i onClick={()=>confirmPasswordVisible?setconfirmPasswordVisible(false):setconfirmPasswordVisible(true)} className={`absolute bottom-7 cursor-pointer right-2 fa-regular text-slate-500 fa-eye${confirmPasswordVisible?'-slash':''}`}></i>
        </span>

        <input onClick={()=>{
          if(confirmPassword!==password){
            context.setAlert({status:false, message:"Password and confirm password doesn't match"});
          }else
          normalSignUp({email:email.toLowerCase(), password:password})
        }} type="button" value="Sign Up" className=' my-6 w-96 focus:outline-0 p-1 px-2 transition-colors bg-blue-500 text-white cursor-pointer hover:bg-blue-600 active:bg-blue-400' />
       
        <span>Existing User? <Link to='/'><span className=' underline text-blue-600'>Log In</span></Link></span>
      </div>
      <span className=' my-2'>or</span>
      <span className=' my-4'>
        <GoogleLogin
          onSuccess={async credentialResponse => {
            const googleData = await jwt_decode(credentialResponse.credential);
            const res = googleSignup({ email: googleData.email.toLowerCase(), picture: googleData.picture });
          }}
          onError={() => {
            console.log('Login Failed');
          }} />
      </span>
    </>
  )
}
