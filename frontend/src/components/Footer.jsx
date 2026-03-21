import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const socialLinks = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
];

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#A92E2E] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start">
          {/* Brand & copyright */}
          <div className="flex flex-col items-start gap-4">
            <Link
              to="/"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/50 bg-white/10 text-center text-sm font-bold leading-tight tracking-tight transition hover:bg-white/20"
              aria-label={t('common.home')}
            >
              AI
              <br />
              Shop
            </Link>
            <p className="text-xs text-white/85 leading-relaxed max-w-[220px]">
              {t('footer.copyright', { year })}
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              {t('footer.about_title')}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/90">
              <li>
                <Link to="/" className="hover:text-white hover:underline underline-offset-2 transition">
                  {t('footer.about_origin')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:underline underline-offset-2 transition">
                  {t('footer.about_service')}
                </Link>
              </li>
              <li>
                <a
                  href="#careers"
                  className="hover:text-white hover:underline underline-offset-2 transition"
                  onClick={(e) => e.preventDefault()}
                >
                  {t('footer.about_career')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@aishop.local"
                  className="hover:text-white hover:underline underline-offset-2 transition"
                >
                  {t('footer.about_contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Store & news */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
                {t('footer.store_title')}
              </h3>
              <a
                href="#stores"
                className="text-sm text-white/90 hover:text-white hover:underline underline-offset-2 transition"
                onClick={(e) => e.preventDefault()}
              >
                {t('footer.find_store')}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">
                {t('footer.news_title')}
              </h3>
              <a
                href="#news"
                className="text-sm text-white/90 hover:text-white hover:underline underline-offset-2 transition"
                onClick={(e) => e.preventDefault()}
              >
                {t('footer.news_link')}
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              {t('footer.follow_title')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
