document.addEventListener('DOMContentLoaded', function() {
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');

    dropdownButton.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
        dropdownButton.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('#dropdownButton')) {
            dropdownMenu.classList.remove('show');
            dropdownButton.classList.remove('show');
        }
    });
});