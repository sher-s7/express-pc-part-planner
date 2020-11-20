const addButtons = document.getElementsByClassName("add");

for (const button of addButtons) {
  button.addEventListener("click", () => {
    const info = JSON.parse(button.dataset.info);
    const url = button.dataset.url;
    const key = info.category.title.toLowerCase().split(" ").join("_");
    const formatted_obj = {
      component: info.name,
      component_url: url,
      price: info.price,
    };
    console.log(formatted_obj, JSON.stringify(formatted_obj));
    document.cookie = `${key}=${JSON.stringify(
      formatted_obj
    )}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=None;`;
  });
}

function getCookie(name) {
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    .split("=")[1];
}
