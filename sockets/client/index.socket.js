const messageSockets = require("./message.socket");
const typingSockets = require("./typing.socket");

module.exports = () => {
  _io.on('connection', async (socket) => {

    // CLIENT_SEND_MESSAGE
    await messageSockets(socket, data);
    // End CLIENT_SEND_MESSAGE

    // CLIENT_SEND_TYPING
    await typingSockets(socket);
    // End CLIENT_SEND_TYPING

    console.log("a user connected: " + socket.id);
  });
};