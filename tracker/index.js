const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let session_list = ['test1', 'test2', 'test3'];

io.on("connection", function(socket) {

    socket.emit("session_list", session_list);

    socket.on("disconnect", function() {
        console.log("client disconnected");
    });
});

http.listen(8000, function() {
  console.log("listening on *:8000");
});
