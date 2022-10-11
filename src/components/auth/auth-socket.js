import io from "socket.io-client";

const socket = new io.connect(
  `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
);

export const socketEmit = (event, data) => {
  return socket.emit(event, data);
};

export const socketOn = (event, callback) => {
  socket.on(event, (data) => {
    callback(data);
  });
};

export default socket;
