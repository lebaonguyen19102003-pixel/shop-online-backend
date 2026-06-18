const myUserId = document.querySelector("[my-id]").getAttribute("my-id");

// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_SEND_ADD_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_SEND_CANCEL_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_SEND_REFUSE_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng hủy gửi yêu cầu

// Chức năng chấp nhận yêu cầu kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_SEND_ACCEPT_FRIEND", {
        myUserId: myUserId,
        userId: userId
      });
    });
  });
}
// Hết Chức năng chấp nhận yêu cầu kết bạn