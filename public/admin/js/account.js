// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const dataPath = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = dataPath + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
// End Change Status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muỗn xóa tài khoản này?");

      if(isConfirm) {
        const formDeleteItem = document.querySelector("#form-delete-item");
        if(formDeleteItem) {
          const id = button.getAttribute("data-id");
          const dataPath = formDeleteItem.getAttribute("data-path");
          const action = dataPath + `/${id}?_method=PATCH`
          
          formDeleteItem.action = action;
          formDeleteItem.submit();
        }
      } else {
        return;
      }
    });
  });
}
// End Delete Item