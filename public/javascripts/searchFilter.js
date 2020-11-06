document.getElementById("filter").addEventListener("input", (e) => {
  const filter = e.target.value.toUpperCase();
  const trs = document.getElementsByClassName("part-row");
  for (const tr of trs) {
    tr.style.display = tr.dataset.part.toUpperCase().includes(filter) ? "" : "none";
  }
});