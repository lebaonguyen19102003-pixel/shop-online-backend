const cookie = require("cookie");
const User = require("../../models/user.model");

// Tạo một Object tạm trên RAM để lưu trữ bộ đếm thời gian của từng User
// Cấu trúc sẽ có dạng: { "id_user_1": timeoutId, "id_user_2": timeoutId }
const onlineTimeouts = {};

module.exports = () => {
  _io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const tokenUser = cookies.tokenUser;

      if (tokenUser) {
        const user = await User.findOne({ tokenUser: tokenUser, statusOnline: "online" });
        if (user) {
          socket.user = user; // Chỉ gắn user nếu tìm thấy trong DB
        }
      }

      // BẤT KỂ CÓ USER HAY KHÔNG: Đều cho phép kết nối thành công!
      return next();
    } catch (err) {
      // Nếu lỗi hệ thống, vẫn cho kết nối nhưng không có user
      return next();
    }
  });


  _io.on("connection", (socket) => {

    if (socket.user) {
      const userId = socket.user.id;

      // BƯỚC 1: NGAY KHI KẾT NỐI MỚI ĐƯỢC TẠO (USER VỪA CHUYỂN TRANG XONG)
      // Kiểm tra xem user này có lệnh "chờ offline" nào đang chạy không
      if (onlineTimeouts[userId]) {
        // CHÍNH LÀ Ý TƯỞNG CỦA BẠN: Hủy ngay lệnh báo offline đó đi!
        clearTimeout(onlineTimeouts[userId]);
        delete onlineTimeouts[userId]; // Xóa khỏi bộ nhớ tạm
        console.log(`User ${userId} chuyển trang nhanh chóng, hủy báo offline.`);
      } else {
        // Nếu không có lệnh chờ nào, chứng tỏ đây là lần đầu tiên họ đăng nhập/mở web
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
          userId: userId,
          status: "online"
        });
      }
    }

    // BƯỚC 2: KHI USER ĐỨT KẾT NỐI (BẤM CHUYỂN TRANG HOẶC TẮT TAB)
    socket.on("disconnect", () => {
      if (socket.user) {
        const userId = socket.user.id;

        // Thay vì emit offline ngay, ta lên lịch chờ 3 giây
        onlineTimeouts[userId] = setTimeout(async () => {

          // Nếu sau 3 giây mà hàm này vẫn được chạy, chứng tỏ user đã tắt hẳn tab 
          // chứ không phải là bấm chuyển trang (vì nếu chuyển trang thì đã bị clearTimeout ở Bước 1)
          await User.updateOne({ _id: userId }, { statusOnline: "offline" });

          socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: userId,
            status: "offline"
          });

          // Xóa bỏ vết trong object tạm sau khi đã xong việc
          delete onlineTimeouts[userId];
          console.log(`User ${userId} đã offline thực sự sau 3s.`);

        }, 3000); // 3 giây để người dùng kịp tải trang mới
      }
    });
  });
};