import React, { useContext, useState, useEffect } from "react";
import Chatmenu from "./Chatmenu";
import Emptychatsection from "./Emptychatsection";
import Chatsection from "./Chatsection";
import Appcontext from "../AppContext/Appcontext";
import Receipentsprofiledrawer from "./Receipentsprofiledrawer";
import { reactLocalStorage } from "reactjs-localstorage";
import CryptoJS from 'crypto-js';

export default function AfterloginInterface() {
  const context = useContext(Appcontext);

  const fetchAllFriends = async () => {
    try {
      const friends = await fetch(
        import.meta.env.VITE_BACKEND_URL+"/modifyfriends/getfriends",
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
    let typingTimeout;
    context.socket.on("server-typing", (data) => {
      clearTimeout(typingTimeout);
      const arr = [context.loggedIn.email, context.chatSelected.email];
      arr.sort();
      if (data === arr[0] + arr[1]) {
        context.setIsTyping(true);
        typingTimeout = setTimeout(() => context.setIsTyping(false), 400);
      } else context.setIsTyping(false);
    });
  }, [context.chatSelected]);

  useEffect(() => {
    context.socket.connect();
    context.socket.emit("add-user", context.loggedIn.email);

    context.socket.on("online-users", (data) => {
      context.setOnlineUsers(data);
    });

    return () => {
      context.socket.disconnect();
    };
  }, [context.loggedIn]);

  useEffect(() => {
    context.socket.on("received-message", async (data) => {
      if (data.sender === context.chatSelected.email)
        context.setMessages((currentMessages) => [...currentMessages, data]);
      const friendArray = await fetchAllFriends();
      friendArray.sort((a, b) => {
        const ad = new Date(a.lastMessage.createdAt).getTime();
        const bd = new Date(b.lastMessage.createdAt).getTime();
        if (ad === bd) return 0;
        else if (ad < bd) return 1;
        return -1;
      });
      context.setFriends(friendArray);
    });
    return () => {
      context.socket.off("received-message");
    };
  }, [context.chatSelected]);

  return (
    <>
      {/* background blue division */}
      <div className=" h-32 w-full bg-blue-500 absolute flex"></div>
      {/* background div creating the shadow */}
      <section className=" bg-[#0000005c] h-[100vh] w-full flex items-center justify-center">
        {/* Main section */}
        <section className=" h-[95%] w-[97%] bg-white flex items-center justify-start z-10 flex-row">
          {/*chat menu on the left  */}
          <section className="h-full flex flex-col w-[30%] border-r-2 border-white relative">
            <Chatmenu />
          </section>
          {/* chat section on the middle */}
          <section className=" bg-white h-full w-[70%] relative flex flex-col">
            {!context.chatSelected && <Emptychatsection />}
            {context.chatSelected && (
              <section className="flex flex-row h-full overflow-hidden">
                <Chatsection />
                <Receipentsprofiledrawer />
              </section>
            )}
          </section>
        </section>
      </section>
    </>
  );
}
