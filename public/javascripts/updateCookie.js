const addButtons = document.getElementsByClassName("add");

for (const button of addButtons) {
  button.addEventListener("click", () => {
    const partID = button.dataset.partid;
    const key = button.dataset.categoryid;
    document.cookie = `${key}=${partID}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;`;
    window.location.replace("/");
  });
}
