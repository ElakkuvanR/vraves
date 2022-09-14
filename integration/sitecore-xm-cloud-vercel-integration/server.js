const webSocketServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");
const server = http.createServer();
server.listen(webSocketServerPort);
console.log("listening on port" + webSocketServerPort);
let connection;
const wsServer = new webSocketServer({
  httpServer: server,
});

wsServer.on("request", function (request) {
  console.log(
    new Date() +
      "Receieved a new connection from origin " +
      request.origin +
      "."
  );
  connection = request.accept(null, request.origin);
  connection.send("Test message");
  connection.on("message", (data) => {
    console.log("Message Received from client " + data.utf8Data);
  });
});

module.exports = function sendNotifcation(data) {
  connection.send(data);
};
