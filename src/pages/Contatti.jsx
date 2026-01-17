import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Gradient Text
const GradientText = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

// Social Icon Component - bigger and more impactful
const SocialIcon = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 hover:scale-110 hover:shadow-lg transition-all duration-300 shadow-md"
  >
    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
  </a>
);

// Contact Item - Simple list style
const ContactItem = ({ icon: Icon, content, href }) => (
  <div className="flex items-center gap-4 py-3">
    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 flex-shrink-0" />
    {href ? (
      <a
        href={href}
        className="text-xl sm:text-2xl lg:text-3xl text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
      >
        {content}
      </a>
    ) : (
      <span className="text-xl sm:text-2xl lg:text-3xl text-gray-700">{content}</span>
    )}
  </div>
);

// Custom SVG Icons for social media
const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TikTokIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v14a4 4 0 1 1-4-4"/>
    <path d="M12 6c2 0 4-1.5 4.5-4"/>
    <path d="M16.5 2c0 2.5 2 4 3.5 4"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const LinkedInIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Contatti() {
  const { t } = useLanguage();

  const email = t('contatti.email') || 'chat.heritage.ve@gmail.com';
  const phone = t('contatti.phone') || '+39 351 431 2461';
  const address = t('contatti.address') || 'Venezia, Italia';

  return (
    <>
      {/* Hero Section - stessa altezza di App.jsx */}
      <section className="relative flex items-center pt-7 sm:pt-16 lg:pt-20 overflow-hidden bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:py-6 lg:py-20 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              <GradientText>{t('contatti.heroTitleHighlight') || 'Contatti'}</GradientText>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line sm:whitespace-normal">
              {t('contatti.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section - Simple List */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4]">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-2">
            <ContactItem
              icon={Mail}
              content={email}
              href={`mailto:${email}`}
            />
            <ContactItem
              icon={Phone}
              content={phone}
              href={`tel:${phone.replace(/\s/g, '')}`}
            />
            <ContactItem
              icon={MapPin}
              content={address}
            />
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            {t('contatti.socialTitle')} <GradientText>{t('contatti.socialTitleHighlight')}</GradientText>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
            {t('contatti.socialSubtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <SocialIcon
              href="https://instagram.com/chatheritage"
              icon={InstagramIcon}
              label="Instagram"
            />
            <SocialIcon
              href="https://www.tiktok.com/@chat.heritage"
              icon={TikTokIcon}
              label="TikTok"
            />
            <SocialIcon
              href="https://www.facebook.com/people/Chat-Heritage/61565845054887/"
              icon={FacebookIcon}
              label="Facebook"
            />
            <SocialIcon
              
              icon={YoutubeIcon}
              label="YouTube"
            />
            <SocialIcon
              
              icon={LinkedInIcon}
              label="LinkedIn"
            />
          </div>
        </div>
      </section>
    </>
  );
}
