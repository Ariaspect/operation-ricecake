document.addEventListener("modal:open", (event) => {
  const price_text = document.querySelector("#product_subtotal");
  let price = parseInt(price_text.textContent);
  function update_price_text(new_price) {
    price_text.textContent = new_price;
    price = new_price;
  }
  document
    .querySelectorAll("#modal_container input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        const checked = checkbox.checked;
        const option_price = parseInt(event.target.dataset.price);

        update_price_text(
          checked ? price + option_price : price - option_price
        );
      });
    });
});

function add_product_to_order() {
  // todo
}
