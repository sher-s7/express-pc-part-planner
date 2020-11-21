const removeButtons = document.getElementsByClassName("remove");

for (const button of removeButtons) {
  button.addEventListener("click", () => {
    const key = button.dataset.removekey;
    if (cookieExists(key)) {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      window.location.reload();
    }
  });
}

function cookieExists(name) {
  return document.cookie.split("; ").find((row) => row.startsWith(name)) != undefined;
}
