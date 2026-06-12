const messageSockets = require("./message.socket");
const typingSockets = require("./typing.socket");

module.exports = () => {
  _io.on('connection', (socket) => {
    // CLIENT_SEND_MESSAGE
    messageSockets(socket);
    // End CLIENT_SEND_MESSAGE

    // CLIENT_SEND_TYPING
    typingSockets(socket);
    // End CLIENT_SEND_TYPING
  });
};