const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// CLIENT_SEND_MESSAGE
module.exports = (socket) => {

  // Vừa vào trang, client báo danh là cho vào phòng ngay
  socket.on("CLIENT_JOIN_ROOM", (roomChatId) => {
    socket.join(roomChatId);
    console.log(`Một socket vừa tham gia vào phòng: ${roomChatId}`);
  });

  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    let images = [];

    for (const imageBuffer of data.images) {
      const link = await uploadToCloudinary(imageBuffer);
      images.push(link);
    }

    // Lưu vào database
    const chat = new Chat({
      user_id: data.userId,
      room_chat_id: data.roomChatId,
      content: data.content,
      images: images
    });
    await chat.save();

    // SERVER_RETURN_MESSAGE
    _io.to(data.roomChatId).emit("SERVER_RETURN_MESSAGE", {
      userId: data.userId,
      fullName: data.fullName,
      content: data.content,
      images: images
    });
    // End SERVER_RETURN_MESSAGE
  });
}
// End CLIENT_SEND_MESSAGE