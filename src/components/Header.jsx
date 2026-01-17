import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Logo Component
const Logo = ({ className = "" }) => (
  <img
    src="/logo-chat-heritage.png"
    alt="Chat Heritage"
    className={`h-8 sm:h-12 w-auto ${className}`}
  />
);

// Button Component (per il menu mobile)
const Button = ({ children, variant = "primary", size = "md", className = "", onClick, ...props }) => {
  const variants = {
    whatsapp: "text-white shadow-lg hover:brightness-110",
  };

  const sizes = {
    md: "px-6 py-3 text-base",
  };

  const whatsappStyle = variant === "whatsapp" ? {
    backgroundColor: "rgb(37, 211, 102)",
    boxShadow: "0 10px 15px -3px rgba(37, 211, 102, 0.3)"
  } : {};

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-full font-semibold
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        flex items-center justify-center gap-2
        ${className}
      `}
      style={whatsappStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Language Selector Component
const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLang, setLanguage } = useLanguage();

  const languages = [
    { code: 'IT', name: 'Italiano', flagUrl: 'https://flagcdn.com/w40/it.png' },
    { code: 'EN', name: 'English', flagUrl: 'https://flagcdn.com/w40/gb.png' },
    { code: 'DE', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w40/de.png' },
    { code: 'FR', name: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' },
    { code: 'ES', name: 'Español', flagUrl: 'https://flagcdn.com/w40/es.png' },
    { code: 'RU', name: 'Русский', flagUrl: 'https://flagcdn.com/w40/ru.png' },
    { code: 'ZH', name: '中文', flagUrl: 'https://flagcdn.com/w40/cn.png' }
  ];

  const currentLangData = languages.find(l => l.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:bg-gray-100 text-gray-700"
      >
        <img
          src={currentLangData.flagUrl}
          alt={currentLangData.name}
          className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
        />
        <span className="text-sm font-medium">{currentLangData.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`
        absolute top-full right-0 mt-2
        backdrop-blur-xl bg-white border border-gray-100
        rounded-2xl shadow-xl overflow-hidden
        transition-all duration-300 origin-top-right z-50
        ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
      `}>
        <div className="py-2 px-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl
                transition-all duration-200 text-left
                ${currentLang === lang.code
                  ? 'bg-gradient-to-r from-violet-50 to-pink-50'
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <img
                src={lang.flagUrl}
                alt={lang.name}
                className={`w-7 h-7 rounded-full object-cover ring-2 ${
                  currentLang === lang.code
                    ? 'ring-violet-400'
                    : 'ring-gray-200'
                }`}
              />
              <span className={`text-sm font-medium ${
                currentLang === lang.code
                  ? 'text-violet-600'
                  : 'text-gray-600'
              }`}>
                {lang.code}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default function Header({ onScrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funzione per scrollare quando si arriva da altre pagine (parte da scrollY = 0)
  const scrollFromOtherPage = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const scrollMargin = 15;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - scrollMargin;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Funzione per scrollare quando si è già in Home Page
  const scrollFromHomePage = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const scrollMargin = 65;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - scrollMargin;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    if (isHomePage) {
      scrollFromHomePage(sectionId);
    } else {
      sessionStorage.setItem('scrollToSection', sectionId);
      navigate('/');
    }
  };

  // Controlla se c'è una sezione da scrollare dopo la navigazione
  useEffect(() => {
    const sectionId = sessionStorage.getItem('scrollToSection');
    if (sectionId && isHomePage) {
      sessionStorage.removeItem('scrollToSection');

      // Forza scroll a 0
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      setTimeout(() => {
        scrollFromOtherPage(sectionId);
      }, 100);
    }
  }, [isHomePage, location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#F8F7F4] ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/chi-siamo" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">{t('nav.chiSiamo')}</Link>
            <button onClick={() => handleNavClick('come-funziona')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">{t('nav.comeFunziona')}</button>
            <button onClick={() => handleNavClick('percorsi')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">{t('nav.percorsi')}</button>
            <button onClick={() => handleNavClick('faq')} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">{t('nav.faq')}</button>
            <Link to="/contatti" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="text-gray-600 hover:text-purple-600 font-medium transition-colors">{t('nav.contatti')}</Link>
          </nav>

          {/* Language Selector - desktop */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          {/* Mobile: Language Selector + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-50 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-20 border-b border-gray-100">
          <Link 
            to="/"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo-chat-heritage.png"
              alt="Chat Heritage"
              className="h-8 sm:h-12 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Chiudi menu"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="flex flex-col px-4 sm:px-6 py-6">
          <Link
            to="/chi-siamo"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="flex items-center justify-between py-4 border-b border-gray-100 text-gray-900 font-medium text-lg hover:text-purple-600 transition-colors"
          >
            {t('nav.chiSiamo')}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <button
            onClick={() => handleNavClick('come-funziona')}
            className="flex items-center justify-between py-4 border-b border-gray-100 text-gray-900 font-medium text-lg hover:text-purple-600 transition-colors"
          >
            {t('nav.comeFunziona')}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => handleNavClick('percorsi')}
            className="flex items-center justify-between py-4 border-b border-gray-100 text-gray-900 font-medium text-lg hover:text-purple-600 transition-colors"
          >
            {t('nav.percorsi')}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="flex items-center justify-between py-4 border-b border-gray-100 text-gray-900 font-medium text-lg hover:text-purple-600 transition-colors"
          >
            {t('nav.faq')}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <Link
            to="/contatti"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="flex items-center justify-between py-4 text-gray-900 font-medium text-lg hover:text-purple-600 transition-colors"
          >
            {t('nav.contatti')}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 py-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="whatsapp"
              size="md"
              onClick={() => { setIsMenuOpen(false); window.open('https://wa.me/393514312461?text=START%20CHAT%20%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%3E', '_blank'); }}
            >
              <img src="/WHITELOGOWA.png" alt="WhatsApp" className="w-5 h-5" />
              {t('nav.iniziaGratis')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
