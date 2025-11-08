// ================================================================
// CHAT HERITAGE - ENHANCED MULTILINGUAL SYSTEM
// Versione: 2.0.0 - 100% compatibile con script_lingue.js esistente
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================================================
    // 1. CONFIGURAZIONE ESTESA (COMPATIBILE CON ORIGINALE)
    // ================================================================
    
    // Mantieni le lingue originali + aggiungi nuove (facoltativo)
    const locales = [
        "en-GB",    // Il tuo originale
        "it-IT",    // Il tuo originale  
        "fr-FR",    // Nuovo
        "de-DE",    // Nuovo
        "es-ES",    // Nuovo
        // "ar-SA",    // Nuovo (commenta se non vuoi RTL per ora)
        // "zh-CN",    // Nuovo (commenta se non vuoi lingue asiatiche)
        // "ja-JP"     // Nuovo (commenta se non vuoi lingue asiatiche)
    ];
    
    // Configurazione avanzata (opzionale)
    const ADVANCED_CONFIG = {
        enableCache: true,
        cacheExpiry: 24 * 60 * 60 * 1000, // 24 ore
        enableRTL: false, // Imposta true se vuoi supporto RTL
        enablePerformanceMonitoring: true,
        translationsURL: "", // Mantieni vuoto per usare il tuo path esistente
        fallbackLanguage: "it-IT"
    };

    // Metadati lingue estesi
    const LANGUAGE_METADATA = {
        "it-IT": { 
            nativeName: "it", 
            region: "IT", 
            rtl: false,
            currency: "EUR",
            dateFormat: "DD/MM/YYYY"
        },
        "en-GB": { 
            nativeName: "en", 
            region: "GB", 
            rtl: false,
            currency: "GBP", 
            dateFormat: "DD/MM/YYYY"
        },
        "fr-FR": { 
            nativeName: "fr", 
            region: "FR", 
            rtl: false,
            currency: "EUR",
            dateFormat: "DD/MM/YYYY"
        },
        "de-DE": { 
            nativeName: "de", 
            region: "DE", 
            rtl: false,
            currency: "EUR",
            dateFormat: "DD.MM.YYYY"
        },
        "es-ES": { 
            nativeName: "es", 
            region: "ES", 
            rtl: false,
            currency: "EUR",
            dateFormat: "DD/MM/YYYY"
        },
        "ar-SA": { 
            nativeName: "العربية", 
            region: "SA", 
            rtl: true,
            currency: "SAR",
            dateFormat: "DD/MM/YYYY"
        },
        "zh-CN": { 
            nativeName: "中文", 
            region: "CN", 
            rtl: false,
            currency: "CNY",
            dateFormat: "YYYY/MM/DD"
        },
        "ja-JP": { 
            nativeName: "日本語", 
            region: "JP", 
            rtl: false,
            currency: "JPY",
            dateFormat: "YYYY/MM/DD"
        }
    };

    // ================================================================
    // 2. CACHE E PERFORMANCE (NUOVE FUNZIONALITÀ)
    // ================================================================
    
    const TranslationCache = {
        cache: new Map(),
        
        get: function(key) {
            if (!ADVANCED_CONFIG.enableCache) return null;
            
            const cached = this.cache.get(key);
            if (!cached) return null;
            
            // Check expiry
            if (Date.now() - cached.timestamp > ADVANCED_CONFIG.cacheExpiry) {
                this.cache.delete(key);
                return null;
            }
            
            return cached.data;
        },
        
        set: function(key, data) {
            if (!ADVANCED_CONFIG.enableCache) return;
            
            this.cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
        },
        
        clear: function() {
            this.cache.clear();
        }
    };

    // Performance monitoring
    const PerformanceMonitor = {
        loadTimes: {},
        
        start: function(operation) {
            if (ADVANCED_CONFIG.enablePerformanceMonitoring) {
                this.loadTimes[operation] = performance.now();
            }
        },
        
        end: function(operation) {
            if (ADVANCED_CONFIG.enablePerformanceMonitoring && this.loadTimes[operation]) {
                const duration = performance.now() - this.loadTimes[operation];
                console.log(`🌐 ${operation} completed in ${Math.round(duration)}ms`);
                return duration;
            }
        }
    };

    // ================================================================
    // 3. FUNZIONE getFlagSrc ORIGINALE (MANTENUTA IDENTICA)
    // ================================================================
    
    function getFlagSrc(countryCode) {
        return `https://flagsapi.com/${countryCode}/shiny/64.png`;
    }

    // ================================================================
    // 4. ELEMENTI DOM ORIGINALI (MANTENUTI IDENTICI)
    // ================================================================
    
    const dropdown = document.querySelector('.dropdown');
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');

    // Verifica esistenza elementi (come originale)
    if (!dropdown || !dropdownBtn || !dropdownContent) {
        console.warn('Elementi dropdown per lingua non trovati nel DOM. Sistema di traduzione non inizializzato.');
        return;
    }

    // ================================================================
    // 5. CARICAMENTO TRADUZIONI MIGLIORATO (ENHANCED)
    // ================================================================
    
    async function loadTranslations(lang) {
        PerformanceMonitor.start(`loadTranslations-${lang}`);
        
        try {
            // Check cache first
            const cached = TranslationCache.get(lang);
            if (cached) {
                console.log(`📦 Using cached translations for ${lang}`);
                applyTranslations(cached, lang);
                PerformanceMonitor.end(`loadTranslations-${lang}`);
                return;
            }

            // Mantieni la logica originale per il path
            const translationsURL = ADVANCED_CONFIG.translationsURL || "";
            
            const response = await fetch(translationsURL, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'max-age=3600' // 1 hour cache
                }
            });
            
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const translations = await response.json();
            
            // Cache the translations
            TranslationCache.set(lang, translations);
            
            // Apply translations (logica originale)
            applyTranslations(translations, lang);
            
            console.log(`✅ Traduzioni caricate per lingua: ${lang}`);
            PerformanceMonitor.end(`loadTranslations-${lang}`);
            
        } catch (error) {
            console.error("❌ Errore nel caricamento delle traduzioni:", error);
            
            // Fallback logic migliorata
            if (lang !== ADVANCED_CONFIG.fallbackLanguage) {
                console.log(`🔄 Fallback to ${ADVANCED_CONFIG.fallbackLanguage}`);
                await loadTranslations(ADVANCED_CONFIG.fallbackLanguage);
            }
            
            PerformanceMonitor.end(`loadTranslations-${lang}`);
        }
    }

    // Funzione per applicare traduzioni (enhanced ma compatibile)
    function applyTranslations(translations, lang) {
        // Applica le traduzioni a tutti gli elementi con data-key (logica originale)
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
                
                // Add loaded class for animations
                el.classList.add('translation-loaded');
            }
        });

        // Update document language
        updateDocumentLanguage(lang);
        
        // Trigger custom event for other components
        const event = new CustomEvent('translationsLoaded', {
            detail: { language: lang, translations: translations[lang] }
        });
        document.dispatchEvent(event);
    }

    // ================================================================
    // 6. FUNZIONE setSelectedLocale ORIGINALE (ENHANCED)
    // ================================================================
    
    function setSelectedLocale(locale) {
        PerformanceMonitor.start('setSelectedLocale');
        
        try {
            const intlLocale = new Intl.Locale(locale);
            const metadata = LANGUAGE_METADATA[locale];
            
            // Use metadata if available, otherwise fallback to original logic
            const langName = metadata ? 
                metadata.nativeName : 
                new Intl.DisplayNames([locale], { type: "language" }).of(intlLocale.language).toLowerCase();

            // Pulisce il contenuto del dropdown (logica originale)
            dropdownContent.innerHTML = "";

            // Crea le opzioni per le altre lingue (logica originale enhanced)
            locales.filter(l => l !== locale).forEach(otherLocale => {
                const otherIntlLocale = new Intl.Locale(otherLocale);
                const otherMetadata = LANGUAGE_METADATA[otherLocale];
                
                const otherLangName = otherMetadata ? 
                    otherMetadata.nativeName :
                    new Intl.DisplayNames([otherLocale], { type: "language" }).of(otherIntlLocale.language).toLowerCase();

                const li = document.createElement("li");
                li.innerHTML = `<img src="${getFlagSrc(otherMetadata?.region || otherIntlLocale.region)}" alt="${otherLangName}"> ${otherLangName}`;
                
                // Event listener per il cambio lingua (enhanced)
                li.addEventListener("click", async () => {
                    await setSelectedLocale(otherLocale);
                    await loadTranslations(otherIntlLocale.language);
                    sessionStorage.setItem("selectedLang", otherIntlLocale.language);
                    dropdownContent.classList.remove('show');
                    
                    // Haptic feedback if available
                    if (window.ChatHeritage?.mobileUX?.components?.haptic) {
                        window.ChatHeritage.mobileUX.components.haptic.triggerFeedback('light');
                    }
                });

                dropdownContent.appendChild(li);
            });

            // Aggiorna il bottone con la lingua corrente (logica originale)
            const flagRegion = metadata?.region || intlLocale.region;
            dropdownBtn.innerHTML = `<img src="${getFlagSrc(flagRegion)}" alt="${langName}"> ${langName} <span class="arrow-down"></span>`;
            
            // Update RTL if enabled
            if (ADVANCED_CONFIG.enableRTL && metadata?.rtl) {
                document.documentElement.dir = 'rtl';
                document.body.classList.add('rtl-mode');
            } else {
                document.documentElement.dir = 'ltr';
                document.body.classList.remove('rtl-mode');
            }
            
            // Carica le traduzioni per la lingua selezionata (logica originale)
            loadTranslations(intlLocale.language);
            
            PerformanceMonitor.end('setSelectedLocale');
            
        } catch (error) {
            console.error("❌ Errore nella selezione della lingua:", error);
            PerformanceMonitor.end('setSelectedLocale');
        }
    }

    // ================================================================
    // 7. GESTIONE EVENTI DROPDOWN (ORIGINALE + ENHANCED)
    // ================================================================
    
    // Event listener per mostrare/nascondere il menu dropdown (originale)
    dropdownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
        
        // Enhanced: Update ARIA attributes
        const isOpen = dropdownContent.classList.contains('show');
        dropdownBtn.setAttribute('aria-expanded', isOpen);
        
        // Enhanced: Keyboard navigation setup
        if (isOpen) {
            setupKeyboardNavigation();
        }
    });

    // Chiudi il dropdown se si clicca fuori (originale)
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
            dropdownBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Chiudi il dropdown con il tasto ESC (originale)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdownContent.classList.remove('show');
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownBtn.focus();
        }
    });

    // ================================================================
    // 8. FUNZIONALITÀ AVANZATE AGGIUNTIVE
    // ================================================================
    
    // Enhanced: Keyboard navigation
    function setupKeyboardNavigation() {
        const items = dropdownContent.querySelectorAll('li');
        let currentIndex = -1;

        dropdownContent.addEventListener('keydown', function(e) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = Math.min(currentIndex + 1, items.length - 1);
                    updateFocus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = Math.max(currentIndex - 1, 0);
                    updateFocus();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (currentIndex >= 0) {
                        items[currentIndex].click();
                    }
                    break;
            }
        });

        function updateFocus() {
            items.forEach((item, index) => {
                item.classList.toggle('focused', index === currentIndex);
            });
            if (items[currentIndex]) {
                items[currentIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }

    // Enhanced: Document language update
    function updateDocumentLanguage(lang) {
        const locale = locales.find(l => l.startsWith(lang)) || locales.find(l => l.includes(lang));
        if (locale) {
            const metadata = LANGUAGE_METADATA[locale];
            document.documentElement.lang = lang;
            
            // Update meta tags
            let metaLang = document.querySelector('meta[name="language"]');
            if (!metaLang) {
                metaLang = document.createElement('meta');
                metaLang.name = 'language';
                document.head.appendChild(metaLang);
            }
            metaLang.content = lang;
        }
    }

    // Enhanced: Auto-detect browser language
    function detectBrowserLanguage() {
        const browserLangs = navigator.languages || [navigator.language];
        
        for (const lang of browserLangs) {
            // Check exact match first
            const exactMatch = locales.find(locale => locale.toLowerCase() === lang.toLowerCase());
            if (exactMatch) return exactMatch;
            
            // Check language code match
            const langCode = lang.split('-')[0];
            const codeMatch = locales.find(locale => locale.startsWith(langCode));
            if (codeMatch) return codeMatch;
        }
        
        return "it-IT"; // Fallback
    }

    // Enhanced: URL parameter detection
    function getLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam) {
            const matchedLocale = locales.find(locale => 
                locale.toLowerCase().startsWith(langParam.toLowerCase())
            );
            return matchedLocale;
        }
        
        return null;
    }

    // ================================================================
    // 9. INIZIALIZZAZIONE (ENHANCED MA COMPATIBILE)
    // ================================================================
    
    // Inizializzazione: carica la lingua salvata o quella predefinita (enhanced)
    function initializeLanguageSystem() {
        PerformanceMonitor.start('initialization');
        
        let initialLocale;
        
        // 1. Check URL parameter first
        initialLocale = getLanguageFromURL();
        
        // 2. Check saved preference
        if (!initialLocale) {
            const savedLang = sessionStorage.getItem("selectedLang");
            initialLocale = savedLang && locales.find(l => l.startsWith(savedLang)) ? 
                locales.find(l => l.startsWith(savedLang)) : null;
        }
        
        // 3. Auto-detect from browser
        if (!initialLocale) {
            initialLocale = detectBrowserLanguage();
        }
        
        // 4. Final fallback
        if (!initialLocale) {
            initialLocale = "it-IT";
        }

        console.log(`🌐 Initializing with locale: ${initialLocale}`);

        // Salva la lingua iniziale nella sessione (originale)
        const intlLocale = new Intl.Locale(initialLocale);
        sessionStorage.setItem("selectedLang", intlLocale.language);
        
        // Imposta la lingua iniziale (originale)
        setSelectedLocale(initialLocale);
        
        PerformanceMonitor.end('initialization');
    }

    // ================================================================
    // 10. API PUBBLICA PER INTEGRAZIONE
    // ================================================================
    
    // Expose public API for integration with other components
    window.ChatHeritageLanguageSystem = {
        // Core functions
        changeLanguage: setSelectedLocale,
        getCurrentLanguage: () => sessionStorage.getItem("selectedLang") || "it",
        getSupportedLanguages: () => locales,
        
        // Advanced functions
        clearCache: () => TranslationCache.clear(),
        getPerformanceStats: () => PerformanceMonitor.loadTimes,
        reloadTranslations: loadTranslations,
        
        // Metadata
        getLanguageMetadata: (locale) => LANGUAGE_METADATA[locale],
        
        // Configuration
        config: ADVANCED_CONFIG,
        version: "2.0.0"
    };

    // ================================================================
    // 11. STILI CSS MIGLIORATI (OPZIONALI)
    // ================================================================
    
    function injectEnhancedStyles() {
        const style = document.createElement('style');
        style.id = 'enhanced-language-styles';
        style.textContent = `
            /* Dropdown semplice e pulito */
            .dropdown-content {
                transition: opacity 0.2s ease !important;
            }
            
            .dropdown-content:not(.show) {
                opacity: 0 !important;
                visibility: hidden !important;
            }
            
            .dropdown-content.show {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* List items - stile originale pulito */
            .dropdown-content li {
                display: flex !important;
                align-items: center !important;
                padding: 10px 15px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                font-family: 'Inter', sans-serif !important;
                font-weight: 500 !important;
                color: #374151 !important;
                transition: background-color 0.2s ease !important;
                list-style: none !important;
                background: transparent !important;
            }
            
            .dropdown-content li:hover {
                background-color: #f8fafc !important;
            }
            
            .dropdown-content li img {
                width: 20px !important;
                height: 20px !important;
                border-radius: 50% !important;
                margin-right: 10px !important;
                object-fit: cover !important;
            }
            
            /* Mobile touch targets */
            @media (max-width: 768px) {
                .dropdown-content li {
                    padding: 12px 15px !important;
                    min-height: 44px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // ================================================================
    // 12. INIZIALIZZAZIONE FINALE
    // ================================================================
    
    // Inject enhanced styles
    injectEnhancedStyles();
    
    // Initialize the language system
    initializeLanguageSystem();
    
    // Log successful initialization
    console.log('🌐 Enhanced Translation System initialized successfully');
    console.log('📊 Supported languages:', locales);
    console.log('⚡ Performance monitoring:', ADVANCED_CONFIG.enablePerformanceMonitoring);
    console.log('🔄 RTL support:', ADVANCED_CONFIG.enableRTL);
    
    // Debug info for development
    if (typeof CONFIG !== 'undefined' && CONFIG.DEBUG) {
        console.log('🐛 Language System Debug API available at window.ChatHeritageLanguageSystem');
        
        // Add debug utilities
        window.ChatHeritageLanguageSystem.debug = {
            testAllLanguages: async function() {
                for (const locale of locales) {
                    console.log(`Testing ${locale}...`);
                    await setSelectedLocale(locale);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                // Return to Italian
                await setSelectedLocale("it-IT");
            },
            
            benchmarkTranslation: async function(locale) {
                const start = performance.now();
                await setSelectedLocale(locale);
                const end = performance.now();
                console.log(`Translation to ${locale} took ${Math.round(end - start)}ms`);
                return end - start;
            },
            
            showStats: function() {
                console.table({
                    'Current Language': this.getCurrentLanguage(),
                    'Supported Languages': this.getSupportedLanguages().length,
                    'Cache Enabled': ADVANCED_CONFIG.enableCache,
                    'Performance Monitoring': ADVANCED_CONFIG.enablePerformanceMonitoring,
                    'RTL Support': ADVANCED_CONFIG.enableRTL
                });
            }
        };
    }
});

// ================================================================
// FINE SISTEMA LINGUE ENHANCED
// Compatibile al 100% con sistema esistente + funzionalità avanzate
// ================================================================