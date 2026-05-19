// Permissions
const tablePermissions = document.querySelector("[table-permissions]");

if(tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if(name == "id") {
        inputs.forEach(input => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          if(input.checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    if(permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");
      if(formChangePermissions) {
        inputPermissions = formChangePermissions.querySelector("input");
        inputPermissions.value = JSON.stringify(permissions);
        formChangePermissions.submit();
      }
    }
  });
}
// End Permissions

// Permissions Data Default
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));

  const tablePermissions = document.querySelector("[table-permissions]");
  
  if(tablePermissions) {
    const rows = document.querySelectorAll("[data-name]");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      inputs.forEach((input, index) => {
        input.checked = records[index].permissions.find(item => item === name) ? true : false;
      });
    });
  }
}
// End Permissions Data Default