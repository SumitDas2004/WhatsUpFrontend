import React, { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import Appcontext from "../AppContext/Appcontext";
import { reactLocalStorage } from "reactjs-localstorage";

export default function Myprofiledrawer(props) {
  const { myProfileDrawer, setmyProfileDrawer } = props;
  const [editUsername, setEditUsername] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [slideDrawer, setslideDrawer] = useState("-translate-x-full");
  const [updatingUserName, setUpdatingUserName] = useState(false);
  const [updatingUsersDescription, setUpdatingUsersDescription] = useState(false);
  const refToUserName = useRef();
  const refToDescription = useRef();

  useEffect(() => {
    setslideDrawer("translate-x-none");
  }, []);
  const context = useContext(Appcontext);
  const slideOutDrawer = () => {
    setslideDrawer("-translate-x-full");
    setTimeout(() => setmyProfileDrawer(false), 100);
  };

  const getUrl = async (e) => {
    const file = e.files[0];
    if (!file.type.match("image.*")) {
      context.setAlert({
        status: false,
        message: "Only image files are valid.",
      });
      return null;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "booloppf");
    data.append("cloud_name", "dgajofeja");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dgajofeja/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    if (!res.ok) {
      const jsonRes = await res.json();
      context.setAlert({ status: false, message: jsonRes.message });
    }
    const jsonRes = await res.json();
    return jsonRes.secure_url;
  };
  const changeDp = async (url) => {
    const upload = await fetch(import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/auth/uploaddp", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authToken: reactLocalStorage.get("authToken"),
      },
      body: JSON.stringify({
        file: url,
      }),
    });
    if (!upload.ok) {
      const uploadRes = await upload.json();
      return { status: false, message: uploadRes.message };
    }
    const uploadRes = await upload.json();
    return { status: true, message: uploadRes.message };
  };

  const changeUsername = async (newName) => {
    setUpdatingUserName(true);
    const changeName = await fetch(
      import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/auth/updateusername",
      {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authToken: reactLocalStorage.get("authToken"),
        },
        body: JSON.stringify({
          username: newName,
        }),
      }
    );
    if (!changeName.ok) {
      const jsonRes = await changeName.json();
      return context.setAlert({ status: false, message: jsonRes.message });
    }
    const res = await changeName.json();
    context.loggedIn.username = newName;
  };

  const changeDescription = async (newDescription) => {
    setUpdatingUsersDescription(true);
    const description = await fetch(
      import.meta.env.VITE_BACKEND_URL+import.meta.env.VITE_BACKEND_PORT+"/auth/updatedescription",
      {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authToken: reactLocalStorage.get("authToken"),
        },
        body: JSON.stringify({
          description: newDescription,
        }),
      }
    );
    if (!description.ok) {
      const jsonRes = await description.json();
      return context.setAlert({ status: false, message: jsonRes.message });
    }
    const res = await description.json();
    context.loggedIn.description = newDescription;
  };
  return (
    <div
      className={`h-full absolute z-30 flex flex-col w-full ${slideDrawer} transition-all duration-200 overflow-y-scroll select-none`}
    >
      <nav className=" h-28 w-full bg-blue-700 flex items-end">
        <span className=" text-lg my-4">
          <button
            className=" cursor-pointer bg-transparent outline-none border-none text-white mx-8 bg-slate-200"
            onClick={() =>
              myProfileDrawer ? slideOutDrawer() : setmyProfileDrawer(true)
            }
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <span className="text-white font-semibold">My Profile</span>
        </span>
      </nav>
      <section className=" bg-slate-200 w-full flex-grow flex flex-col items-center justify-evenly">
        {/* profile picture */}
        <span
          className={` rounded-full overflow-hidden h-48 w-48 flex cursor-pointer relative`}
        >
          <img
            className="w-full z-10 hover:z-0"
            src={context.loggedIn.picture || "https://shorturl.at/cjtyQ"}
            alt="Image not found"
          />
          <label
            htmlFor="dpInput"
            className="h-full w-full flex justify-center items-center cursor-pointer absolute hover:z-10"
          >
            <span className="bg-black bg-opacity-30 h-full w-full flex justify-center items-center" title="Change profile picture">
              <span className="text-white flex items-center flex-col h-min">
                <i className="fa-solid fa-camera-retro text-3xl"></i>
                <span className="mt-2">Change profile picture</span>
              </span>
            </span>
          </label>
          {/* display picture input */}
          <input
            type="file"
            id="dpInput"
            accept="image/*"
            onChange={async (e) => {
              const url = await getUrl(e.target);
              if (!url) return;
              const alert = await changeDp(url);
              context.setAlert(alert);
            }}
            className="hidden"
          />
        </span>

        <span className="w-full bg-white flex flex-col justify-evenly p-6">
          <span className="text-blue-500">Your Name</span>
          <span className=" flex justify-between">
            <span
              ref={refToUserName}
              className={`${
                editUsername ? " border-blue-600" : "border-transparent"
              } border-b-2 text-lg text-slate-600 outline-none w-5/6 h-max box-border`}
              contentEditable={editUsername}
              suppressContentEditableWarning={true}
              onKeyDown={async (e) => {
                if (
                  e.target.innerText.length > 30 &&
                  e.key !== "Backspace" &&
                  e.key !== "Enter" &&
                  e.key !== "Delete"
                )
                  e.preventDefault();
                else if (e.key === "Enter") {
                  if (e.target.innerText.length < 2) {
                    e.preventDefault();
                    return context.setAlert({
                      status: false,
                      message: "Username must contain at least 2 characters.",
                    });
                  }
                  e.preventDefault();
                  if (
                    refToUserName.current.innerText !==
                    context.loggedIn.username
                  )
                  setUpdatingUserName(true);
                    await changeUsername(
                      refToUserName.current.innerText.trim()
                    );
                    setTimeout(()=>{setUpdatingUserName(false)}, 200);
                  setEditUsername(!editUsername);
                }
              }}
            >
              {context.loggedIn.username}
            </span>
            {updatingUserName && <i className="fa-solid fa-circle-notch text-blue-600 animate-spin text-lg h-min w-min mt-1"></i>}
            {!updatingUserName && <span
              className={` text-slate-600 cursor-pointer`}
              onClick={async () => {
                if (
                  editUsername &&
                  refToUserName.current.innerText !== context.loggedIn.username
                )
                await changeUsername(refToUserName.current.innerText.trim());
                setEditUsername(!editUsername);
              }}
            >
              <i
                className={`fa-solid fa-${editUsername ? "check" : "pen"} `}
              ></i>
            </span>}
          </span>
        </span>


        <span className="w-full bg-white flex flex-col justify-evenly p-6 mt-10">
          <span className="text-blue-500">Description</span>
          <span className=" flex justify-between">
            <span
            contentEditable={editDescription}
            suppressContentEditableWarning="true"
              className={`${
                editDescription ? " border-blue-600" : "border-transparent"
              } border-b-2 text-lg text-slate-600 outline-none w-5/6 h-max box-border`}
              ref={refToDescription}
              onKeyDown={async (e) => {
                if (
                  e.target.innerText.length > 100 &&
                  e.key !== "Backspace" &&
                  e.key !== "Enter" &&
                  e.key !== "Delete"
                )
                  e.preventDefault();
                else if (e.key === "Enter") {
                  if (e.target.innerText.length < 1) {
                    e.preventDefault();
                    return context.setAlert({
                      status: false,
                      message: "Description can't be empty.",
                    });
                  }
                  e.preventDefault();
                  await changeDescription(refToDescription.current.innerText.trim());
                  setEditDescription(!editDescription);
                }
              }}
            >
              {context.loggedIn.description}
            </span>

            
            {updatingUsersDescription && <i className="fa-solid fa-circle-notch text-blue-600 animate-spin text-lg h-min w-min mt-1"></i>}
            {!updatingUsersDescription && <span
              className=" text-slate-600 cursor-pointer"
              onClick={async () => {
                if (editDescription)
                setUpdatingUsersDescription(true);
                await changeDescription(refToDescription.current.innerText.trim());
                setTimeout(()=>{setUpdatingUsersDescription(false)}, 200);
                setEditDescription(!editDescription);
              }}
            >
              <i
                className={`fa-solid fa-${editDescription ? "check" : "pen"} `}
              ></i>
            </span>}
          </span>
        </span>
      </section>
    </div>
  );
}
