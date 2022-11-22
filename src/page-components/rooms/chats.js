import React, { useState, useEffect } from "react";
import { socketOn } from "../../components/auth/auth-socket";
import { toastNotify } from "../../components/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faCaretDown,
  faThumbTack,
  faVolumeXmark,
  faBan,
  faTrash,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  getRooms,
  selectRooms,
  UPDATEROOMS,
  actionRoom,
} from "../../store/reducers/chatReducer";
import { selectUser, selectAuthorize } from "../../store/reducers/userReducer";
import DropdownButton from "../../components/form/dropdown";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { EMPTYMESSAGE } from "../../store/reducers/messageReducer";

function Chats(props) {
  const user = useSelector(selectUser);
  const authorize = useSelector(selectAuthorize);
  const rooms = useSelector(selectRooms);
  const idUser = localStorage.getItem("id");

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        if (mounted) {
          if (data?.members.includes(idUser)) {
            dispatch(UPDATEROOMS({ name: user.name, data }));
          }
        }
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

  const listMenu = (type, roomId) => {
    const propGroup = type === "group" && (
      <button
        className="button-light text-left py-1 pl-1 pr-2"
        onClick={() => selected(4, roomId)}
      >
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="mr-1 text-muted"
        />
        Leave Group
      </button>
    );
    return [
      <button
        className="button-light text-left py-1 pl-1 pr-2"
        onClick={() => selected(0, roomId)}
      >
        <FontAwesomeIcon icon={faThumbTack} className="mr-1 text-muted" />
        Pin
      </button>,
      <button
        className="button-light text-left py-1 pl-1 pr-2"
        onClick={() => selected(1, roomId)}
      >
        <FontAwesomeIcon icon={faTrash} className="mr-1 text-muted" />
        Delete
      </button>,
      <button
        className="button-light text-left py-1 pl-1 pr-2"
        onClick={() => selected(2, roomId)}
      >
        <FontAwesomeIcon icon={faVolumeXmark} className="mr-1 text-muted" />
        Mute
      </button>,
      <button
        className="button-light text-left py-1 pl-1 pr-2"
        onClick={() => selected(3, roomId)}
      >
        <FontAwesomeIcon icon={faBan} className="mr-1 text-muted" />
        Block
      </button>,
      propGroup,
    ];
  };

  const selected = async (key, roomId) => {
    setLoading(true);
    const response = await dispatch(actionRoom({ key, roomId }));
    if (!response.error) {
      navigate({ search: `` });
      dispatch(EMPTYMESSAGE());
      setLoading(false);
      return;
    }
    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");
    setLoading(false);
    return toastNotify(response.payload.data.message, "warning");
  };

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
            <div className="relative" key={index}>
              <div
                className="row-hover-white py-1 border-bottom pointer"
                onClick={() => props.joinRoom(chat.id, chat.name)}
              >
                <div className="col-2"></div>
                <div className="col-8 flex flex-column gap-1">
                  <span>{chat.name}</span>
                  <span
                    className="text-nowrap"
                    style={{ maxWidth: "80%", minWidth: 50 }}
                  >
                    {chat.lastMessage.message}
                  </span>
                </div>
                <div className="col-2 text-right">
                  <span className="mr-1" style={{ fontSize: "12px" }}>
                    {filterTime(chat.lastMessage.timeReceived)}
                  </span>
                </div>
              </div>
              <div
                className="absolute flex flex-row gap-1 flex-center mb-1 mr-1"
                style={{ right: 0, bottom: 0 }}
              >
                {/* <FontAwesomeIcon
                  className="text-success"
                  icon={faThumbTack}
                  size="xs"
                /> */}
                {/* <FontAwesomeIcon
                  className="text-danger"
                  icon={faVolumeXmark}
                  size="xs"
                /> */}
                {/* <FontAwesomeIcon
                  className="text-danger"
                  icon={faBan}
                  size="xs"
                /> */}
                {/* <div
                  className="bg-primary rounded flex flex-center"
                  style={{ height: 20, width: 20 }}
                >
                  <span className="text-white" style={{ fontSize: 10 }}>
                    1
                  </span>
                </div> */}
                <DropdownButton list={listMenu(chat.type, chat.id)}>
                  <FontAwesomeIcon
                    className="text-muted pointer"
                    icon={faCaretDown}
                    size="lg"
                  />
                </DropdownButton>
              </div>
            </div>
          )
      )}
      <BeatLoader
        loading={loading && !rooms}
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
