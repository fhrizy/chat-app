import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { toastNotify } from "../../components/helper";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisH,
  faPaperPlane,
  faSquareCheck,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMessages,
  getMessages,
  actionMessage,
  UPDATEMESSAGE,
} from "../../store/reducers/messageReducer";
import { UPDATELASTMESSAGE } from "../../store/reducers/chatReducer";
import { selectUser, selectAuthorize } from "../../store/reducers/userReducer";
import moment from "moment";
import { socketOn, socketEmit } from "../../components/auth/auth-socket";
import Input from "../../components/form/input";
import Button from "../../components/form/button";
import ScrollToBottom from "react-scroll-to-bottom";
import chatEmpty from "../../assets/images/chat-empty.png";
import DropdownButton from "../../components/form/dropdown";

function Messages() {
  const user = useSelector(selectUser);
  const authorize = useSelector(selectAuthorize);
  const messages = useSelector(selectMessages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkMessage, setCheckMessage] = useState(false);
  const [checkedId, setCheckedId] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  const roomId = query.get("roomId") || "";
  const name = query.get("name") || "Message";
  const navigate = useNavigate();
  let section = [];

  useEffect(() => {
    setCheckMessage(false);
    setCheckedId([]);
  }, [roomId]);

  useEffect(() => {
    if (checkedId?.length > 0) {
      dispatch(
        UPDATELASTMESSAGE({ roomId, ...messages[messages?.length - 1] })
      );
      setCheckedId([]);
    }
  }, [messages]);

  useEffect(() => {
    let mounted = true;

    const getDataMessages = async () => {
      setLoading(true);
      const response = await dispatch(getMessages({ roomId }));
      if (mounted && !response.error) {
        await socketEmit("join-room", {
          roomId: roomId,
        });
        setLoading(false);
        // await socketEmit("readBy");
        return;
      }
      if (response.error && response.payload.status === 500)
        return toastNotify("Internal Server Error", "error");

      setLoading(false);
      return toastNotify(response.payload.data.message, "warning");
    };
    if (authorize && roomId) {
      getDataMessages();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorize, roomId]);

  useEffect(() => {
    let mounted = true;

    const socketData = async () => {
      await socketOn("receive-message", (data) => {
        if (mounted) {
          dispatch(UPDATEMESSAGE(data));
        }
      });
    };
    socketData();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const sendMessage = async () => {
    if (message !== "") {
      await socketEmit("send-message", {
        message: message,
        timeSend: new Date(),
      });
      setMessage("");
    }
  };

  const filterTime = (index, idRoom, time) => {
    const date = moment(time).format("DD MMMM YYYY");
    const dateDay = moment(time).format("D");
    const now = moment().format("DD MMMM YYYY");
    const nowDay = moment().format("D");
    const filterDate = section.filter(
      (item) => moment(item.date).format("DD MMMM YYYY") === date
    );
    if (roomId !== idRoom) {
      section = [];
    } else if (roomId === idRoom) {
      if (section === 0) {
        section[0] = { idxCount: index, date: date };
      } else {
        if (filterDate.length === 0) {
          section.push({ idxCount: index, date: date });
        }
      }
      if (date === now) {
        if (index === section[section.length - 1].idxCount) {
          return "Hari ini";
        }
      } else if (nowDay - dateDay === 1) {
        const yesterdayIndex = section.findIndex(
          (item) => moment(item.date).format("DD MMMM YYYY") === date
        );
        if (index === section[yesterdayIndex].idxCount) {
          return "Kemarin";
        }
      } else {
        const currentIndex = section.findIndex(
          (item) => moment(item.date).format("DD MMMM YYYY") === date
        );
        if (index === section[currentIndex].idxCount) {
          return moment(time).format("DD MMMM YYYY");
        }
      }
    }
  };

  const closeMessage = () => {
    navigate({ search: `` });
  };

  const listMenu = [
    <button
      className="button-light text-left py-1 pl-1 pr-2"
      onClick={() => setCheckMessage(true)}
    >
      <FontAwesomeIcon icon={faSquareCheck} className="mr-2 text-primary-2" />
      Select Message
    </button>,
  ];

  const checked = (e, id) => {
    if (e) setCheckedId((prev) => [...prev, id]);
    if (!e) setCheckedId((prev) => prev.filter((item) => item !== id));
  };

  const Checkbox = ({ id }) => {
    return (
      <div className="flex items-center mb-3 mx-1">
        {checkMessage && (
          <input
            checked={checkedId.includes(id)}
            type="checkbox"
            onChange={(e) => checked(e.target.checked, id)}
            className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        )}
      </div>
    );
  };

  const actionsMessage = async (key) => {
    const response = await dispatch(
      actionMessage({ key, messageId: checkedId })
    );
    if (!response.error) {
      setCheckMessage(false);
      return toastNotify("Message deleted successfully", "success");
    }
    if (response.error && response.payload.status === 500)
      return toastNotify("Internal Server Error", "error");

    return toastNotify(response.payload.data.message, "warning");
  };

  return (
    <div
      className={`message bg-gray flex flex-col justify-between ${
        roomId && "active"
      }`}
    >
      <div className="header">
        <div className="flex flex-row">
          <div
            className="x-mark-message circle-hover mr-1"
            onClick={() => closeMessage()}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-white mx-1.5 my-1"
              size="xl"
            />
          </div>
          {roomId && (
            <div className="profile ml-2">
              <span>{name && name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="text-white text-xl ml-5">{name}</span>
        </div>
        {checkMessage && (
          <div className="items">
            {checkedId.length > 0 && (
              <div className="item mr-1" onClick={() => actionsMessage(0)}>
                <FontAwesomeIcon
                  className="text-white mx-2 my-1.5"
                  icon={faTrash}
                  size="lg"
                />
              </div>
            )}
            <div className="item mr-1" onClick={() => setCheckMessage(false)}>
              <FontAwesomeIcon
                className="text-white mx-2 my-1"
                icon={faXmark}
                size="xl"
              />
            </div>
          </div>
        )}
        {!checkMessage && roomId && (
          <div className="items">
            <DropdownButton list={listMenu}>
              <div className="item mr-1">
                <FontAwesomeIcon
                  className="text-white my-1 mx-1.5"
                  icon={faEllipsisH}
                  size="xl"
                />
              </div>
            </DropdownButton>
          </div>
        )}
      </div>
      {!roomId && !loading && (
        <img
          style={{ height: "50%", width: "50%", margin: "auto" }}
          alt="Not Found"
          src={chatEmpty}
        />
      )}
      <BeatLoader
        loading={loading}
        className="text-center"
        color="#4a8db7"
        style={{
          display: "block",
          margin: "0 auto",
        }}
      />
      {roomId && !loading && (
        <ScrollToBottom
          className="message-room w-full flex flex-col"
          ScrollBehavior="smooth"
        >
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className="text-center"
                style={{
                  fontSize: "12px",
                  display: "block",
                  margin: "0 auto",
                }}
              >
                {filterTime(
                  index,
                  message.roomId,
                  message.messageContent.timeReceived
                )}
              </div>
              <div
                className={`flex flex-row items-center justify-${
                  message.from === user.id ? "end" : "start"
                }`}
              >
                {message.from !== user.id && <Checkbox id={message._id} />}
                <div
                  className={`message-bubble-${
                    message.from === user.id ? `right` : `left`
                  } m-1 w-full`}
                >
                  <div className="message-bubble-content">
                    {message.messageContent.message}
                  </div>

                  <div
                    className="message-bubble-meta"
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {moment(message.messageContent.timeReceived).format(
                      "HH:mm"
                    )}
                  </div>
                </div>
                {message.from === user.id && <Checkbox id={message._id} />}
              </div>
            </div>
          ))}
        </ScrollToBottom>
      )}
      <div className="flex flex-row justify-center bg-white pt-2 pb-1 w-full">
        <Input
          disabled={!roomId}
          className="block h-[34px] w-[90%] max-[900px]:w-[85%] max-xl:w-[85%] pl-3 pr-2 rounded-l-lg border border-secondary focus:outline-none focus:ring-primary-1 focus:border-primary-1 sm:text-sm"
          type="text"
          placeholder="Message"
          onChange={(e) => setMessage(e)}
          value={message}
          autoFocus={true}
          onEnterKey={sendMessage}
        />
        <Button
          disabled={!roomId}
          className="border border-secondary rounded-r-lg p-1 mr-2 w-[5%] max-[900px]:w-[10%] max-xl:w-[10%]"
          onClick={sendMessage}
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-primary-1 mx-1"
            size="sm"
          />
        </Button>
      </div>
    </div>
  );
}

export default Messages;
