async function open_modal(url) {
  const response = await fetch(url);
  const modalHtml = await response.text();
  document.querySelector("#modal_container").innerHTML = modalHtml;

  const instance = M.Modal.init(document.querySelector(".modal"));
  M.FormSelect.init(document.querySelectorAll("#modal_container select"));

  const modalOpenEvent = new CustomEvent("modal:open");
  document.dispatchEvent(modalOpenEvent);

  instance.open();
}
