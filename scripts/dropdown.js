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

    function adjustDropdownHeight(dropdownMenu) {
        // Ottiene la posizione del dropdown rispetto alla viewport
        const rect = dropdownMenu.getBoundingClientRect();
        
        // Calcola lo spazio disponibile sotto il dropdown
        const spaceBelow = window.innerHeight - rect.top;
        
        // Calcola lo spazio disponibile sopra il dropdown
        const spaceAbove = rect.top;
        
        // Usa lo spazio maggiore tra quello sopra e sotto
        const maxSpace = Math.max(spaceBelow, spaceAbove);
        
        // Imposta l'altezza massima al 75% dello spazio disponibile
        dropdownMenu.style.maxHeight = `${maxSpace * 0.75}px`;
    }

    // Esempio di utilizzo
    document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        // Aggiorna l'altezza quando il dropdown viene mostrato
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('show')) {
                    adjustDropdownHeight(dropdown);
                }
            });
        });

        observer.observe(dropdown, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
});