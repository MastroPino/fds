document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.fds-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.fds-dropdown-toggle');
        const menu = dropdown.querySelector('.fds-dropdown-menu');
        const menuBody = menu.querySelector('.fds-dropdown-menu-body');
        const items = menuBody.querySelectorAll('.fds-dropdown-item a[href]');
        let currentIndex = -1;

        // Aggiungi questa funzione per calcolare e impostare maxHeight
        const setDropdownPosition = () => {
            const viewportHeight = window.innerHeight;
            const toggleRect = toggle.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            const spaceBelowToggle = viewportHeight - toggleRect.bottom;
            const spaceAboveToggle = toggleRect.top;
            
            // Imposta maxHeight in base allo spazio disponibile
            const maxHeight = Math.min(300, spaceBelowToggle - 10); // 10px di margine
            menuBody.style.maxHeight = `${maxHeight}px`;
            
            // Se lo spazio sotto è insufficiente, posiziona sopra
            if (spaceBelowToggle < menuRect.height && spaceAboveToggle > spaceBelowToggle) {
                menu.style.bottom = '100%';
                menu.style.top = 'auto';
            } else {
                menu.style.top = '100%';
                menu.style.bottom = 'auto';
            }
        };

        // Gestione click
        toggle.addEventListener('click', function(event) {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle stato
            toggle.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('fds-show');
            toggle.classList.toggle('fds-dropdown-menu-visible');
            menu.hidden = isExpanded;

            if (!isExpanded) {
                setDropdownPosition(); // Calcola posizione all'apertura
            }

            // Chiudi altri dropdown
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherToggle = otherDropdown.querySelector('.fds-dropdown-toggle');
                    const otherMenu = otherDropdown.querySelector('.fds-dropdown-menu');
                    
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherToggle.classList.remove('fds-dropdown-menu-visible');
                    otherMenu.classList.remove('fds-show');
                    otherMenu.hidden = true;
                }
            });

            event.stopPropagation();
        });

        // Gestione tastiera aggiornata
        toggle.addEventListener('keydown', (e) => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    if (!isExpanded) {
                        toggle.click();
                        // Focus sul primo link dopo l'apertura
                        requestAnimationFrame(() => {
                            if (items.length) {
                                currentIndex = 0;
                                items[0].focus();
                            }
                        });
                    }
                    break;
                case 'Escape':
                    if (isExpanded) {
                        toggle.click();
                        toggle.focus();
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // Implementa la gestione della navigazione con le frecce
                    break;
            }
        });

        // Gestione navigazione menu
        menuBody.addEventListener('keydown', (e) => {
            if (items.length === 0) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % items.length;
                    items[currentIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    items[currentIndex].focus();
                    break;
                case 'Escape':
                    toggle.click();
                    toggle.focus();
                    break;
                case 'Tab':
                    e.preventDefault(); // Mantiene il focus nel menu
                    break;
            }
        });

        // Assicurati che i link siano focusabili
        items.forEach(item => {
            item.setAttribute('tabindex', '0');
        });

        // Chiudi al click fuori
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('fds-show');
                toggle.classList.remove('fds-dropdown-menu-visible');
                menu.hidden = true;
            }
        });

        // Gestisci il ridimensionamento della finestra
        window.addEventListener('resize', () => {
            if (menu.classList.contains('fds-show')) {
                setDropdownPosition();
            }
        });
    });
});