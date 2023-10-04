import React, { useContext, useEffect, useState, useRef } from "react";
import Appcontext from "../AppContext/Appcontext";
import Chatmessage from "./Chatmessage";
import { reactLocalStorage } from "reactjs-localstorage";
import EmojiPicker from "emoji-picker-react";
import { ClimbingBoxLoader } from "react-spinners";
import CryptoJS from 'crypto-js';

export default function Chatsection() {
  const context = useContext(Appcontext);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [endOfChatVisible, setEndOfChatVisible] = useState("visible");
  const [messageBoxContent, setMessageBoxContent] = useState("");
  const [emojiKeyboard, setEmojiKeyboard] = useState(false);
  const refToEndOfChat = useRef("");
  const refToMessageInput = useRef("");
  const refToLastReadMessage = useRef("");
  const refToEmojiKeyboard = useRef();
  const refToEmojiButton = useRef();
  const [messageLoading, setMessageLoading] = useState(false)

  const getallmessages = async () => {
    const timeout=setTimeout(()=>setMessageLoading(true), 100);
    context.setMessages([])
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/communicate/getallmessages",
        {
          headers: {
            "content-type": "application/json",
            authToken: reactLocalStorage.get("authToken"),
          },
          method: "POST",
          body: JSON.stringify({
            sender: context.loggedIn.email,
            receiver: context.chatSelected.email,
          }),
        }
      );
      if (!response.ok) {
        const jsonRes = await response.json();
        context.setAlert({ status: false, message: jsonRes.message });

        return;
      }
      const jsonRes = await response.json();
      clearTimeout(timeout)
      setMessageLoading(false);
      context.setMessages(jsonRes.messages);
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Some internal error occured :(",
      });
    }
  };
  const sendMessage = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/communicate/sendmessage",
        {
          headers: {
            "content-type": "application/json",
            authToken: reactLocalStorage.get("authToken"),
          },
          method: "POST",
          body: JSON.stringify({
            sender: context.loggedIn.email,
            receiver: context.chatSelected.email,
            content: CryptoJS.AES.encrypt(refToMessageInput.current.innerText, context.secretKey.toString()).toString(),
          }),
        }
      );
      if (!response.ok) {
        const jsonRes = await response.json();
        context.setAlert({ status: false, message: jsonRes.message });
        return;
      }
      const jsonRes = await response.json();
      context.setMessages([...context.messages, jsonRes.message]);
      refToMessageInput.current.innerText = "";
      const arr = [context.chatSelected.email, context.loggedIn.email];
      arr.sort();
      context.socket.emit("send-message", {
        message: jsonRes.message,
        roomId: arr[0] + arr[1],
      });
      refToEndOfChat.current.scrollIntoView();
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Some internal error occured :(",
      });
    }
  };
  const fetchAllFriends = async () => {
    try {
      const friends = await fetch(
        import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/modifyfriends/getfriends",
        {
          method: "GET",
          mode: "cors",
          headers: {
            authToken: reactLocalStorage.get("authToken"),
          },
        }
      );
      if (!friends.ok) {
        const jsonRes = await friends.json();
        context.setAlert({ status: false, message: jsonRes.message });
      }
      const jsonRes = await friends.json();
      jsonRes.friends.map((e) => {
        const arr = [e.email, context.loggedIn.email];
        arr.sort();
        context.socket.emit("join-room", arr[0] + arr[1]);
      });
      return jsonRes.friends;
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Something went wrong, Unable to fetch friends :(",
      });
    }
  };

  useEffect(() => {
    getallmessages();
    setMessageBoxContent("");
    refToMessageInput.current.innerText = "";
    setEmojiKeyboard(false);
  }, [context.chatSelected]);

  useEffect(() => {
    if (refToLastReadMessage.current != "" && refToLastReadMessage.current) {
      refToLastReadMessage.current.scrollIntoView();
    }
  }, [context.messages]);

  useEffect(() => {
    const observer = new IntersectionObserver((entry) => {
      entry.map((e) => {
        if (e.isIntersecting) setEndOfChatVisible("hidden");
        else setEndOfChatVisible("visible");
      });
    });
    observer.observe(refToEndOfChat.current);
  }, []);

  return (
    <div className=" h-full w-full overflow-hidden flex flex-col">
      {/* navbar of chatSection */}
      <nav className=" bg-slate-200 h-20 sticky top-0 w-full flex p-4 items-center justify-between select-none">
        <span className="flex items-center">
          <span
            className=" ml-3 h-14 w-14 rounded-full overflow-hidden bg-black cursor-pointer flex" title='Profile Details'
            onClick={() => context.setProfileVisible(true)}
          >
            <img src={context.chatSelected.picture} alt="Image not found."  />
          </span>
          <span className="flex flex-col ml-5">
            <span className=" text-xl text-slate-800">
              {context.chatSelected.username}
            </span>
            <span className="text-sm text-gray-500">
              {context.isTyping
                ? "Typing..."
                : context.onlineUsers.has(context.chatSelected.email)
                ? "Online"
                : "Offline"}
            </span>
          </span>
        </span>
        <span className="flex flex-row mr-4">
          {/* <span
            title="New Chat"
            className=" flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
          >
            <i className="fa-solid fa-search"></i>
          </span>
          <span
            title="Menu"
            className=" flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </span> */}
          <span className="font-[borel] text-blue-500 font-bold text-xl pt-5">WhatsUp!!</span>
        </span>
      </nav>
      {/* main chat section */}
      <section className="pt-2 w-full h-full bg-chatSectionBackground overflow-y-scroll relative ">
        <span className="w-full flex justify-center mb-4 select-none">
        <span className="px-4 py-2  bg-yellow-100 text-xs rounded-md text-gray-500"><i className="fa-solid fa-lock mr-1"></i>Messages to an user are end-to-end encrypted. No one outside of this chat can read them.</span>
        </span>
        {context.messages.map((e, i) => {
          const time = new Date(e.createdAt);
          if (e.sender === context.loggedIn.email) {
            return (
              <Chatmessage
                ref={refToLastReadMessage}
                key={i}
                childClassName="sentMessage"
                data={{...e, content:CryptoJS.AES.decrypt(e.content, context.secretKey.toString()).toString(CryptoJS.enc.Utf8)}}
                time={
                  (("" + time.getHours()).length == 1
                    ? "0" + time.getHours()
                    : time.getHours()) +
                  ":" +
                  (("" + time.getMinutes()).length == 1
                    ? "0" + time.getMinutes()
                    : time.getMinutes())
                }
                date={
                  time.getDate() +
                  ", " +
                  months[time.getMonth()] +
                  " " +
                  time.getFullYear()
                }
              />
            );
          } else {
            return e.read ? (
              <Chatmessage
                childClassName="receivedMessage"
                ref={refToLastReadMessage}
                key={i}
                data={{...e, content:CryptoJS.AES.decrypt(e.content, context.secretKey.toString()).toString(CryptoJS.enc.Utf8)}}
                time={
                  (("" + time.getHours()).length == 1
                    ? "0" + time.getHours()
                    : time.getHours()) +
                  ":" +
                  (("" + time.getMinutes()).length == 1
                    ? "0" + time.getMinutes()
                    : time.getMinutes())
                }
                date={
                  time.getDate() +
                  ", " +
                  months[time.getMonth()] +
                  " " +
                  time.getFullYear()
                }
              />
            ) : (
              <Chatmessage
                childClassName="receivedMessage"
                key={i}
                data={{...e, content:CryptoJS.AES.decrypt(e.content, context.secretKey.toString()).toString(CryptoJS.enc.Utf8)}}
                time={
                  (("" + time.getHours()).length == 1
                    ? "0" + time.getHours()
                    : time.getHours()) +
                  ":" +
                  (("" + time.getMinutes()).length == 1
                    ? "0" + time.getMinutes()
                    : time.getMinutes())
                }
                date={
                  time.getDate() +
                  ", " +
                  months[time.getMonth()] +
                  " " +
                  time.getFullYear()
                }
              />
            );
          }
        })}
        <span ref={refToEndOfChat} className="h-1 w-1 block"></span>
        {messageLoading && <span className=" flex justify-center items-center h-full">
          <ClimbingBoxLoader size={25} color="#2563eb" />
        </span>}
        <span
          onClick={() => refToEndOfChat.current.scrollIntoView()}
          className={` transition-all h-12 w-12 rounded-full bg-white text-lg shadow-xl cursor-pointer flex justify-center items-center text-gray-600 sticky float-right right-2 bottom-4 ${endOfChatVisible}`}
        >
          <i className="fa-solid fa-angle-down"></i>
        </span>
      </section>
      {/* chat typing bar section */}
      <section className=" w-full bg-slate-200 self-end flex items-center  sticky bottom-0 h-fit">
        <span
          className=" py-5 w-10 mr-4 flex justify-center cursor-pointer text-2xl text-slate-600 ml-4 active:text-blue-500"
          onClick={() => setEmojiKeyboard(!emojiKeyboard)}
          ref={refToEmojiButton}
        >
          <i
            className={`${
              !emojiKeyboard ? "fa-regular fa-face-smile" : "fa-solid fa-xmark"
            }`}
          ></i>
        </span>
        {/* <span className=" py-5 px-4 cursor-pointer text-2xl text-slate-600 mr-2 active:text-blue-500">
          <i className="fa-solid fa-paperclip"></i>
        </span> */}
        {emojiKeyboard && (
          <span className={`bottom-16 absolute`} ref={refToEmojiKeyboard}>
            <EmojiPicker
              lazyLoadEmojis={true}
              emojiStyle="apple"
              onEmojiClick={(e) =>
                (refToMessageInput.current.innerText += e.emoji)
              }
            />
          </span>
        )}
        <div
          contentEditable="true"
          onKeyDown={async (e) => {
            if (
              e.key === "Enter" &&
              refToMessageInput.current.innerText.length > 0 &&
              refToMessageInput.current.innerText.trim().length > 0
            ) {
              e.preventDefault();
              await sendMessage();
              setMessageBoxContent("");
              const friendArray = await fetchAllFriends();
              friendArray.sort((a, b) => {
                const ad = new Date(a.lastMessage.createdAt).getTime();
                const bd = new Date(b.lastMessage.createdAt).getTime();
                if (ad === bd) return 0;
                else if (ad < bd) return 1;
                return -1;
              });
              context.setFriends(friendArray);
            } else {
              setMessageBoxContent(refToMessageInput.current.innerText);
              const arr = [context.chatSelected.email, context.loggedIn.email];
              arr.sort();
              context.socket.emit("client-typing", arr[0] + arr[1]);
            }
          }}
          onKeyUp={(e) => {
            if (
              e.key === "Enter" &&
              refToMessageInput.current.innerText.length > 0 &&
              refToMessageInput.current.innerText.trim().length > 0
            ) {
              e.preventDefault();
              setMessageBoxContent("");
            }
          }}
          ref={refToMessageInput}
          className=" empty:before:content-[attr(placeholder)] empty:before:text-gray-500 my-3 overflow-y-scroll max-h-24 h-max p-3 bg-white  w-3/4 min-h-12  rounded-md pl-4 outline-none flex-grow resize-none before:cursor-text"
          placeholder="Type a message" title="Type a message"
        ></div>
        {/*{!messageBoxContent ? (
          <span className=" flex items-center justify-center h-16 w-14 cursor-pointer text-2xl text-slate-600 mr-4 ml-2 active:text-blue-500">
            <i className="fa-solid fa-microphone"></i>
          </span>
        ) : (*/}
        <span
          className=" h-16 w-14 flex items-center justify-center cursor-pointer text-2xl text-slate-600 mr-4 ml-2 active:text-blue-500"
          onClick={async () => {
            if (
              refToMessageInput.current.innerText.length > 0 &&
              refToMessageInput.current.innerText.trim().length > 0
            )
              await sendMessage();
            const friendArray = fetchAllFriends();
            friendArray.then((e) => {
              e.sort((a, b) => {
                const ad = new Date(a.lastMessage.createdAt).getTime();
                const bd = new Date(b.lastMessage.createdAt).getTime();
                if (ad === bd) return 0;
                else if (ad < bd) return 1;
                return -1;
              });
              context.setFriends(e);
            });
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </span>
        {/* )} */}
      </section>
    </div>
  );
}
