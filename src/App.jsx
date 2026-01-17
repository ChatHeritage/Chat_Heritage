import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, Play, MapPin, Clock, Star, Check,
  ArrowRight, Award, Quote, Plus, Eye, Navigation, HelpCircle,
  BookOpen
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useContentProtection } from './hooks/useContentProtection';

// ============================================
// COMPONENTS
// ============================================

// Animated Background
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* DECORATIVE BLOBS - Uncomment to re-enable
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
    */}
  </div>
);

// Glass Card Component
const GlassCard = ({ children, className = "", hover = true }) => (
  <div className={`
    backdrop-blur-xl bg-white/70 border border-white/20
    rounded-3xl shadow-xl
    ${hover ? 'hover:bg-white/80 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Gradient Text
const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

// Button Component
const Button = React.forwardRef(({ children, variant = "primary", size = "md", className = "", onClick, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    whatsapp: "text-white shadow-lg hover:brightness-110",
    secondary: "bg-white/80 backdrop-blur-sm text-gray-600 border-2 border-gray-200 hover:border-purple-400 hover:text-purple-600",
    outline: "bg-transparent border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-6 py-4 text-base sm:px-8 sm:py-4 sm:text-lg"
  };

  const whatsappStyle = variant === "whatsapp" ? {
    backgroundColor: "rgb(37, 211, 102)",
    boxShadow: "0 10px 15px -3px rgba(37, 211, 102, 0.3)"
  } : {};

  return (
    <button
      ref={ref}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-full ${variant === 'secondary' ? 'font-normal' : 'font-semibold'}
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
});
Button.displayName = "Button";

// Phone Mockup Component
const PhoneMockup = () => (
  <div className="relative w-full flex justify-center lg:justify-end -mt-6 sm:mt-0">
    <img
      src="/LEOMOKUPIPHONE-3.png"
      alt="Chat Heritage - Leo su WhatsApp"
      className="
        w-80 max-w-[85vw]
        sm:w-72 sm:max-w-[50vw]
        md:w-80 md:max-w-[45vw]
        lg:w-96 lg:max-w-[40vw]
        xl:w-[420px] xl:max-w-[35vw]
        2xl:w-[480px] 2xl:max-w-[30vw]
        h-auto object-contain drop-shadow-2xl
      "
    />
  </div>
);

// Category styles mapping
const categoryStyles = {
  monuments: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-300',
    icon: '🏛️'
  },
  mysteries: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    icon: '🔮'
  },
  nature: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    icon: '🌿'
  },
  food: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-300',
    icon: '🍷'
  },
  art: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    icon: '🎨'
  }
};

// Tour Card
const TourCard = ({ title, category, categoryType = 'monuments', description, duration, stops, stopsLabel, price, priceLabel, badge, gradient, image, comingSoon = false, comingSoonLabel = 'Coming Soon' }) => {
  const catStyle = categoryStyles[categoryType] || categoryStyles.monuments;

  return (
  <GlassCard className={`overflow-hidden group shadow-[0_4px_0_0_#c4b5fd,0_8px_20px_rgba(139,92,246,0.15)] hover:shadow-[0_6px_0_0_#a78bfa,0_12px_30px_rgba(139,92,246,0.25)] hover:-translate-y-1 transition-all duration-300 ${comingSoon ? 'relative' : ''}`}>
    <div className={`h-48 ${gradient || ''} relative overflow-hidden`}>
      {image && <img src={image} alt={title} className={`absolute inset-0 w-full h-full object-cover ${comingSoon ? 'grayscale' : ''}`} />}
      <div className={`absolute inset-0 ${comingSoon ? 'bg-black/50' : 'bg-black/20'}`}></div>
      {!comingSoon && (
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800">
            {badge}
          </span>
        </div>
      )}
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform -rotate-12">
            <div className="relative px-6 py-3 border-4 border-white rounded-sm bg-transparent">
              <div className="absolute inset-1 border-2 border-white rounded-sm opacity-60"></div>
              <span className="relative text-white text-xl tracking-wider uppercase"
                    style={{
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      fontFamily: '"Courier New", Courier, monospace',
                      fontWeight: '700',
                      letterSpacing: '0.15em'
                    }}>
                {comingSoonLabel}
              </span>
            </div>
            <div className="absolute inset-0 opacity-20"
                 style={{
                   background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)'
                 }}>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className={`p-6 ${comingSoon ? 'opacity-60' : ''}`}>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border} mb-2`}>
        {catStyle.icon} {category}
      </span>
      <h3 className="text-gray-800 text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {stops} {stopsLabel}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            {comingSoon ? '---' : price}
          </span>
          <span className="text-gray-400 text-sm">{priceLabel}</span>
        </div>
      </div>
    </div>
  </GlassCard>
  );
};

// Testimonial Card
const TestimonialCard = ({ text, author, location, avatar }) => (
  <GlassCard className="p-6">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <Quote className="w-8 h-8 text-purple-200 mb-2" />
    <p className="text-gray-700 mb-4 italic">"{text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-bold">
        {avatar}
      </div>
      <div>
        <div className="font-semibold text-gray-800">{author}</div>
        <div className="text-sm text-gray-500">{location}</div>
      </div>
    </div>
  </GlassCard>
);

// FAQ Item
const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left group"
    >
      <span className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors pr-4">
        {question}
      </span>
      <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center text-white transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
        <Plus className="w-5 h-5" />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  </div>
);

// Section Header
const SectionHeader = ({ eyebrow, eyebrowColor, title, titleHighlight, subtitle }) => (
  <div className="text-center mb-16">
    {eyebrow && (
      <span className={`inline-block px-4 py-1 ${eyebrowColor} rounded-full text-sm font-semibold mb-4`}>
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
      {title} <GradientText>{titleHighlight}</GradientText>
    </h2>
    {subtitle && (
      <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

export default function App() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const heroBtnRef = useRef(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { t, currentLang } = useLanguage();

  // Attiva protezione contenuti (no click destro, no copia, no selezione)
  useContentProtection();

  // Swipe handlers for mobile carousel
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Intersection Observer per il pulsante WhatsApp nella Hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-80px 0px -80px 0px"
      }
    );

    if (heroBtnRef.current) {
      observer.observe(heroBtnRef.current);
    }

    return () => {
      if (heroBtnRef.current) {
        observer.unobserve(heroBtnRef.current);
      }
    };
  }, []);

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const isMobile = window.innerWidth < 640;
      const mobileMargin = -15;
      const offset = headerHeight + (isMobile ? mobileMargin : 0);

      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* ============================================
          STICKY MOBILE CTA
          Appears only on mobile when scrolled
          ============================================ */}
      <div className={`
        fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200
        md:hidden z-40 transition-all duration-500 transform
        ${showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}>
        <Button variant="whatsapp" size="md" className="w-full shadow-xl" onClick={() => window.open('https://wa.me/393514312461?text=START%20CHAT%20%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%3E', '_blank')}>
          <img src="/WHITELOGOWA.png" alt="WhatsApp" className="w-5 h-5" />
          {t('cta.stickyButton')}
        </Button>
      </div>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center sm:items-start lg:items-center pt-7 sm:pt-16 lg:pt-20 overflow-hidden bg-[#F8F7F4]">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:py-6 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-4 lg:mb-6 leading-tight">
                {t('hero.title1')}<br/>
                <GradientText>{t('hero.title2')}</GradientText>
              </h1>

              <p className="text-lg text-gray-600 mb-8 sm:mb-4 lg:mb-8 max-w-xl mx-auto lg:mx-0">
                <span className="sm:hidden">
                  {['ES', 'FR'].includes(currentLang) ? (
                    <>
                      <strong>{t('hero.subtitleHighlight')}</strong>{t('hero.subtitleEnd')}<strong>{t('hero.subtitleWhatsApp')}</strong>,<br />
                      {t('hero.subtitleFinal').replace(/^,\s*/, '')}
                    </>
                  ) : (
                    <>
                      <strong>{t('hero.subtitleHighlight')}</strong>{t('hero.subtitleEnd')}<strong>{t('hero.subtitleWhatsApp')}</strong>,<br />
                      {t('hero.subtitleLine1')}<br />
                      {t('hero.subtitleLine2')}
                    </>
                  )}
                </span>
                <span className="hidden sm:inline">
                  <strong>{t('hero.subtitleHighlight')}</strong>{t('hero.subtitleEnd')}<strong>{t('hero.subtitleWhatsApp')}</strong>{t('hero.subtitleFinal')}
                </span>
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-4 sm:mb-3 lg:mb-8">
                {[
                  t('hero.badge1'),
                  t('hero.badge2'),
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{t('hero.badge3')}</span>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-3">
                <div className="flex flex-row items-stretch justify-center lg:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
                  <Button variant="whatsapp" size="lg" className="flex-1 sm:flex-none" ref={heroBtnRef} onClick={() => window.open('https://wa.me/393514312461?text=START%20CHAT%20%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%3E', '_blank')}>
                    <img src="/WHITELOGOWA.png" alt="WhatsApp" className="w-5 h-5" />
                    {t('hero.ctaWhatsapp')}
                  </Button>
                </div>
                <div className="flex lg:hidden items-center gap-1.5 text-xs text-gray-500">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{t('hero.badge3')}</span>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="w-full">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PROBLEM SECTION
          ============================================ */}
      <section className="py-8 sm:py-16 lg:py-24 relative bg-[#F8F7F4]" id="problema">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            {/* Image */}
            <div className="relative group order-2 lg:order-1 flex justify-center items-center py-4 sm:py-8 -mt-6 sm:-mt-10 md:-mt-12 lg:mt-0">
              <div
                className="relative transform rotate-[-3deg] hover:rotate-[-1deg] transition-transform duration-500 ease-out w-72 sm:w-96 lg:w-[450px]"
                style={{ perspective: '1000px' }}
              >
                <div
                  className="absolute -bottom-4 left-4 right-4 h-8 bg-black/30 blur-xl rounded-full transform skewX(-3deg)"
                  style={{ filter: 'blur(20px)' }}
                ></div>

                <div className="relative bg-white p-1.5 sm:p-4 rounded-sm shadow-2xl"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 12px 24px -8px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src="/TURISTIDISPERATI.png"
                      alt="Turisti a Venezia"
                      className="w-full h-52 sm:h-72 lg:h-[340px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 50%, rgba(255,255,255,0.05) 80%, rgba(255,255,255,0.2) 100%)'
                      }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)'
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-16 left-0 right-0 h-16 opacity-20 pointer-events-none overflow-hidden rounded-sm"
                  style={{
                    transform: 'scaleY(-1) perspective(500px) rotateX(30deg)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)'
                  }}
                >
                  <div className="bg-white p-1.5 sm:p-4">
                    <div className="h-52 sm:h-72 lg:h-[340px] bg-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {t('problem.title')}<br/>
                <span className="text-red-500">{t('problem.titleHighlight')}</span>
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {t('problem.subtitle')}
                <span className="lg:hidden"><br /></span>
                <span className="hidden lg:inline"> </span>
                {t('problem.subtitleLine2')}
              </p>

              <div className="space-y-6">
                {[
                  { icon: Clock, title: t('problem.issue1Title'), desc: t('problem.issue1Desc') },
                  { icon: BookOpen, title: t('problem.issue2Title'), desc: t('problem.issue2Desc') },
                  { icon: HelpCircle, title: t('problem.issue3Title'), desc: t('problem.issue3Desc') }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 transition-colors">
                      <item.icon className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SOLUTION SECTION
          ============================================ */}
      <section
        className="relative"
        id="chi-siamo"
        style={{
          '--skew-top': '5%',
          '--skew-bottom': '20%'
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#4361ee] to-[#2ec4b6]"
          style={{
            clipPath: 'polygon(0 0, 100% var(--skew-top), 100% calc(100% - var(--skew-bottom)), 0 100%)'
          }}
          aria-hidden="true"
        >
          <AnimatedBackground />
        </div>

        <div className="relative z-10 py-12 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                  {t('solution.title')}<br/>
                  <span className="text-amber-300">{t('solution.titleHighlight')}</span>
                </h2>
                <p className="text-white/80 mb-6 sm:mb-8 text-lg">
                  {t('solution.subtitle')}
                </p>

                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  {[
                    { title: t('solution.step1Title'), desc: t('solution.step1Desc') },
                    { title: t('solution.step2Title'), desc: t('solution.step2Desc') },
                    { title: t('solution.step3Title'), desc: t('solution.step3Desc') }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/30">
                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-white/80 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center -mx-4 sm:mx-0">
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full transform scale-90 hidden sm:block"></div>
                  <div className="relative sm:backdrop-blur-xl sm:bg-white/10 sm:rounded-2xl overflow-hidden sm:shadow-2xl sm:border sm:border-white/20">
                    <video
                      className="w-full sm:w-96 lg:w-[600px] sm:rounded-2xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/video-poster.jpg"
                    >
                      <source src="/DIMOSTRAZIONEVIDEO.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          BENEFITS SECTION
          ============================================ */}
      <section className="py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
              <span className="sm:hidden"><br /></span>
              <span className="hidden sm:inline"> </span>
              <GradientText>{t('benefits.titleHighlight')}</GradientText>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('benefits.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                image: "/Leo-sorpreso-1.png",
                title: t('benefits.card1Title'),
                desc: t('benefits.card1Desc'),
                bgLight: "from-blue-50 to-cyan-50",
                borderColor: "from-blue-400 via-cyan-400 to-blue-400",
                innerGlowColor: "rgba(191, 219, 254, 0.6)"
              },
              {
                image: "/Leo-sorpreso-2.png",
                title: t('benefits.card2Title'),
                desc: t('benefits.card2Desc'),
                bgLight: "from-violet-50 to-purple-50",
                borderColor: "from-violet-400 via-purple-400 to-violet-400",
                innerGlowColor: "rgba(221, 214, 254, 0.6)"
              },
              {
                image: "/Leo-sorpreso-3.png",
                title: t('benefits.card3Title'),
                desc: t('benefits.card3Desc'),
                bgLight: "from-amber-50 to-orange-50",
                borderColor: "from-amber-400 via-orange-400 to-amber-400",
                innerGlowColor: "rgba(253, 230, 138, 0.6)"
              }
            ].map((item, i) => (
              <div
                key={i}
                className={`relative group rounded-2xl p-[1px] bg-gradient-to-r ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.borderColor} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>

                <div className={`relative rounded-2xl bg-gradient-to-br ${item.bgLight} p-4 sm:p-6 md:p-8 h-full overflow-hidden`}>
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 20px 8px ${item.innerGlowColor}`
                    }}
                  />
                  <img
                    src="/zampedileo.png"
                    alt=""
                    aria-hidden="true"
                    className="
                      absolute pointer-events-none select-none
                      opacity-[0.05]
                      top-0 right-0 h-full w-auto
                      sm:top-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2
                      sm:h-auto sm:w-28
                      sm:bottom-3
                      md:w-32
                      md:bottom-4
                      lg:w-36
                      xl:w-40
                      2xl:w-44
                      object-contain
                    "
                  />

                  <div className="relative z-10 flex items-center gap-4 md:flex-col md:text-center">
                    <div className="flex-shrink-0 md:mb-4">
                      <img
                        src={item.image}
                        alt="Leo"
                        className="
                          w-14 h-14
                          sm:w-16 sm:h-16
                          md:w-20 md:h-20
                          lg:w-24 lg:h-24
                          xl:w-28 xl:h-28
                          2xl:w-32 2xl:h-32
                          object-contain drop-shadow-lg
                        "
                      />
                    </div>
                    <div className="flex-1 md:flex-none">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 md:mb-3">{item.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base font-semibold">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="py-12 sm:py-24 bg-[#f8f7f4]" id="come-funziona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('howItWorks.title')}
            titleHighlight={t('howItWorks.titleHighlight')}
          />

          {/* MOBILE CAROUSEL */}
          <div className="sm:hidden -mt-12">
            <div className="relative flex items-start">
              <button
                onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                className={`absolute left-1 top-[calc(65vw+1rem)] -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-200 transition-all duration-300 ${
                  currentStep === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-100 active:scale-95'
                }`}
                disabled={currentStep === 0}
                aria-label="Previous step"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
              </button>

              <button
                onClick={() => currentStep < 3 && setCurrentStep(prev => prev + 1)}
                className={`absolute right-1 top-[calc(65vw+1rem)] -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-200 transition-all duration-300 ${
                  currentStep === 3
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-100 active:scale-95'
                }`}
                disabled={currentStep === 3}
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              <div
                className="overflow-x-hidden overflow-y-visible px-10 pt-2 w-full"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                  {[
                    { icon: Eye, title: t('howItWorks.step1Title'), image: '/step1.png' },
                    { icon: Navigation, title: t('howItWorks.step2Title'), image: '/step2.png' },
                    { icon: Play, title: t('howItWorks.step3Title'), image: '/step3.png' },
                    { icon: Award, title: t('howItWorks.step4Title'), image: '/step4.png' }
                  ].map((step, i) => (
                    <div key={i} className="w-full flex-shrink-0 px-2">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-md mb-3">
                          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            {i + 1}
                          </span>
                        </div>

                        <div className="relative w-[60vw] max-w-[280px]">
                          <h4 className="font-bold text-gray-800 text-center text-lg mb-4 w-full">{step.title}</h4>
                          <img
                            src={step.image}
                            alt={`Step ${i + 1}`}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentStep === i
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 w-6'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-violet-300 via-pink-300 to-amber-300"></div>

            {[
              { icon: Eye, title: t('howItWorks.step1Title') },
              { icon: Navigation, title: t('howItWorks.step2Title') },
              { icon: Play, title: t('howItWorks.step3Title') },
              { icon: Award, title: t('howItWorks.step4Title') }
            ].map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border-4 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-200 hover:scale-110 transition-transform cursor-pointer group">
                  <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
                    {i + 1}
                  </span>
                </div>
                <div className="mb-3">
                  <step.icon className="w-8 h-8 mx-auto text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-800">{step.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TOURS SECTION
          ============================================ */}
      <section className="py-12 sm:py-24" id="percorsi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('tours.title')}
            titleHighlight={t('tours.titleHighlight')}
            subtitle={t('tours.subtitle')}
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TourCard
              title={t('tours.tour1Title')}
              category={t('tours.tour1Category')}
              categoryType="monuments"
              description={t('tours.tour1Desc')}
              duration={`60 ${t('tours.duration')}`}
              stops="6"
              stopsLabel={t('tours.stops')}
              price={t('tours.free')}
              priceLabel={t('tours.perPerson')}
              badge={t('tours.tour1Badge')}
              image="/RIALTO-SANMARCO3.png"
            />
            <TourCard
              title={t('tours.tour2Title')}
              category={t('tours.tour2Category')}
              categoryType="mysteries"
              description={t('tours.tour2Desc')}
              duration={`90 ${t('tours.duration')}`}
              stops="7"
              stopsLabel={t('tours.stops')}
              price={t('tours.free')}
              priceLabel={t('tours.perPerson')}
              badge={t('tours.tour2Badge')}
              image="/DORSODURO.jpg"
              comingSoon={true}
              comingSoonLabel={t('tours.comingSoon')}
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary">
              {t('tours.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS
          ============================================ */}
      <section className="py-12 sm:py-24" style={{ backgroundColor: '#f8f7f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('testimonials.title')}
            titleHighlight={t('testimonials.titleHighlight')}
            subtitle={t('testimonials.subtitle')}
          />

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              text={t('testimonials.review1Text')}
              author={t('testimonials.review1Author')}
              location={t('testimonials.review1Location')}
              avatar="MR"
            />
            <TestimonialCard
              text={t('testimonials.review2Text')}
              author={t('testimonials.review2Author')}
              location={t('testimonials.review2Location')}
              avatar="JS"
            />
            <TestimonialCard
              text={t('testimonials.review3Text')}
              author={t('testimonials.review3Author')}
              location={t('testimonials.review3Location')}
              avatar="LB"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="py-12 sm:py-24" id="faq" style={{ backgroundColor: '#f8f7f4' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('faq.title')}
            titleHighlight={t('faq.titleHighlight')}
            subtitle={t('faq.subtitle')}
          />

          <GlassCard className="p-6 md:p-8" hover={false}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === i}
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </GlassCard>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="py-24 relative overflow-hidden" id="inizia">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/video-intro-Leo-1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('cta.title')}<br/>{t('cta.titleHighlight')}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}<br className="hidden sm:block"/>
            {t('cta.subtitleLine2')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="lg" className="shadow-2xl" onClick={() => window.open('https://wa.me/393514312461?text=START%20CHAT%20%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%3E', '_blank')}>
              <img src="/WHITELOGOWA.png" alt="WhatsApp" className="w-6 h-6" />
              {t('cta.ctaWhatsapp')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollToSection('percorsi')}>
              {t('cta.ctaExplore')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
