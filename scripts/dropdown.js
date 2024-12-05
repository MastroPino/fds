document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        button.addEventListener('click', function(event) {
            menu.classList.toggle('show');
            button.classList.toggle('dropdown-menu-visible');

            // Chiudi altri dropdown
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-toggle').classList.remove('dropdown-menu-visible');
                    otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
                }
            });

            event.stopPropagation();
        });
    });

    // Chiudi i dropdown quando si clicca fuori
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.querySelector('.dropdown-toggle').classList.remove('dropdown-menu-visible');
                dropdown.querySelector('.dropdown-menu').classList.remove('show');
            });
        }
    });
});