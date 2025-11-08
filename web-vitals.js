/**
 * ================================================================
 * CHAT HERITAGE - WEB VITALS MONITOR
 * File: web-vitals.js
 * Version: 1.0.0
 * Standalone module per monitoraggio Web Vitals
 * ================================================================
 */

(function(window, document, undefined) {
    'use strict';

    // ================================================================
    // CONFIGURAZIONE
    // ================================================================
    
    const WEB_VITALS_CONFIG = {
        // Abilita/disabilita il monitoraggio
        enabled: true,
        
        // Debug mode
        debug: true,
        
        // Invio automatico dopo X millisecondi
        autoSendDelay: 10000, // 10 secondi
        
        // Endpoint personalizzato (opzionale)
        customEndpoint: null, // es: '/api/vitals'
        
        // Google Analytics
        sendToGA: true,
        
        // Soglie Core Web Vitals (valori Google ufficiali)
        thresholds: {
            lcp: { good: 2500, poor: 4000 },     // ms
            fid: { good: 100, poor: 300 },       // ms  
            cls: { good: 0.1, poor: 0.25 },      // score
            fcp: { good: 1800, poor: 3000 },     // ms
            ttfb: { good: 800, poor: 1800 }      // ms
        }
    };

    // ================================================================
    // WEB VITALS MONITOR CLASS
    // ================================================================
    
    class WebVitalsMonitor {
        constructor(config = {}) {
            // Merge configurazione
            this.config = { ...WEB_VITALS_CONFIG, ...config };
            
            // Storage metriche
            this.vitals = {
                lcp: null,
                fid: null, 
                cls: null,
                fcp: null,
                ttfb: null
            };
            
            // Observers
            this.observers = [];
            
            // Stato
            this.isInitialized = false;
            this.hasSentReport = false;
            
            // Auto-inizializzazione se abilitato
            if (this.config.enabled) {
                this.init();
            }
        }

        /**
         * Inizializzazione principale
         */
        init() {
            if (this.isInitialized) return;
            
            try {
                // Verifica supporto browser
                if (!this.checkBrowserSupport()) {
                    console.warn('🚫 Web Vitals: Browser non supportato');
                    return;
                }

                this.log('🚀 Web Vitals Monitor inizializzato');
                
                // Inizializza tutti i monitoraggi
                this.initLCP();
                this.initFID();
                this.initCLS();
                this.initFCP();
                this.initTTFB();
                
                // Auto-invio dopo delay configurato
                if (this.config.autoSendDelay > 0) {
                    setTimeout(() => {
                        this.sendReport();
                    }, this.config.autoSendDelay);
                }
                
                // Invio al cambio pagina (per SPA)
                this.setupPageChangeHandler();
                
                this.isInitialized = true;
                this.log('✅ Tutti i Web Vitals sono attivi');
                
            } catch (error) {
                console.error('❌ Errore inizializzazione Web Vitals:', error);
            }
        }

        /**
         * Verifica supporto browser
         */
        checkBrowserSupport() {
            return (
                'PerformanceObserver' in window &&
                'performance' in window &&
                typeof PerformanceObserver.supportedEntryTypes === 'object'
            );
        }

        /**
         * 1. LARGEST CONTENTFUL PAINT (LCP)
         */
        initLCP() {
            if (!this.isEntryTypeSupported('largest-contentful-paint')) return;
            
            try {
                const observer = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    this.vitals.lcp = lastEntry.startTime;
                    this.log(`🖼️  LCP: ${Math.round(lastEntry.startTime)}ms`);
                    
                    // Trigger evento personalizzato
                    this.dispatchVitalEvent('lcp', lastEntry.startTime);
                });

                observer.observe({ type: 'largest-contentful-paint', buffered: true });
                this.observers.push(observer);
                
            } catch (error) {
                console.warn('❌ LCP monitoring failed:', error);
            }
        }

        /**
         * 2. FIRST INPUT DELAY (FID)
         */
        initFID() {
            if (!this.isEntryTypeSupported('first-input')) return;
            
            try {
                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        const fid = entry.processingStart - entry.startTime;
                        this.vitals.fid = fid;
                        this.log(`⚡ FID: ${Math.round(fid)}ms`);
                        
                        // Trigger evento personalizzato
                        this.dispatchVitalEvent('fid', fid);
                    }
                });

                observer.observe({ type: 'first-input', buffered: true });
                this.observers.push(observer);
                
            } catch (error) {
                console.warn('❌ FID monitoring failed:', error);
            }
        }

        /**
         * 3. CUMULATIVE LAYOUT SHIFT (CLS)
         */
        initCLS() {
            if (!this.isEntryTypeSupported('layout-shift')) return;
            
            try {
                let clsValue = 0;
                let sessionValue = 0;
                let sessionEntries = [];

                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        // Solo layout shift non causati dall'utente
                        if (!entry.hadRecentInput) {
                            const firstSessionEntry = sessionEntries[0];
                            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                            // Gestione sessioni di layout shift
                            if (sessionValue &&
                                entry.startTime - lastSessionEntry.startTime < 1000 &&
                                entry.startTime - firstSessionEntry.startTime < 5000) {
                                sessionValue += entry.value;
                                sessionEntries.push(entry);
                            } else {
                                sessionValue = entry.value;
                                sessionEntries = [entry];
                            }

                            // Aggiorna CLS se la sessione corrente è maggiore
                            if (sessionValue > clsValue) {
                                clsValue = sessionValue;
                                this.vitals.cls = clsValue;
                                this.log(`📐 CLS: ${clsValue.toFixed(4)}`);
                                
                                // Trigger evento personalizzato
                                this.dispatchVitalEvent('cls', clsValue);
                            }
                        }
                    }
                });

                observer.observe({ type: 'layout-shift', buffered: true });
                this.observers.push(observer);
                
            } catch (error) {
                console.warn('❌ CLS monitoring failed:', error);
            }
        }

        /**
         * 4. FIRST CONTENTFUL PAINT (FCP)
         */
        initFCP() {
            if (!this.isEntryTypeSupported('paint')) return;
            
            try {
                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.vitals.fcp = entry.startTime;
                            this.log(`🎨 FCP: ${Math.round(entry.startTime)}ms`);
                            
                            // Trigger evento personalizzato
                            this.dispatchVitalEvent('fcp', entry.startTime);
                        }
                    }
                });

                observer.observe({ type: 'paint', buffered: true });
                this.observers.push(observer);
                
            } catch (error) {
                console.warn('❌ FCP monitoring failed:', error);
            }
        }

        /**
         * 5. TIME TO FIRST BYTE (TTFB)
         */
        initTTFB() {
            try {
                // Calcola TTFB quando il documento è caricato
                const calculateTTFB = () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        const ttfb = navigation.responseStart - navigation.requestStart;
                        this.vitals.ttfb = ttfb;
                        this.log(`🌐 TTFB: ${Math.round(ttfb)}ms`);
                        
                        // Trigger evento personalizzato
                        this.dispatchVitalEvent('ttfb', ttfb);
                    }
                };

                if (document.readyState === 'loading') {
                    window.addEventListener('load', calculateTTFB);
                } else {
                    calculateTTFB();
                }
                
            } catch (error) {
                console.warn('❌ TTFB monitoring failed:', error);
            }
        }

        /**
         * Verifica se un tipo di entry è supportato
         */
        isEntryTypeSupported(type) {
            return PerformanceObserver.supportedEntryTypes &&
                   PerformanceObserver.supportedEntryTypes.includes(type);
        }

        /**
         * Dispatch evento personalizzato per ogni vital
         */
        dispatchVitalEvent(type, value) {
            const event = new CustomEvent('webVitalMeasured', {
                detail: {
                    type: type.toUpperCase(),
                    value: value,
                    timestamp: Date.now(),
                    rating: this.rateVital(type, value)
                }
            });
            document.dispatchEvent(event);
        }

        /**
         * Valuta una metrica secondo le soglie Google
         */
        rateVital(type, value) {
            const threshold = this.config.thresholds[type];
            if (!threshold) return 'unknown';
            
            if (value <= threshold.good) return 'good';
            if (value <= threshold.poor) return 'needs-improvement';
            return 'poor';
        }

        /**
         * Invia report completo
         */
        sendReport() {
            if (this.hasSentReport) return;
            
            try {
                const report = this.generateReport();
                
                this.log('📊 Generando Web Vitals Report...');
                
                if (this.config.debug) {
                    this.displayReport(report);
                }
                
                // Invia a Google Analytics
                if (this.config.sendToGA) {
                    this.sendToGoogleAnalytics(report);
                }
                
                // Invia a endpoint personalizzato
                if (this.config.customEndpoint) {
                    this.sendToCustomEndpoint(report);
                }
                
                // Trigger evento report
                const event = new CustomEvent('webVitalsReport', {
                    detail: report
                });
                document.dispatchEvent(event);
                
                this.hasSentReport = true;
                this.log('✅ Web Vitals Report inviato');
                
            } catch (error) {
                console.error('❌ Errore invio Web Vitals Report:', error);
            }
        }

        /**
         * Genera report completo
         */
        generateReport() {
            const report = {
                // Metriche Core Web Vitals
                vitals: {},
                
                // Metadata
                metadata: {
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    timestamp: Date.now(),
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    },
                    connection: this.getConnectionInfo(),
                    deviceType: this.getDeviceType()
                },
                
                // Valutazioni
                ratings: {},
                
                // Score complessivo
                overallScore: 0
            };

            // Processa ogni vital
            let validVitals = 0;
            let totalScore = 0;
            
            Object.entries(this.vitals).forEach(([type, value]) => {
                if (value !== null && value !== undefined) {
                    report.vitals[type] = Math.round(value * 100) / 100; // 2 decimali
                    report.ratings[type] = this.rateVital(type, value);
                    
                    // Calcola score (good=1, needs-improvement=0.5, poor=0)
                    const rating = report.ratings[type];
                    const score = rating === 'good' ? 1 : rating === 'needs-improvement' ? 0.5 : 0;
                    totalScore += score;
                    validVitals++;
                }
            });

            // Score complessivo (0-100)
            report.overallScore = validVitals > 0 ? Math.round((totalScore / validVitals) * 100) : 0;
            
            return report;
        }

        /**
         * Mostra report nella console (debug)
         */
        displayReport(report) {
            console.group('📊 Chat Heritage - Web Vitals Report');
            
            console.log('🌐 URL:', report.metadata.url);
            console.log('📱 Device:', report.metadata.deviceType);
            console.log('📊 Overall Score:', `${report.overallScore}/100`);
            
            console.group('🎯 Core Web Vitals');
            Object.entries(report.vitals).forEach(([type, value]) => {
                const rating = report.ratings[type];
                const emoji = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
                const unit = type === 'cls' ? '' : 'ms';
                console.log(`${emoji} ${type.toUpperCase()}: ${value}${unit} (${rating})`);
            });
            console.groupEnd();
            
            console.group('🔍 Raccomandazioni');
            this.generateRecommendations(report).forEach(rec => {
                console.log(`💡 ${rec}`);
            });
            console.groupEnd();
            
            console.groupEnd();
        }

        /**
         * Genera raccomandazioni basate sui risultati
         */
        generateRecommendations(report) {
            const recommendations = [];
            
            Object.entries(report.ratings).forEach(([type, rating]) => {
                if (rating === 'poor') {
                    switch (type) {
                        case 'lcp':
                            recommendations.push('LCP: Ottimizza immagini, usa CDN, migliora server response time');
                            break;
                        case 'fid':
                            recommendations.push('FID: Riduci JavaScript, usa web workers, ottimizza event handlers');
                            break;
                        case 'cls':
                            recommendations.push('CLS: Specifica dimensioni per immagini/video, evita inserimenti dinamici');
                            break;
                        case 'fcp':
                            recommendations.push('FCP: Ottimizza critical rendering path, inline critical CSS');
                            break;
                        case 'ttfb':
                            recommendations.push('TTFB: Migliora server, usa CDN, ottimizza database queries');
                            break;
                    }
                }
            });
            
            if (recommendations.length === 0) {
                recommendations.push('🎉 Ottime prestazioni! Continua così!');
            }
            
            return recommendations;
        }

        /**
         * Invia a Google Analytics
         */
        sendToGoogleAnalytics(report) {
            if (typeof gtag !== 'function') {
                this.log('⚠️  Google Analytics non disponibile');
                return;
            }
            
            try {
                // Invia overall score
                gtag('event', 'web_vitals_score', {
                    value: report.overallScore,
                    custom_parameter_1: report.metadata.deviceType,
                    custom_parameter_2: report.metadata.url
                });
                
                // Invia ogni metrica individualmente
                Object.entries(report.vitals).forEach(([type, value]) => {
                    gtag('event', 'web_vital', {
                        name: type.toUpperCase(),
                        value: Math.round(value),
                        rating: report.ratings[type],
                        metric_id: `${type}_${Date.now()}`
                    });
                });
                
                this.log('📤 Dati inviati a Google Analytics');
                
            } catch (error) {
                console.warn('❌ Errore invio Google Analytics:', error);
            }
        }

        /**
         * Invia a endpoint personalizzato
         */
        async sendToCustomEndpoint(report) {
            try {
                const response = await fetch(this.config.customEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(report)
                });
                
                if (response.ok) {
                    this.log('📤 Dati inviati a endpoint personalizzato');
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
                
            } catch (error) {
                console.warn('❌ Errore invio endpoint personalizzato:', error);
            }
        }

        /**
         * Setup handler per cambio pagina (SPA)
         */
        setupPageChangeHandler() {
            // Per SPA che cambiano URL senza reload
            let lastUrl = window.location.href;
            
            const checkUrlChange = () => {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    this.onPageChange();
                }
            };
            
            // History API
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function(...args) {
                originalPushState.apply(history, args);
                setTimeout(checkUrlChange, 0);
            };
            
            history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                setTimeout(checkUrlChange, 0);
            };
            
            window.addEventListener('popstate', checkUrlChange);
        }

        /**
         * Gestisce cambio pagina
         */
        onPageChange() {
            this.log('🔄 Cambio pagina rilevato - Reset Web Vitals');
            
            // Reset stato per nuova pagina
            this.vitals = {
                lcp: null,
                fid: null,
                cls: null,
                fcp: null,
                ttfb: null
            };
            
            this.hasSentReport = false;
            
            // Reinizializza monitoraggio
            setTimeout(() => {
                this.sendReport();
            }, this.config.autoSendDelay);
        }

        /**
         * Ottieni info connessione
         */
        getConnectionInfo() {
            if ('connection' in navigator) {
                const conn = navigator.connection;
                return {
                    effectiveType: conn.effectiveType,
                    downlink: conn.downlink,
                    rtt: conn.rtt
                };
            }
            return null;
        }

        /**
         * Determina tipo dispositivo
         */
        getDeviceType() {
            const width = window.innerWidth;
            if (width <= 768) return 'mobile';
            if (width <= 1024) return 'tablet';
            return 'desktop';
        }

        /**
         * Logging con controllo debug
         */
        log(message) {
            if (this.config.debug) {
                console.log(`[Web Vitals] ${message}`);
            }
        }

        /**
         * API pubblica - Ottieni metriche correnti
         */
        getVitals() {
            return { ...this.vitals };
        }

        /**
         * API pubblica - Forza invio report
         */
        forceSendReport() {
            this.hasSentReport = false;
            this.sendReport();
        }

        /**
         * API pubblica - Reset monitoraggio
         */
        reset() {
            this.cleanup();
            this.vitals = {
                lcp: null,
                fid: null,
                cls: null,
                fcp: null,
                ttfb: null
            };
            this.hasSentReport = false;
            this.isInitialized = false;
        }

        /**
         * Cleanup
         */
        cleanup() {
            this.observers.forEach(observer => {
                if (observer && observer.disconnect) {
                    observer.disconnect();
                }
            });
            this.observers = [];
        }
    }

    // ================================================================
    // AUTO-INIZIALIZZAZIONE E ESPOSIZIONE API
    // ================================================================

    // Inizializzazione automatica quando DOM è pronto
    function initWebVitals() {
        // Verifica se è già inizializzato
        if (window.ChatHeritageWebVitals) {
            return window.ChatHeritageWebVitals;
        }

        // Crea istanza
        const webVitals = new WebVitalsMonitor();
        
        // Esponi API globale
        window.ChatHeritageWebVitals = {
            // Istanza principale
            instance: webVitals,
            
            // API semplificata
            getVitals: () => webVitals.getVitals(),
            sendReport: () => webVitals.forceSendReport(),
            reset: () => webVitals.reset(),
            
            // Configurazione
            config: webVitals.config,
            
            // Version
            version: '1.0.0'
        };

        // Integrazione con Chat Heritage esistente
        if (window.ChatHeritage) {
            if (!window.ChatHeritage.enhancements) {
                window.ChatHeritage.enhancements = {};
            }
            window.ChatHeritage.enhancements.WebVitalsMonitor = WebVitalsMonitor;
            window.ChatHeritage.webVitals = window.ChatHeritageWebVitals;
        }

        console.log('🚀 Chat Heritage Web Vitals v1.0.0 caricato');
        
        return window.ChatHeritageWebVitals;
    }

    // Auto-inizializzazione
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWebVitals);
    } else {
        initWebVitals();
    }

})(window, document);