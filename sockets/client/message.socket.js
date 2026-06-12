const Chat = require("../../models/chat.model");

// CLIENT_SEND_MESSAGE
module.exports = (socket) => {

  socket.on("CLIENT_SEND_MESSAGE", async (content) => {
    // Lưu vào database
    console.log(content);
    const chat = new Chat({
      user_id: userId,
      content: content
    });
    await chat.save();

    // SERVER_RETURN_MESSAGE
    _io.emit("SERVER_RETURN_MESSAGE", {
      userId: userId,
      fullName: fullName,
      content: content
    });
    // End SERVER_RETURN_MESSAGE
  });
}
// End CLIENT_SEND_MESSAGE