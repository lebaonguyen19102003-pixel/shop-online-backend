const Chat = require("../../models/chat.model");

// CLIENT_SEND_MESSAGE
module.exports = (socket) => {
  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    // Lưu vào database
    const chat = new Chat({
      user_id: data.userId,
      content: data.content
    });
    await chat.save();

    // SERVER_RETURN_MESSAGE
    _io.emit("SERVER_RETURN_MESSAGE", data);
    // End SERVER_RETURN_MESSAGE
  });
}
// End CLIENT_SEND_MESSAGE