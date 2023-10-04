import React, { useContext, useEffect } from "react";
import LoginAndSignupContainer from "./Login_and_Signup_Interface/LoginAndSignUpContainer";
import Appcontext from "./AppContext/Appcontext";
import AfterloginInterface from "./AfterLogin/AfterloginInterface";
import { ToastContainer } from "react-toastify";
import { reactLocalStorage } from "reactjs-localstorage";
import Loading from "./Loading";

export default function Appbody() {
  const context = useContext(Appcontext);

  const checkLoggedIn = async () => {
    try {
      context.setLoadingScreen(true);
      const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/auth/isloggedin", {
        method: "GET",
        mode: "cors",
        headers: {
          authToken: reactLocalStorage.get("authToken"),
        },
      });
      if (!res.ok) {
        return;
      }
      const jsonRes = await res.json();
      context.loginSetter(jsonRes);
      return;
    } catch (e) {
      context.setAlert({ status: false, message: "Something went wrong :(" });
    }
  };

  useEffect(() => {
    if (reactLocalStorage.get("authToken")) {
      checkLoggedIn().then((res) => {
       setTimeout(() => context.setLoadingScreen(false), 200);
      });
    }else setTimeout(() => context.setLoadingScreen(false), 200);
  }, []);

  return (
    <>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {!context.loggedIn && <LoginAndSignupContainer />}
        {context.loggedIn && <AfterloginInterface />}
      </div>
      {context.loadingScreen && <Loading />}
    </>
  );
}
