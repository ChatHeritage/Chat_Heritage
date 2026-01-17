# Chat Heritage - Sito Web

Sito web moderno per Chat Heritage, la guida digitale di Venezia su WhatsApp.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool velocissimo
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icone moderne

## 📦 Installazione

### Prerequisiti
- Node.js 18+ installato
- npm o yarn

### Passi

1. **Apri il terminale in Visual Studio Code** (Terminal > New Terminal)

2. **Naviga nella cartella del progetto** (se non ci sei già):
   ```bash
   cd chat-heritage-project
   ```

3. **Installa le dipendenze**:
   ```bash
   npm install
   ```

4. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

5. **Apri il browser** su `http://localhost:3000`

## 📁 Struttura del Progetto

```
chat-heritage-project/
├── public/
│   └── logo-chat-heritage.png    # Logo ufficiale
├── src/
│   ├── App.jsx                   # Componente principale
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Stili globali + Tailwind
├── index.html                    # HTML template
├── package.json                  # Dipendenze
├── vite.config.js               # Configurazione Vite
├── tailwind.config.js           # Configurazione Tailwind
└── postcss.config.js            # Configurazione PostCSS
```

## 🎨 Personalizzazione

### Colori
I colori sono definiti in `tailwind.config.js` nella sezione `colors`.

### Font
Usa Google Fonts:
- **DM Sans** - Testo corpo
- **Outfit** - Titoli display

### Componenti
Tutti i componenti sono in `src/App.jsx`:
- `Logo` - Logo del brand
- `LeoMascot` - Mascotte Leo
- `GlassCard` - Card con effetto vetro
- `Button` - Pulsanti (4 varianti)
- `PhoneMockup` - Mockup iPhone con WhatsApp
- `TourCard` - Card dei percorsi
- `TestimonialCard` - Card testimonianze
- `FAQItem` - Accordion FAQ

## 🔧 Comandi Disponibili

```bash
# Sviluppo
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## 📱 Responsive

Il sito è completamente responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌐 Deploy

Per deployare su Vercel, Netlify o altro:

1. Esegui `npm run build`
2. Carica la cartella `dist/` generata
3. Oppure connetti il repository Git per deploy automatico

## 📝 Note

- Il numero WhatsApp nel pulsante CTA va sostituito con quello reale
- Le immagini usano Unsplash come placeholder
- Il logo viene caricato da `/public/logo-chat-heritage.png`

---

Made with ❤️ for Chat Heritage
