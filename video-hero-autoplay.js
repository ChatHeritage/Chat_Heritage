/**
 * ================================================================
 * CHAT HERITAGE - VIDEO HERO AUTOPLAY MANAGER
 * File: video-hero-autoplay.js
 * Gestisce l'autoplay forzato del video hero su tutti i dispositivi
 * ================================================================
 */

(function() {
    'use strict';
    
    // Gestione video hero con autoplay SEMPRE ATTIVO
    document.addEventListener('DOMContentLoaded', function() {
        const heroVideo = document.querySelector('.hero-video');
        
        if (!heroVideo) {
            console.warn('Hero video element not found');
            return;
        }
        
        /**
         * Funzione per forzare il play del video
         */
        function forcePlayVideo() {
            heroVideo.play().catch(function(error) {
                console.log('Tentativo play video fallito, riprovo:', error);
                // Se il browser blocca l'autoplay, prova a rimuovere e riaggiungere l'attributo muted
                heroVideo.muted = true;
                heroVideo.play().catch(function(retryError) {
                    console.warn('Impossibile avviare video automaticamente:', retryError);
                });
            });
        }
        
        // Forza il play all'avvio
        forcePlayVideo();
        
        // Gestione errori caricamento video
        heroVideo.addEventListener('error', function() {
            console.warn('Errore caricamento video hero');
            const container = document.querySelector('.hero-video-container');
            if (container) {
                container.classList.add('video-error');
            }
        });
        
        // Forza il play quando il video è pronto
        heroVideo.addEventListener('loadeddata', function() {
            forcePlayVideo();
        });
        
        // Forza il play quando il video è completamente caricato
        heroVideo.addEventListener('canplay', function() {
            forcePlayVideo();
        });
        
        // Gestione visibilità pagina - riavvia il video quando la tab diventa attiva
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && heroVideo.paused) {
                forcePlayVideo();
            }
        });
        
        // Touch/Click fallback per mobile (alcuni browser richiedono interazione utente)
        let userInteracted = false;
        function handleUserInteraction() {
            if (!userInteracted && heroVideo.paused) {
                userInteracted = true;
                forcePlayVideo();
            }
        }
        
        document.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
        document.addEventListener('click', handleUserInteraction, { once: true });
        
        // Controllo periodico per assicurarsi che il video sia sempre in play
        const checkInterval = setInterval(function() {
            if (heroVideo.paused && !document.hidden) {
                forcePlayVideo();
            }
        }, 3000); // Controlla ogni 3 secondi
        
        // Cleanup quando la pagina viene scaricata
        window.addEventListener('beforeunload', function() {
            clearInterval(checkInterval);
        });
        
        console.log('Video hero autoplay manager initialized');
    });
    
})();
