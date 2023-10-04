import React, { forwardRef, useContext, useEffect, useState } from "react";
import Appcontext from "../AppContext/Appcontext";
import { reactLocalStorage } from "reactjs-localstorage";

export default forwardRef(function Chatmessage(props, ref) {
  const [mark, setMark] = useState(false);
  const [content, setContent] = useState(props.data.content.substring(0, 700));
  const readMessage = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/communicate/readmessage",
        {
          headers: {
            "content-type": "application/json",
            authToken: reactLocalStorage.get("authToken"),
          },
          method: "PUT",
          body: JSON.stringify(props.data),
        }
      );
      if (!response.ok) {
        const jsonRes = await response.json();
        context.setAlert({ status: false, message: jsonRes.message });
        return;
      }
      const jsonRes = await response.json();
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Some internal error occured :(",
      });
    }
  };
  useEffect(() => {
    setMark(props.data.read);
    if (!props.data.read && props.data.sender != context.loggedIn.email) {
      readMessage();
      context.socket.emit("read-message", props.data._id);
    } else {
      context.socket.on("mark-message", (data) => {
        if (data === props.data._id) setMark(true);
      });
    }
  }, []);
  const context = useContext(Appcontext);
  return (
    <div
      ref={ref}
      className={`w-full h-max mt-1 flex ${
        props.childClassName === "sentMessage" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`${props.childClassName} relative`}>
        {!props.data.read && props.data.sender !== context.loggedIn.email && (
          <span className="h-3 w-3 rounded-full bg-red-400 text-bold text-lg absolute -right-1 -top-1"></span>
        )}
        <span className=" whitespace-pre-wrap max-w-full block text-base self-start">
          {content}
          {content.length != props.data.content.length && (
            <div
              className="text-sm text-red-500 flex justify-end cursor-pointer"
              onClick={() => {
                setContent(props.data.content.substring(0, content.length+700));
              }}
            >
              Read More
            </div>
          )}
        </span>
        <span className="flex flex-row self-end items-end">
          <span className="flex flex-col">
            <span className=" text-xs self-end text-slate-300">
              {props.date}
            </span>
            <span className=" text-xs self-end text-slate-300">
              {props.time}
            </span>
          </span>
          {props.data.sender === context.loggedIn.email && (
            <i
              className={`fa-solid fa-check ml-1 text-sm ${
                mark ? "text-sky-300" : "text-slate-400"
              }`}
            ></i>
          )}
        </span>
      </div>
    </div>
  );
});
