const numProds = document.getElementById('numProducts');

document.getElementById("filter").addEventListener("input", (e) => {
  const filter = e.target.value.toUpperCase();
  const trs = document.getElementsByClassName("part-row");
  for (const tr of trs) {
    if(tr.dataset.part.toUpperCase().includes(filter)) {
      tr.style.display = ''
    } else {
      tr.style.display = 'none'
    }
  }
  numProds.textContent = Array.from(trs).filter(tr => tr.style.display == '').length;
});