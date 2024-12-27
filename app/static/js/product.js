function add_product() {
  const form_data = new FormData(document.querySelector("#add_product_form"));
  fetch("/admin/add_product", {
    method: "POST",
    body: form_data,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to add product");
      return response.text();
    })
    .then((card) => {
      card_container = document.querySelector(".card-container");
      card_container.insertAdjacentHTML("beforeend", card);
      M.toast({
        html: "Product Added successfully!",
        classes: "rounded green",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      M.toast({ html: "An error occurred!", classes: "rounded red" });
    });
}

function edit_product(product_id) {
  const form_data = new FormData(document.querySelector("#edit_product_form"));
  fetch(`/admin/edit_product/${product_id}`, {
    method: "POST",
    body: form_data,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to edit product");
      return response.text();
    })
    .then((card) => {
      target_card = document.querySelector(`#item-${product_id}`);
      target_card.outerHTML = card;
      M.toast({
        html: "Product Edited successfully!",
        classes: "rounded green",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      M.toast({ html: "An error occurred!", classes: "rounded red" });
    });
}

function delete_product(product_id) {
  fetch(`/admin/delete_product/${product_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "success") {
        const card = document.getElementById(`item-${product_id}`);
        if (card) card.remove();

        // 성공 Toast 표시
        M.toast({
          html: "Product deleted successfully!",
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
