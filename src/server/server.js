const express = require("express");
const path = require("path");
const http = require("http");
const sio = require("socket.io");
const compression = require("compression");
const _remove = require("lodash/remove");

// Reminder https://socket.io/docs/emit-cheatsheet/

const rooms = {};

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
const io = sio(server, { origins: "*:*" });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../build")));
  app.use((req, res) =>
    res.sendFile(path.join(__dirname, "../../build/index.html"))
  );
} else {
  app.get("/", (req, res) => res.json({ status: "ok" }));
}
app.use(compression());
// Switch off the default 'X-Powered-By: Express' header
app.disable("x-powered-by");

// Clear current socket from the room
const cleanSocketFromRoom = (currentRoomId, id) => {
  const users = _remove(rooms[currentRoomId].users, (user) => user.id === id);
  rooms[currentRoomId].users = users;
};

// Send update of the room to everyone
const sendGlobalUpdate = (currentRoomId) => {
  io.in(currentRoomId).emit("update", { data: rooms[currentRoomId] });
};

io.sockets.on("connection", (socket) => {
  let currentRoomId = "";

  // Find
  socket.on("find", ({ roomId, user, profile }) => {
    console.log("[server] find", socket.id);
    currentRoomId = roomId;
    socket.join(currentRoomId);
    // no room with such name is found so create it
    if (!rooms[currentRoomId]) {
      rooms[currentRoomId] = {
        date: new Date(),
        users: [],
      };
    }
    // avoid duplicate
    cleanSocketFromRoom(currentRoomId, socket.id);
    // add user
    rooms[currentRoomId].users.push({
      id: socket.id,
      user,
      profile,
    });
    socket.emit("update", { you: socket.id });
    sendGlobalUpdate(currentRoomId);
  });

  // Leave
  socket.on("leave", () => {
    cleanSocketFromRoom(currentRoomId, socket.id);
    socket.broadcast
      .to(currentRoomId)
      .emit("update", { data: rooms[currentRoomId] });
  });

  // Propose Vote
  socket.on("propose-vote", ({ voteId }) => {
    rooms[currentRoomId].currentVote = {
      id: voteId,
      status: "PENDING",
      voters: [],
    };
    sendGlobalUpdate(currentRoomId);
  });

  // Reveal Vote
  socket.on("reveal-vote", () => {
    rooms[currentRoomId].currentVote.status = "REVEAL";
    sendGlobalUpdate(currentRoomId);
  });
});
