// CLIENT_SEND_TYPING
module.exports = (socket) => {
  socket.on("CLIENT_SEND_TYPING", async (data) => {
    socket.join(data.roomChatId);
    socket.broadcast.to(data.roomChatId).emit("SERVER_RETURN_TYPING", data);
  });
}
// End CLIENT_SEND_TYPING