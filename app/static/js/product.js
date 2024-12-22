function delete_product(productId) {
  fetch(`/admin/delete_product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "success") {
        // 성공 시 해당 카드 삭제
        const card = document.getElementById(`item-${productId}`);
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
