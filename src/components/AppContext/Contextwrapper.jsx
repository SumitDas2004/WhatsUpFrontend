import Appcontext from "./Appcontext";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

export default function Contextwrapper({ children }) {
  const [loggedIn, setLoggedIn] = useState(null);
  const [friends, setFriends] = useState([]);
  const defaultProfile = useRef(
    "https://shorturl.at/cjtyQ"
  );
  const [chatSelected, setChatSelected] = useState(false);
  const [friendRequests, setfriendRequests] = useState([]);
  const [friendRequestsVisible, setFriendRequestsVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCnt, setNotificationCnt] = useState(0);
  const [friendRequestCnt, setFriendRequestCnt] = useState(0);
  const [profileVisible, setProfileVisible] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [filteredFriend, setFilteredFriend] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(true)
  const secretKey = "sdfdthfgfgger#y@#@$#$#%ghmjkrht/-9+9+/+8by667564545evrg4v5y57";

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_BACKEND_URL));
  }, []);


  

  const notify = (val) => {
    val.status
      ? toast.success(val.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      : toast.error(val.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  };

  const chatSelectedSetter = (val) => {
    setChatSelected(val);
  };

  let loginSetter = (val) => {
    setLoggedIn(val);
  };

  const setAlert = (val) => {
    notify(val);
  };

  return (
    <Appcontext.Provider
      value={{
        secretKey,
        loadingScreen,
        setLoadingScreen,
        messages,
        setMessages,
        filteredFriend,
        setFilteredFriend,
        isTyping,
        setIsTyping,
        onlineUsers,
        setOnlineUsers,
        socket,
        setSocket,
        notifications,
        setNotifications,
        loggedIn,
        loginSetter,
        chatSelected,
        chatSelectedSetter,
        setAlert,
        friends,
        setFriends,
        friendRequests,
        setfriendRequests,
        friendRequestsVisible,
        setFriendRequestsVisible,
        notificationVisible,
        setNotificationVisible,
        defaultProfile,
        notificationCnt,
        setNotificationCnt,
        friendRequestCnt,
        setFriendRequestCnt,
        profileVisible,
        setProfileVisible,
      }}
    >
      {children}
    </Appcontext.Provider>
  );
}
