function add_option() {
  const form_data = new FormData(document.querySelector("#add_option_form"));
  fetch("/admin/add_option", {
    method: "POST",
    body: form_data,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to add option");
      return response.text();
    })
    .then((option) => {
      option_container = document.querySelector(
        `#${form_data.get("type")}.option-container`
      );
      option_container.insertAdjacentHTML("beforeend", option);
      M.toast({
        html: "Option Added successfully!",
        classes: "rounded green",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      M.toast({ html: "An error occurred!", classes: "rounded red" });
    });
}

function edit_option(option_id) {
  const form_data = new FormData(document.querySelector("#edit_option_form"));
  fetch(`/admin/edit_option/${option_id}`, {
    method: "POST",
    body: form_data,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to edit option");
      return response.text();
    })
    .then((option) => {
      target_option = document.querySelector(`#item-${option_id}`);
      target_option.outerHTML = option;
      M.toast({
        html: "Option Edited successfully!",
        classes: "rounded green",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      M.toast({ html: "An error occurred!", classes: "rounded red" });
    });
}

function delete_option(option_id) {
  fetch(`/admin/delete_option/${option_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "success") {
        const option = document.querySelector(`#item-${option_id}`);
        if (option) option.remove();

        // 성공 Toast 표시
        M.toast({
          html: "Option deleted successfully!",
          classes: "rounded green",
        });
      } else {
        // 실패 Toast 표시
        M.toast({ html: data.message, classes: "rounded red" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      M.toast({ html: "An error occurred!", classes: "rounded red" });
    });
}
