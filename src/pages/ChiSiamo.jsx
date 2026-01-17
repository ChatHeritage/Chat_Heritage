import { Link } from 'react-router-dom';
import { Heart, Lightbulb, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Glass Card Component (riutilizzato da App.jsx)
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

// Founder Card Component
const FounderCard = ({ name, role, image, bio, quote }) => (
  <GlassCard className="p-4 sm:p-6 md:p-8" hover={false}>
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center md:items-start">
      {/* Foto fondatore */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-purple-600 font-medium mb-3 sm:mb-4 text-sm sm:text-base">{role}</p>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{bio}</p>
        {quote && (
          <blockquote className="italic text-gray-500 border-l-4 border-purple-300 pl-3 sm:pl-4 text-sm sm:text-base">
            "{quote}"
          </blockquote>
        )}
      </div>
    </div>
  </GlassCard>
);

// Timeline Item
const TimelineItem = ({ year, title, description, isLast = false }) => (
  <div className="flex gap-3 sm:gap-4">
    {/* Timeline line */}
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 flex-shrink-0"></div>
      {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-violet-300 to-pink-300 mt-2"></div>}
    </div>

    {/* Content */}
    <div className="pb-6 sm:pb-8 flex-1 min-w-0">
      <span className="text-xs sm:text-sm font-bold text-purple-600">{year}</span>
      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mt-1">{title}</h4>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">{description}</p>
    </div>
  </div>
);

export default function ChiSiamo() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section - stessa altezza di App.jsx */}
      <section className="relative flex items-center pt-7 sm:pt-16 lg:pt-20 overflow-hidden bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:py-6 lg:py-20 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('chiSiamo.heroTitle') || 'La Nostra'} <GradientText>{t('chiSiamo.heroTitleHighlight') || 'Storia'}</GradientText>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
              {t('chiSiamo.heroSubtitle') || 'Come un gruppo di appassionati di storia e tecnologia ha deciso di rivoluzionare il modo di scoprire Venezia.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Heart,
                title: t('chiSiamo.missionPassionTitle') || 'Passione',
                desc: t('chiSiamo.missionPassionDesc') || 'Amiamo Venezia e la sua storia millenaria. Ogni angolo racconta una storia che merita di essere ascoltata.'
              },
              {
                icon: Lightbulb,
                title: t('chiSiamo.missionInnovationTitle') || 'Innovazione',
                desc: t('chiSiamo.missionInnovationDesc') || "Usiamo l'intelligenza artificiale per rendere la cultura accessibile a tutti, ovunque e in qualsiasi momento."
              },
              {
                icon: Users,
                title: t('chiSiamo.missionCommunityTitle') || 'Comunità',
                desc: t('chiSiamo.missionCommunityDesc') || 'Crediamo che la storia debba essere condivisa, non custodita. Vogliamo creare una comunità di esploratori curiosi.'
              }
            ].map((item, i) => (
              <GlassCard key={i} className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            {t('chiSiamo.foundersTitle') || 'I Fondatori'}
          </h2>

          <div className="space-y-8">
            {/* Fondatore 1 - Placeholder */}
            <FounderCard
              name={t('chiSiamo.founder1Name') || 'Nome Fondatore 1'}
              role={t('chiSiamo.founder1Role') || 'Co-Founder & CEO'}
              image="/FRANCESCO.png"
              bio={t('chiSiamo.founder1Bio') || 'Descrizione del fondatore 1. La sua passione per la storia di Venezia e la tecnologia lo ha portato a creare Chat Heritage.'}
              quote={t('chiSiamo.founder1Quote') || 'Vogliamo che ogni visitatore si senta come un veneziano che torna a casa.'}
            />

            {/* Fondatore 2 - Placeholder */}
            <FounderCard
              name={t('chiSiamo.founder2Name') || 'Nome Fondatore 2'}
              role={t('chiSiamo.founder2Role') || 'Co-Founder & CTO'}
              image="/GIANLUCA.png"
              bio={t('chiSiamo.founder2Bio') || "Descrizione del fondatore 2. Esperto di intelligenza artificiale, ha sviluppato Leo, la guida virtuale che accompagna i visitatori."}
              quote={t('chiSiamo.founder2Quote') || "La tecnologia deve essere al servizio della cultura, non il contrario."}
            />

            {/* Fondatore 3 - Placeholder */}
            <FounderCard
              name={t('chiSiamo.founder3Name') || 'Nome Fondatore 3'}
              role={t('chiSiamo.founder3Role') || 'Co-Founder & COO'}
              image="/SIMONE.png"
              bio={t('chiSiamo.founder3Bio') || "Descrizione del fondatore 3. Coordina le operazioni e le partnership strategiche."}
              quote={t('chiSiamo.founder3Quote') || "Ogni turista merita di vivere Venezia come un locale, non come un numero."}
            />

            {/* Fondatore 4 - Placeholder */}
            <FounderCard
              name={t('chiSiamo.founder4Name') || 'Nome Fondatore 4'}
              role={t('chiSiamo.founder4Role') || 'Co-Founder & Creative Director'}
              image="/EDOARDO.png"
              bio={t('chiSiamo.founder4Bio') || "Descrizione del fondatore 4. Storica dell'arte e narratrice, è la mente creativa dietro i contenuti."}
              quote={t('chiSiamo.founder4Quote') || "Le storie di Venezia sono infinite. Il nostro compito è farle vivere."}
            />
          </div>
        </div>
      </section>

      {/* Timeline / Storia Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            {t('chiSiamo.timelineTitle') || 'Il Nostro Viaggio'}
          </h2>

          <div className="pl-2 sm:pl-4">
            <TimelineItem
              year={t('chiSiamo.timeline1Year') || '2024'}
              title={t('chiSiamo.timeline1Title') || "L'Idea"}
              description={t('chiSiamo.timeline1Desc') || "Durante una passeggiata a Venezia, nasce l'idea di creare una guida turistica intelligente accessibile via WhatsApp."}
            />
            <TimelineItem
              year={t('chiSiamo.timeline2Year') || '2024'}
              title={t('chiSiamo.timeline2Title') || 'Nasce Leo'}
              description={t('chiSiamo.timeline2Desc') || "Sviluppiamo Leo, il leone di San Marco virtuale che diventa la voce di Chat Heritage."}
            />
            <TimelineItem
              year={t('chiSiamo.timeline3Year') || '2025'}
              title={t('chiSiamo.timeline3Title') || 'Primo Tour'}
              description={t('chiSiamo.timeline3Desc') || "Lanciamo il primo percorso: da Rialto a San Marco, con 6 tappe e oltre 80 aneddoti."}
            />
            <TimelineItem
              year={t('chiSiamo.timeline4Year') || '2026'}
              title={t('chiSiamo.timeline4Title') || 'Espansione'}
              description={t('chiSiamo.timeline4Desc') || "Nuovi percorsi in arrivo: Dorsoduro, Cannaregio e molto altro. Il viaggio continua!"}
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4361ee] to-[#2ec4b6]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-6">
            {t('chiSiamo.ctaTitle') || 'Unisciti a Noi'}
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-8 px-2 sm:px-0">
            {t('chiSiamo.ctaSubtitle') || 'Scopri Venezia come non l\'hai mai vista. Leo ti sta aspettando!'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <MapPin className="w-5 h-5" />
            {t('chiSiamo.ctaButton') || 'Inizia il Tuo Tour'}
          </Link>
        </div>
      </section>
    </>
  );
}
