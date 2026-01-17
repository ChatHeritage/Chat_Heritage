import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/">
              <img src="/LOGOUFFICIALE-TOTALWHITE.png" alt="Chat Heritage" className="h-10 w-auto mb-4 brightness-0 invert" />
            </Link>
            <p className="text-gray-400 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaInstagram, href: "https://www.instagram.com/chatheritage/" },
                { icon: FaFacebookF, href: "https://www.facebook.com/people/Chat-Heritage/61565845054887/" },
                { icon: FaTiktok, href: "https://www.tiktok.com/@chat.Heritage" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: t('footer.colPercorsi'),
              links: [
                { label: t('footer.linkRialtoSanMarco'), href: '/#percorsi' },
                { label: t('footer.linkCannaregio'), href: '/#percorsi' },
                { label: t('footer.linkTuttiPercorsi'), href: '/#percorsi' }
              ]
            },
            {
              title: t('footer.colAzienda'),
              links: [
                { label: t('footer.linkChiSiamo'), href: '/chi-siamo' },
                { label: t('footer.linkTeam'), href: '/chi-siamo' },
                { label: t('footer.linkBlog'), href: '#' },
                { label: t('footer.linkLavora'), href: '#' }
              ]
            },
            {
              title: t('footer.colSupporto'),
              links: [
                { label: t('footer.linkFaq'), href: '/#faq' },
                { label: t('footer.linkContattaci'), href: '#' },
                { label: t('footer.linkPartnership'), href: '#' },
                { label: t('footer.linkPressKit'), href: '#' }
              ]
            }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    {link.href.startsWith('/') || link.href.startsWith('#') ? (
                      <Link to={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Chat Heritage. {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            {/* IUBENDA: Sostituisci XXXXXX con il tuo Policy ID di Iubenda */}
            <a href="https://www.iubenda.com/privacy-policy/XXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="https://www.iubenda.com/terms-and-conditions/XXXXXX" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="https://www.iubenda.com/privacy-policy/XXXXXX/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
