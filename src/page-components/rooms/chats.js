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
  faEllipsisH,
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
  const name = localStorage.getItem("name");

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
            dispatch(UPDATEROOMS({ name, data }));
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
      return moment(time).format("DD-MM-YYYY");
    }
  };

  const sortedRooms = rooms?.slice()?.sort((a, b) => {
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

    const propsButton = [
      { id: 0, icon: faThumbTack, text: "Pin" },
      { id: 1, icon: faTrash, text: "Delete" },
      { id: 2, icon: faVolumeXmark, text: "Mute" },
      { id: 3, icon: faBan, text: "Block" },
    ];

    let buttonList = propsButton.map((item) => {
      return (
        <button
          key={item.id}
          className="button-light text-left py-1 pl-1 pr-2"
          onClick={() => selected(item.id, roomId)}
        >
          <FontAwesomeIcon icon={item.icon} className="mr-2 text-primary-2" />
          {item.text}
        </button>
      );
    });

    return [...buttonList, propGroup];
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
    <div className="sidebar">
      <div className="header">
        <div className="profile" onClick={() => props.setOpenProfile(true)}>
          <span>{user.name && user.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="items">
          <div className="item mr-1" onClick={() => props.setOpenContact(true)}>
            <FontAwesomeIcon
              icon={faMessage}
              className="text-white m-2"
              size="lg"
            />
          </div>
          <div className="item mr-1" onClick={() => props.setOpenContact(true)}>
            <FontAwesomeIcon
              icon={faEllipsisH}
              className="text-white my-1 mx-1.5"
              size="xl"
            />
          </div>
        </div>
      </div>
      {sortedRooms.map(
        (chat, index) =>
          chat.lastMessage !== null && (
            <div className="relative" key={index}>
              <div
                className="card-list py-2 px-3 gap-1"
                onClick={() => props.joinRoom(chat.id, chat.name)}
              >
                <div className="w-[10%] flex justify-center items-center">
                  <div className="profile">
                    <span>
                      {chat.name && chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="w-[90%] flex flex-col">
                  <div className="flex flex-row justify-between items-center">
                    <span>{chat.name}</span>
                    <span style={{ fontSize: "12px" }}>
                      {filterTime(chat.lastMessage.timeReceived)}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span
                      className="text-nowrap"
                      style={{ maxWidth: "80%", minWidth: 50 }}
                    >
                      {chat.lastMessage.message}
                    </span>
                    <div className="flex flex-row justify-between items-center gap-1">
                      {/* <FontAwesomeIcon
                        className="text-primary-1"
                        icon={faThumbTack}
                        size="md"
                      />
                      <FontAwesomeIcon
                        className="text-primary-1"
                        icon={faVolumeXmark}
                        size="md"
                      />
                      <FontAwesomeIcon
                        className="text-primary-1"
                        icon={faBan}
                        size="md"
                      /> */}
                      {/* <div
                        className="bg-primary-2 rounded-full flex justify-center items-center"
                        style={{ height: 18, width: 18 }}
                      >
                        <span className="text-white" style={{ fontSize: 12 }}>
                          1
                        </span>
                      </div> */}
                      <div style={{ height: 16, width: 16 }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute flex flex-row items-center mb-2 mr-3"
                style={{ right: 0, bottom: 0 }}
              >
                <DropdownButton list={listMenu(chat.type, chat.id)}>
                  <FontAwesomeIcon
                    className="text-primary-1 cursor-pointer"
                    icon={faCaretDown}
                    size="xl"
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
