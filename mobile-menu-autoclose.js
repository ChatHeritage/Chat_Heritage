/**
 * MOBILE MENU AUTO-CLOSE SCRIPT
 * Chiude automaticamente il menu mobile quando si clicca su un link
 */

document.addEventListener('DOMContentLoaded', function() {
    // Seleziona il checkbox del menu mobile
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    // Seleziona tutti i link nel menu di navigazione
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Se il checkbox esiste
    if (menuToggle) {
        // Aggiungi event listener a ogni link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Chiudi il menu deselezionando il checkbox
                menuToggle.checked = false;
                
                // Opzionale: aggiungi un piccolo ritardo per animazione fluida
                // prima che la navigazione smooth scroll inizi
                setTimeout(function() {
                    // Il link href fa il resto (scroll alla sezione)
                }, 100);
            });
        });
        
        // Opzionale: chiudi il menu anche premendo ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });
    }
});
