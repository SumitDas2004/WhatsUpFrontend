import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import Appcontext from "../AppContext/Appcontext";
import ChatMenuItems from "./ChatMenuItems";
import Menuinsidechatmenu from "./Menuinsidechatmenu";
import Myprofiledrawer from "./Myprofiledrawer";
import Sendfriendrequestform from "./Sendfriendrequestform";
import { reactLocalStorage } from "reactjs-localstorage";
import Notificationcontainer from "./Notificationcontainer";
import Friendrequestcontainer from "./Friendrequestcontainer";
import { MoonLoader } from "react-spinners";

export default function Chatmenu(props) {
  const context = useContext(Appcontext);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [friendSearchBoxFocused, setFriendSearchBoxFocused] = useState(false);

  const fetchAllNotifications = async () => {
    try {
      const notifications = await fetch(
        import.meta.env.VITE_BACKEND_URL+"/modifyfriends/fetchallnotifications",
        {
          method: "GET",
          mode: "cors",
          headers: {
            authToken: reactLocalStorage.get("authToken"),
          },
        }
      );
      if (!notifications.ok) {
        const jsonRes = await friends.json();
        context.setAlert({ status: false, message: jsonRes.message });
      }
      const jsonRes = await notifications.json();
      context.setNotificationCnt(jsonRes.notifications.length);
      return jsonRes.notifications;
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Something went wrong, unable to fetch notifications :(",
      });
    }
  };

  const getNotifications = () => {
    const n = fetchAllNotifications();
    n.then((e) => {
      context.setNotifications(e);
    });
  };

  useEffect(() => {
    getNotifications();
    context.socket.on("receive-notification", () => {
      getNotifications();
    });
  }, []);

  const fetchFriendRequest = async () => {
    try {
      const friends = await fetch(
        import.meta.env.VITE_BACKEND_URL+"/modifyfriends/getfriendrequests",
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
      context.setFriendRequestCnt(jsonRes.friendrequests.length);
      return jsonRes.friendrequests;
    } catch (e) {
      context.setAlert({
        status: false,
        message: "Something went wrong, Unable to fetch friend reuests :(",
      });
    }
  };
  const getFriendRequests = () => {
    const fr = fetchFriendRequest();
    fr.then((e) => {
      context.setfriendRequests(e);
    });
  };
  useEffect(() => {
    getFriendRequests();
    context.socket.on("receive-request", () => {
      getFriendRequests();
    });
  }, []);

  const fetchAllFriends = async () => {
    setChatsLoading(true);
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

  const [myProfileDrawer, setmyProfileDrawer] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search your chats here");
  const [chatMenuDrowpDownVisible, setchatMenuDrowpDownVisible] =
    useState(false);
  const [sendRequestFormVisible, setsendRequestFormVisible] = useState(false);
  const [friendSearchBox, setFriendSearchBox] = useState("");

  const refToFriendRequestForm = useRef();

  const refToNotification = useRef();

  const refToFriendRequests = useRef();

  const refToMenu = useRef();

  const refToAddFriendButton = useRef(null);

  

  useEffect(() => {
    const f = (e) => {
      if (refToFriendRequestForm.current.contains(e.target) || (refToAddFriendButton.current && refToAddFriendButton.current.contains(e.target)))
        setsendRequestFormVisible(true);
      else setsendRequestFormVisible(false);

      if (refToNotification.current.contains(e.target))
        context.setNotificationVisible(true);
      else context.setNotificationVisible(false);

      if (refToFriendRequests.current.contains(e.target))
        context.setFriendRequestsVisible(true);
      else context.setFriendRequestsVisible(false);

      if (refToMenu.current.contains(e.target))
        setchatMenuDrowpDownVisible(true);
      else setchatMenuDrowpDownVisible(false);
    };
    document.addEventListener("click", f);
    return () => {
      document.removeEventListener("click", f);
    };
  }, []);

  useEffect(() => {
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
      setChatsLoading(false);
    });
  }, [context.friendRequests, context.notifications, context.chatSelected]);

  useEffect(() => {
    context.setFilteredFriend(
      context.friends.filter((e) => {
        return e.username.includes(friendSearchBox);
      })
    );
  }, [friendSearchBox, context.friends]);

  const debounce = (func, wait) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), wait);
    };
  };

  return (
    <>
      {myProfileDrawer && (
        <Myprofiledrawer
          myProfileDrawer={myProfileDrawer}
          setmyProfileDrawer={setmyProfileDrawer}
        />
      )}
      {/* navbar of chatMenuSection */}
      <div className="sticky z-20 select-none">
        <nav className=" bg-slate-200 h-20 flex items-center justify-between">
          {/*Profile image in navbar in chatmenu */}
          <span
            title="My Profile"
            onClick={() =>
              myProfileDrawer
                ? setmyProfileDrawer(false)
                : setmyProfileDrawer(true)
            }
            className=" cursor-pointer ml-3 h-14 w-14 rounded-full overflow-hidden flex justify-center "
          >
            <img loading="lazy"
            className="bg-white"
              src={context.loggedIn.picture || "https://res.cloudinary.com/dgajofeja/image/upload/v1697100260/akjmt1tl070y3ss6qodq.png"}
              alt="Image not found."
            />
          </span>
          <span className="flex flex-row mr-4">
            {/* send friendrequest */}
            <span className="relative" ref={refToFriendRequestForm}>
              <span
                title="Add friend"
                className=" flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
                onClick={() => setsendRequestFormVisible(true)}
              >
                <i className="fa-solid fa-plus"></i>
              </span>
              {sendRequestFormVisible && <Sendfriendrequestform />}
            </span>

            {/* Notification */}
            <span className="relative" ref={refToNotification}>
              <span
                title="Notifications"
                onClick={() => context.setNotificationVisible(true)}
                className=" flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
              >
                <i className="fa-solid fa-bell"></i>
                {context.notificationCnt > 0 && (
                  <span className="h-2 w-2 rounded-full bg-red-500 absolute right-2 top-2"></span>
                )}
              </span>
              {context.notificationVisible && <Notificationcontainer />}
            </span>

            {/* friend requests  */}
            <span className="relative" ref={refToFriendRequests}>
              <span
                title="Friend Requests"
                onClick={() => context.setFriendRequestsVisible(true)}
                className=" flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
              >
                <i className="fa-solid fa-user-group"></i>
                {context.friendRequestCnt > 0 && (
                  <span className="h-2 w-2 rounded-full bg-red-500 absolute right-2 top-2"></span>
                )}
              </span>
              {context.friendRequestsVisible && <Friendrequestcontainer />}
            </span>

            {/* 3 dot menu  */}
            <span className="relative" ref={refToMenu}>
              <span
                title="Menu"
                className="flex justify-center items-center rounded-full h-10 w-10 cursor-pointer text-xl text-slate-600 active:bg-slate-300"
              >
                <i className=" fa-solid fa-ellipsis-vertical"></i>
              </span>
              {chatMenuDrowpDownVisible && <Menuinsidechatmenu />}
            </span>
          </span>
        </nav>
        <div className="h-14 w-full flex items-center justify-center bg-white">
          <span className="relative w-[80%] h-10">
            {(friendSearchBoxFocused || friendSearchBox.length>0) && (
              <i className="fa-solid fa-arrow-right text-blue-600 absolute left-3 top-3 rotate-180 cursor-pointer"></i>
            )}
            {(!friendSearchBoxFocused && friendSearchBox.length<=0) && (
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-600"></i>
            )}
            <input
              title="Search input textbox"
              onFocus={() => setFriendSearchBoxFocused(true)}
              onChange={debounce(
                (e) => setFriendSearchBox(e.target.value),
                300
              )}
              type="text"
              name=""
              id=""
              placeholder={placeholder}
              className=" outline-none bg-gray-200 w-full h-full pl-10 rounded-md pr-4"
              onMouseDown={() => setPlaceholder("")}
              onBlur={() => {
                setPlaceholder("Search your chats here")
                setFriendSearchBoxFocused(false)
              }}
            />
          </span>
        </div>
      </div>
      {/* Chatmenu body */}
      <section className="bg-gray-100 overflow-y-scroll flex-grow border-t-2 ">
        {
          (context.filteredFriend.length > 0 ? (
            context.filteredFriend.map((e, i) => {
              const time = new Date(e.lastMessage.createdAt);
              return (
                <ChatMenuItems
                  key={i}
                  data={e}
                  index={i}
                  time={
                    e.lastMessage &&
                    (("" + time.getHours()).length == 1
                      ? "0" + time.getHours()
                      : time.getHours()) +
                      ":" +
                      (("" + time.getMinutes()).length == 1
                        ? "0" + time.getMinutes()
                        : time.getMinutes())
                  }
                />
              );
            })
          ) : (
            <span className=" h-full w-full flex justify-center items-center text-slate-700">
              <span onClick={() => setsendRequestFormVisible(true)} ref={refToAddFriendButton} className="bg-blue-500 text-white flex justify-center items-center rounded-md p-2 cursor-pointer select-none"><i className="fa-solid fa-plus text-xl"></i> &nbsp; Add friend</span>
            </span>
          ))}
        {chatsLoading && (
          <span className="w-full h-28 flex items-center justify-center">
            <MoonLoader size={30} />
          </span>
        )}
      </section>
    </>
  );
}
