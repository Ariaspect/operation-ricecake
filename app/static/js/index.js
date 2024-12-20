/**
 * Attach a form submission handler
 * @param {string} id - The ID of the form to handle
 * @param {string} api - The API endpoint to submit the form data
 * @param {Function} on_success - Callback function to handle success
 * @param {Function} on_error - Callback function to handle errors
 */
function attachFormHandler(id, api, on_success, on_error) {
  const form = document.getElementById(id);

  if (!form) {
    console.error(`Form with ID "${id}" not found.`);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload

    // Collect form data
    const formData = {};
    new FormData(form).forEach((value, key) => {
      formData[key] = value;
    });

    try {
      // Send data to the server
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        if (on_success) on_success(result);
        form.reset(); // Clear the form fields
      } else {
        if (on_error) on_error(result);
      }
    } catch (error) {
      if (on_error) on_error(error);
    }
  });
}
