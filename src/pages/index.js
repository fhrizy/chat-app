import React, { useEffect, useState } from "react";
import { http_post } from "../components/helper/axios";
import { toastNotify } from "../components/helper";
import { useNavigate } from "react-router-dom";
import { socketEmit } from "../components/auth/auth-socket";
import { useDispatch } from "react-redux";
import { AUTHORIZE, auth } from "../store/reducers/userReducer";
import Profile from "../page-components/rooms/profile";
import Chats from "../page-components/rooms/chats";
import Contacts from "../page-components/rooms/contacts";
import Messages from "../page-components/messages";

function Dashboard() {
  const [openContact, setOpenContact] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = async () => {
      const response = await dispatch(auth());
      if (!response.error) {
        await socketEmit("authorize", {
          userId: response.payload.data.id,
          token: response.payload.data.token,
        });
        dispatch(AUTHORIZE(true));
        return;
      }
      if (response.error && response.payload.status === 500)
        return toastNotify("Internal Server Error", "error");

      dispatch(AUTHORIZE(false));
      navigate("/signin");
      return toastNotify(response.payload.data.message, "warning");
    };
    authUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const createRoom = async (targetId, targetName) => {
    const data = {
      name: "",
      type: "private",
      targetId: targetId,
    };
    try {
      const response = await http_post(`/create-room`, true, data);
      joinRoom(response.data.roomId, targetName);
    } catch (error) {
      if (error.response.status === 500)
        return toastNotify("Internal Server Error", "error");

      return toastNotify(error.response.data.message, "warning");
    }
  };

  const joinRoom = async (id, name) => {
    navigate({ search: `?roomId=${id}&name=${name}` });
  };

  return (
    <div className="content-row">
      <Chats
        joinRoom={joinRoom}
        setOpenContact={setOpenContact}
        setOpenProfile={setOpenProfile}
      />
      <Contacts
        openContact={openContact}
        setOpenContact={setOpenContact}
        createRoom={createRoom}
      />
      <Profile openProfile={openProfile} setOpenProfile={setOpenProfile} />
      <Messages />
    </div>
  );
}

export default Dashboard;
