import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { toastNotify } from "../../components/helper";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMessages,
  getMessages,
  UPDATEMESSAGE,
} from "../../store/reducers/messageReducer";
import { selectUser, selectAuthorize } from "../../store/reducers/userReducer";
import moment from "moment";
import { socketOn, socketEmit } from "../../components/auth/auth-socket";
import Input from "../../components/form/input";
import Button from "../../components/form/button";
import ScrollToBottom from "react-scroll-to-bottom";
import chatEmpty from "../../assets/images/chat-empty.png";

function Messages() {
  const user = useSelector(selectUser);
  const authorize = useSelector(selectAuthorize);
  const messages = useSelector(selectMessages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation().search;
  const query = new URLSearchParams(location);
  const roomId = query.get("roomId") || "";
  const name = query.get("name") || "Message";
  const navigate = useNavigate();
  let section = [];

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
  }

  return (
    <div className={`message bg-light flex flex-col justify-between ${roomId && "active"}`}>
      <div className="section-header">
        <span className="text-white ml-2">{name}</span>
        <div
          className="x-mark-message circle-hover mr-1"
          onClick={() => closeMessage()}
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="text-white mx-2 my-1"
            size="xl"
          />
        </div>
      </div>
      {!roomId && !loading && (
        <img style={{ height: "50%", width: "50%", margin: "auto" }} alt="Not Found" src={chatEmpty} />
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
                className={`message-bubble-${
                  message.from === user.id ? `right` : `left`
                } m-1`}
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
                  {moment(message.messageContent.timeReceived).format("HH:mm")}
                </div>
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
