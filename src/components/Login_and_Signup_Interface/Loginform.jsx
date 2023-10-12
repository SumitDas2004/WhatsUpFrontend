import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Appcontext from "../AppContext/Appcontext";
import { reactLocalStorage } from "reactjs-localstorage";

export default function Loginform() {
  const context = useContext(Appcontext);
  const [password, setpassword] = useState();
  const [email, setemail] = useState();
  const [passwordVisible, setpasswordVisible] = useState(false);

  const googleLogin = async (data) => {
    context.setLoadingScreen(true);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/auth/googlelogin", {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: data.email.split("@")[0],
          email: data.email,
          picture: data.picture,
        }),
      });
      if (!response.ok) {
        const jsonRes = await response.json();
        setTimeout(()=>context.setLoadingScreen(false), 200);
        context.setAlert({ status: false, message: jsonRes.message });
        return;
      }
      const jsonRes = await response.json();
      context.loginSetter(jsonRes);
      reactLocalStorage.set("authToken", jsonRes.token);
      context.setNotificationCnt(jsonRes.notification);
      context.setFriendRequestCnt(jsonRes.friendRequest);
      setTimeout(()=>context.setLoadingScreen(false), 200);
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong :((" });
    }
  };

  const normalLogin = async (data) => {
    context.setLoadingScreen(true);
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/auth/login", {
        method: "POST",
        mode: "cors",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: data.email.split("@")[0],
          email: data.email,
          password: data.password,
        }),
      });
      if (!response.ok) {
        const jsonRes = await response.json();
        setTimeout(()=>context.setLoadingScreen(false), 200);
        context.setAlert({ status: false, message: jsonRes.message });
        return;
      }
      const jsonRes = await response.json();
      context.setNotificationCnt(jsonRes.notification);
      context.setFriendRequestCnt(jsonRes.friendRequest);
      context.loginSetter(jsonRes);
      reactLocalStorage.set("authToken", jsonRes.token);
      setTimeout(()=>context.setLoadingScreen(false), 200);;
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong :((" });
    }
  };

  return (
    <>
      <div className=" flex flex-col text-lg items-center">
        <input
          onChange={(e) => setemail(e.target.value)}
          type="text"
          name=""
          id="email"
          placeholder="Email"
          className=" my-4 w-96 border-b-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors"
        />

        <span className="relative">
          <input
            onChange={(e) => setpassword(e.target.value)}
            type={passwordVisible ? "text" : "password"}
            name=""
            id="password"
            placeholder="Password"
            className=" my-4 w-96 border-gray-300 border-b-4 focus:outline-0 p-1 px-2 hover:border-gray-400 focus:border-blue-500 transition-colors"
          />
          <i
            onClick={() =>
              passwordVisible
                ? setpasswordVisible(false)
                : setpasswordVisible(true)
            }
            className={`absolute bottom-7 cursor-pointer right-2 fa-regular text-slate-500 fa-eye${
              passwordVisible ? "-slash" : ""
            }`}
          ></i>
        </span>

        <input
          onClick={() =>
            normalLogin({ email: email.toLowerCase(), password: password })
          }
          type="button"
          value="Log In"
          className=" my-6 w-96 focus:outline-0 p-1 px-2 transition-colors bg-blue-500 text-white cursor-pointer hover:bg-blue-600 active:bg-blue-400"
        />

        <span>
          New User?{" "}
          <Link to="/signup">
            <span className=" underline text-blue-600">Sign Up</span>
          </Link>
        </span>
      </div>
      <span className=" my-2">or</span>
      <div className=" my-4">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const googleData = await jwt_decode(credentialResponse.credential);
            const res = googleLogin({
              email: googleData.email.toLowerCase(),
              picture: googleData.picture,
            });
          }}
          onError={() => {
            context.setAlert({status:false, message:"Login failed."});
          }}
          clientId={
            "366213588806-c7nptko9pdsumb33hhmke0h57nn2qcd6.apps.googleusercontent.com"
          }
        />
      </div>
    </>
  );
}
