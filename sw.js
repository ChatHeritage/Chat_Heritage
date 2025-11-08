// sw.js - Service Worker per Chat Heritage
// Versione: 1.0.1 - Ottimizzata

const CACHE_NAME = 'chat-heritage-v1.0.1';
const OFFLINE_CACHE = 'chat-heritage-offline-v1';

// Risorse critiche da cachare immediatamente
const CRITICAL_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/style.css',
  '/media_queries.css',
  '/script.js',
  '/script_lingue.js',
  '/translations/translations.json', // ✅ AGGIUNGILO QUI
  '/manifest.json',
  // Immagini critiche
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/Logo_Chat_Heritage.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/FAVICON_CHAT_HERITAGE.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/LEOPRESENTAZIONEHERO-2.png'
];

// Struttura per la cache delle immagini
const IMAGE_CACHE_STRATEGY = {
  maxEntries: 50,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 giorni
  purgeOnQuotaError: true
};

// Immagini da cachare con lazy loading
const LAZY_CACHE_RESOURCES = [
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/LEONE_MARKER-IPHONE-1.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/LEONE_MARKER-IPHONE-2.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/GIF_STEP_3%2B4.gif',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/compress-DORSODURO_CARD.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/compress-SANMARCO_CARD.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/compress-CANNAREGIO_CARD.png',
  'https://raw.githubusercontent.com/ChatHeritage/Chat_Heritage-home/refs/heads/main/img/compress-RIALTO_SANMARCO_CARD.png'
];

// Risorse da cachare con strategia network-first
const DYNAMIC_CACHE_RESOURCES = [
  'https://fonts.googleapis.com/',
  'https://flagsapi.com/'
];

// Pagina offline di fallback
const OFFLINE_FALLBACK_PAGE = '/offline.html';

// ================================================================
// INSTALLAZIONE SERVICE WORKER
// ================================================================

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache risorse critiche
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Caching critical resources...');
        return cache.addAll(CRITICAL_CACHE_RESOURCES);
      }),
      
      // Pre-cache immagini in background (non blocca installazione)
      caches.open(CACHE_NAME).then(cache => {
        console.log('🖼️ Pre-caching images...');
        return Promise.allSettled(
          LAZY_CACHE_RESOURCES.map(url => 
            cache.add(url).catch(err => 
              console.log(`⚠️ Failed to cache ${url}:`, err)
            )
          )
        );
      })
    ])
    .then(() => {
      console.log('✅ Critical resources cached successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('❌ Failed to cache critical resources:', error);
    })
  );
});

// ================================================================
// ATTIVAZIONE SERVICE WORKER
// ================================================================

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Pulizia vecchie cache
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prende controllo di tutte le pagine
      self.clients.claim()
    ])
    .then(() => {
      console.log('✅ Service Worker activated successfully');
    })
  );
});

// ================================================================
// GESTIONE FETCH CON STRATEGIE MULTIPLE
// ================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo per richieste HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  // Gestione speciale per immagini GitHub
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(handleGitHubImages(request));
    return;
  }
  
  // Gestione speciale per flagsapi
  if (url.hostname === 'flagsapi.com') {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }
  
  // Strategia per documenti HTML
  if (request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }
  
  // Strategia per immagini - Cache First
  if (request.destination === 'image') {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }
  
  // Strategia per CSS/JS - Stale While Revalidate
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Strategia per font - Cache First
  if (request.destination === 'font') {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }
  
  // Default: Network First
  event.respondWith(networkFirstWithOfflineFallback(request));
});

// ================================================================
// STRATEGIE DI CACHE OTTIMIZZATE
// ================================================================

/**
 * Gestione speciale per immagini GitHub con timeout
 */
async function handleGitHubImages(request) {
  try {
    // Prova cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Rivalida in background se l'immagine è vecchia (24h)
      const cacheDate = cachedResponse.headers.get('date');
      if (cacheDate) {
        const ageInHours = (Date.now() - new Date(cacheDate)) / (1000 * 60 * 60);
        if (ageInHours > 24) {
          // Aggiorna cache in background
          fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => cache.put(request, response));
            }
          }).catch(() => {}); // Silent fail
        }
      }
      return cachedResponse;
    }
    
    // Se non in cache, prova rete con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('❌ GitHub image failed:', request.url.split('/').pop());
    return createImageFallback();
  }
}

/**
 * Crea fallback SVG migliorato
 */
function createImageFallback() {
  const fallbackSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8e5edc;stop-opacity:0.1" />
          <stop offset="50%" style="stop-color:#408daa;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#02be65;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#bg)"/>
      <circle cx="150" cy="80" r="25" fill="#d1d5db" opacity="0.7"/>
      <rect x="100" y="120" width="100" height="8" fill="#d1d5db" rx="4" opacity="0.7"/>
      <rect x="120" y="140" width="60" height="6" fill="#e5e7eb" rx="3" opacity="0.5"/>
      <text x="150" y="170" text-anchor="middle" fill="#6b7280" font-family="system-ui, sans-serif" font-size="12" opacity="0.8">Chat Heritage</text>
    </svg>
  `;
  
  return new Response(fallbackSVG, {
    headers: { 
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
    }
  });
}

/**
 * Network First con fallback offline ottimizzato
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    // Timeout più aggressivo per documenti
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const networkResponse = await fetch(request, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', request.url);
    
    // Fallback alla cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se è una navigazione e non c'è cache, mostra pagina offline
    if (request.destination === 'document') {
      const offlineResponse = await caches.match(OFFLINE_FALLBACK_PAGE);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Ultimo fallback
    return new Response('Offline - Contenuto non disponibile', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/**
 * Cache First con fallback di rete ottimizzato
 */
async function cacheFirstWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('❌ Failed to fetch:', request.url);
    
    // Fallback per immagini
    if (request.destination === 'image') {
      return createImageFallback();
    }
    
    return new Response('Risorsa non disponibile', {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

/**
 * Stale While Revalidate ottimizzato
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background per aggiornare la cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.log('Background fetch failed:', error);
  });
  
  // Restituisci dalla cache se disponibile, altrimenti aspetta il fetch
  return cachedResponse || fetchPromise;
}

// ================================================================
// RESTO DEL CODICE (INVARIATO)
// ================================================================

// Gestione messaggi dal client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      event.ports[0].postMessage({
        cached: CRITICAL_CACHE_RESOURCES.length,
        version: CACHE_NAME
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'newsletter-signup') {
    event.waitUntil(syncNewsletterSignup());
  }
});

async function syncNewsletterSignup() {
  try {
    const db = await openDB();
    const pendingSignups = await db.getAll('pendingSignups');
    
    for (const signup of pendingSignups) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signup.data)
        });
        
        if (response.ok) {
          await db.delete('pendingSignups', signup.id);
          console.log('✅ Newsletter signup synced');
        }
      } catch (error) {
        console.log('❌ Failed to sync signup:', error);
      }
    }
  } catch (error) {
    console.log('❌ Background sync failed:', error);
  }
}

// IndexedDB wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChatHeritageDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSignups')) {
        const store = db.createObjectStore('pendingSignups', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nuove novità da Chat Heritage!',
      icon: '/img/icon-192x192.png',
      badge: '/img/badge-72x72.png',
      tag: data.tag || 'chat-heritage-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Visualizza',
          icon: '/img/view-icon.png'
        },
        {
          action: 'dismiss',
          title: 'Chiudi',
          icon: '/img/close-icon.png'
        }
      ],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Chat Heritage', options)
    );
    
  } catch (error) {
    console.error('❌ Push notification error:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

console.log('🎉 Chat Heritage Service Worker v1.0.1 loaded successfully!');