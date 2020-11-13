const dropdown = document.getElementById('dropdown');
const editLinks = document.querySelector('.edit-links');
dropdown.addEventListener('click', () => {
    dropdown.classList.toggle('flip');
    editLinks.classList.toggle('collapsed')

})