import React, { useEffect } from "react";
import Appcontext from "../AppContext/Appcontext";
import { useContext } from "react";
import CryptoJS from "crypto-js";

export default function ChatMenuItems(props) {
  const context = useContext(Appcontext);
  const lastMessage = props.data.lastMessage.content?CryptoJS.AES.decrypt(props.data.lastMessage.content, context.secretKey.toString()).toString(CryptoJS.enc.Utf8):"";
  return (
    
    <div
      onClick={(e) => {
        if(JSON.stringify(context.chatSelected) !== JSON.stringify(props.data))
        context.chatSelectedSetter(props.data);
      }}
      className={` h-20 w-full ${
        props.data.email === context.chatSelected.email
          ? "bg-[#F0F0F0]"
          : "bg-white"
      } flex items-center relative border-b-slate-50 border-b-2 hover:bg-[#F0F0F0] cursor-pointer select-none`}
    >
      <span className="h-14 w-14 rounded-full ml-3 overflow-hidden flex bg-slate-300">
        <img
            className="bg-white"
          src={
            props.data.picture || 'https://res.cloudinary.com/dgajofeja/image/upload/v1697100260/akjmt1tl070y3ss6qodq.png'}
          alt="Image not found."
        />
      </span>
      <span className="flex flex-col ml-3 w-4/6">
        <span className="text-black text-lg w-5/6" title={props.data.username}>{props.data.username}</span>
        <span className="text-slate-500 text-sm w-5/6 h-6 overflow-hidden" title={props.data.lastMessage.content && lastMessage>50?"...":lastMessage}>
          {props.data.lastMessage.content && lastMessage}
        </span>
      </span>
      <div className="flex flex-col justify-evenly h-3/4 ml-4">
        <span className=" right-0 text-slate-500 text-sm">{props.time}</span>
        {
          props.data.lastMessage && !props.data.lastMessage.read && props.data.lastMessage.sender!==context.loggedIn.email && <span className="mt-1 px-1 h-6 w-min rounded-sm flex items-center justify-center bg-blue-500 text-white text-xs">
            New
          </span>
        }
      </div>
    </div>
  );
}
