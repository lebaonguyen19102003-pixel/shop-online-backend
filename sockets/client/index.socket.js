const messageSockets = require("./message.socket");
const typingSockets = require("./typing.socket");
const usersSockets = require("./users.socket");

module.exports = () => {
  _io.on('connection', (socket) => {
    messageSockets(socket);
    typingSockets(socket);
    usersSockets(socket);
  });
};