import React, { useState, useEffect } from "react";
import { socketOn } from "../../components/auth/auth-socket";
import { toastNotify } from "../../components/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  getRooms,
  selectRooms,
  UPDATEROOMS,
} from "../../store/reducers/chatReducer";
import { selectUser, selectAuthorize } from "../../store/reducers/userReducer";
import moment from "moment";

function Chats(props) {
  const user = useSelector(selectUser);
  const authorize = useSelector(selectAuthorize);
  const rooms = useSelector(selectRooms);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const getDataRooms = async () => {
      if (mounted) {
        const response = await dispatch(getRooms());

        if (!response.error) {
          setLoading(false);
          return;
        }

        if (response.error && response.payload.status === 500)
          return toastNotify("Internal Server Error", "error");

        setLoading(false);
        return toastNotify(response.payload.data.message, "warning");
      }
    };
    if (authorize) {
      getDataRooms();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorize]);

  useEffect(() => {
    let mounted = true;

    const socketData = async () => {
      await socketOn("update-room", (data) => {
        if (mounted) dispatch(UPDATEROOMS({ name: user.name, data }));
      });
    };
    socketData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterTime = (time) => {
    const date = moment(time).format("DD MMMM YYYY");
    const dateDay = moment(time).format("D");
    const now = moment().format("DD MMMM YYYY");
    const nowDay = moment().format("D");
    if (date === now) {
      return moment(time).format("HH:mm");
    } else if (nowDay - dateDay === 1) {
      return "Kemarin";
    } else {
      return moment(time).format("DD-mm-yyyy");
    }
  };

  const sortedRooms = rooms.slice().sort((a, b) => {
    if (a.lastMessage === b.lastMessage) {
      return 0;
    }
    if (a.lastMessage === null) {
      return 1;
    }
    if (b.lastMessage === null) {
      return -1;
    }

    return (
      new Date(b.lastMessage.timeReceived) -
      new Date(a.lastMessage.timeReceived)
    );
  });

  return (
    <div className="sidebar bg-light">
      <div className="section-header">
        <span className="text-white ml-2">Chat</span>
        <div
          className="circle-hover mr-1"
          onClick={() => props.setOpenContact(true)}
        >
          <FontAwesomeIcon
            icon={faMessage}
            className="text-white m-1"
            size="lg"
          />
        </div>
      </div>
      {sortedRooms.map(
        (chat, index) =>
          chat.lastMessage !== null && (
            <div
              className="row-hover-white py-1 border-bottom pointer"
              key={index}
              onClick={() => props.joinRoom(chat.id, chat.name)}
            >
              <div className="col-2"></div>
              <div className="col-8 flex flex-column gap-1">
                <span>{chat.name}</span>
                <span>{chat.lastMessage.message}</span>
              </div>
              <div className="col-2 text-right">
                <span className="mr-1" style={{ fontSize: "12px" }}>
                  {filterTime(chat.lastMessage.timeReceived)}
                </span>
              </div>
            </div>
          )
      )}
      <BeatLoader
        loading={loading}
        className="text-center"
        color="#4a8db7"
        style={{
          display: "block",
          margin: "60% auto",
        }}
      />
    </div>
  );
}

export default Chats;
