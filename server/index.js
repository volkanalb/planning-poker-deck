const options = { origins: "*:*" };
const io = require("socket.io")(options);

const port = process.env.PORT || 4001;

io.on("connection", (socket) => {
  socket.on("CALL_JOIN_USER", function (room) {
    socket.join(room.id, () => joinUser(socket, room));
  });

  socket.on("CALL_UPDATE_GLOBAL_STATE", function (payload) {
    updateGlobalState(socket, payload);
  });

  socket.on("disconnecting", () => {
    Object.keys(socket.rooms).forEach((room) => leaveUser(socket, room));
  });
});

const joinUser = (socket, room) => {
  const connections = io.sockets.adapter.rooms[room.id].length;

  io.to(room.id).emit("JOIN_USER", {
    type: "JOIN_USER",
    payload: {
      id: socket.id,
      name: room.payload.name,
      status: room.payload.status,
      owner: connections === 1,
    },
  });
};

const leaveUser = (socket, room) => {
  io.to(room).emit("LEAVE_USER", {
    type: "LEAVE_USER",
    payload: {
      id: socket.id,
    },
  });
};

const updateGlobalState = (socket, room) => {
  socket.broadcast.to(room.id).emit("UPDATE_GLOBAL_STATE", {
    type: "UPDATE_GLOBAL_STATE",
    payload: room.state,
  });
};

io.listen(port, () => console.log(`Listening on port ${port}`));
