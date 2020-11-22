const addButtons = document.getElementsByClassName("add");

for (const button of addButtons) {
  button.addEventListener("click", () => {
    const info = JSON.parse(button.dataset.info);
    const url = button.dataset.url;
    const key = info.category._id;
    const formatted_obj = {
      component: info.name,
      component_url: url,
      price: info.price,
    };
    document.cookie = `${key}=${JSON.stringify(
      formatted_obj
    )}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=None;`;
    window.location.replace("/");
  });
}
