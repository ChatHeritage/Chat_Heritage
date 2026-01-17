import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import App from './App.jsx'
import ChiSiamo from './pages/ChiSiamo.jsx'
import Contatti from './pages/Contatti.jsx'
import { LanguageProvider } from './context/LanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
)
