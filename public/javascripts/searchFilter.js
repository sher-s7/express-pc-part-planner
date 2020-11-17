const numProds = document.getElementById("numProducts");
document.getElementById("filterForm").addEventListener("submit", (e) => {
  e.preventDefault();
});
document.getElementById("filter").addEventListener("input", (e) => {
  const filter = e.target.value.toUpperCase();
  const trs = document.getElementsByClassName("part-row");
  for (const tr of trs) {
    if (tr.dataset.part.toUpperCase().includes(filter)) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
    }
  }
  let num = Array.from(trs).filter((tr) => tr.style.display == "").length;
  numProds.textContent = num;

  num == 0
    ? document.getElementById("notFound").classList.remove("hidden")
    : document.getElementById("notFound").classList.add("hidden");
});
