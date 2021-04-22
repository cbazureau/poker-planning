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
const io = sio(server, { origins: "*:*", path: "/one-socket/" });

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
  if (!rooms[currentRoomId] || !rooms[currentRoomId].users) return;
  _remove(rooms[currentRoomId].users, (user) => user.id === id);
  if (rooms[currentRoomId].users.length === 0) {
    delete rooms[currentRoomId].currentVote;
  }
  if (rooms[currentRoomId].currentVote) {
    _remove(
      rooms[currentRoomId].currentVote.voters,
      (voter) => voter.id === id
    );
  }
};

// Send update of the room to everyone
const sendGlobalUpdate = (currentRoomId) => {
  // console.log(rooms[currentRoomId].currentVote);
  io.in(currentRoomId).emit("update", { data: rooms[currentRoomId] });
};

io.sockets.on("connection", (socket) => {
  let currentRoomId = "";

  // Disconnect
  socket.on("disconnect", () => {
    cleanSocketFromRoom(currentRoomId, socket.id);
    socket.broadcast
      .to(currentRoomId)
      .emit("update", { data: rooms[currentRoomId] });
  });

  // Find
  socket.on("find", ({ roomId, user, profile }) => {
    // console.log('[server] find', socket.id);
    currentRoomId = roomId;
    socket.join(currentRoomId);
    // no room with such name is found so create it
    if (!rooms[currentRoomId]) {
      // console.log('[server] clean room');
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
    // console.log('[server] leave', socket.id);
    cleanSocketFromRoom(currentRoomId, socket.id);
    socket.broadcast
      .to(currentRoomId)
      .emit("update", { data: rooms[currentRoomId] });
  });

  // Propose Vote
  socket.on("propose-vote", ({ voteId }) => {
    // console.log('[server] propose-vote', socket.id);
    rooms[currentRoomId].currentVote = {
      id: voteId,
      userId: socket.id,
      status: "PENDING",
      voters: [],
    };
    sendGlobalUpdate(currentRoomId);
  });

  // Reveal Vote
  socket.on("reveal-vote", () => {
    // console.log('[server] reveal-vote', socket.id);
    rooms[currentRoomId].currentVote.status = "REVEAL";
    sendGlobalUpdate(currentRoomId);
  });

  // Vote
  socket.on("vote", ({ storyPoint }) => {
    // console.log('[server] vote', socket.id);
    _remove(
      rooms[currentRoomId].currentVote.voters,
      (voter) => voter.id === socket.id
    );
    rooms[currentRoomId].currentVote.voters.push({
      id: socket.id,
      vote: storyPoint,
    });
    sendGlobalUpdate(currentRoomId);
  });
});
