import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SLIDE_COUNT = 4;

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=280&h=360&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=280&h=360&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=280&h=360&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=280&h=360&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=280&h=360&fit=crop',
  'https://images.unsplash.com/photo-1585386959980-a4155224a361?w=280&h=360&fit=crop',
];

function getImageSrc(product, fallbackIndex) {
  if (product?.image) return product.image;
  return FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
}

function getTripleForSlide(products, slideIndex) {
  if (!products?.length) {
    return [
      { image: FALLBACK_IMAGES[slideIndex % 3], id: null },
      { image: FALLBACK_IMAGES[(slideIndex + 1) % FALLBACK_IMAGES.length], id: null },
      { image: FALLBACK_IMAGES[(slideIndex + 2) % FALLBACK_IMAGES.length], id: null },
    ];
  }
  return [0, 1, 2].map((offset) => {
    const idx = (slideIndex * 3 + offset) % products.length;
    return products[idx];
  });
}

/**
 * Banner carousel: dark red + orange spotlight, skewed headline, 3 product visuals, dots.
 */
function HeroCarousel({ products = [], autoplayMs = 5500 }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(
    () =>
      Array.from({ length: SLIDE_COUNT }, (_, i) => ({
        index: i,
        accent: t(`hero_carousel.slide_${i}_accent`),
        headline: t(`hero_carousel.slide_${i}_headline`),
        badge: t(`hero_carousel.slide_${i}_badge`),
        leftLabel: t(`hero_carousel.slide_${i}_left`),
        rightLabel: t(`hero_carousel.slide_${i}_right`),
        slogan: t(`hero_carousel.slide_${i}_slogan`),
        triple: getTripleForSlide(products, i),
      })),
    [products, t]
  );

  const go = useCallback((dir) => {
    setActive((a) => (a + dir + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (autoplayMs <= 0 || paused) return undefined;
    const id = setInterval(() => go(1), autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs, go, paused]);

  const current = slides[active];

  return (
    <section
      className="relative mb-8 overflow-hidden rounded-2xl shadow-xl"
      aria-roledescription="carousel"
      aria-label={t('hero_carousel.a11y_label')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div
        className="relative min-h-[300px] md:min-h-[380px] lg:min-h-[420px] bg-[#6B1414]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 70% at 50% 45%, rgba(249, 115, 22, 0.42) 0%, rgba(249, 115, 22, 0.08) 45%, transparent 72%)',
        }}
      >
        {/* Promo badge */}
        <div className="absolute top-4 right-4 z-30 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500 p-2 text-center text-[10px] font-bold uppercase leading-tight text-white shadow-lg md:h-28 md:w-28 md:text-xs">
          {current.badge.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </div>

        {/* Skewed background headline */}
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden pt-6"
          aria-hidden
        >
          <span
            className="select-none whitespace-nowrap text-5xl font-black uppercase italic text-white/25 sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ transform: 'skewX(-14deg) translateX(-4%)' }}
          >
            {current.headline}
          </span>
        </div>

        <div className="relative z-10 flex min-h-[300px] flex-col px-4 pb-10 pt-8 md:min-h-[380px] md:pb-12 lg:min-h-[420px]">
          <div className="text-center">
            <p className="text-lg font-bold text-orange-400 md:text-xl">{current.accent}</p>
          </div>

          {/* Three “cups” / product shots */}
          <div className="relative mx-auto mt-2 flex max-w-3xl flex-1 items-end justify-center gap-1 sm:gap-3 md:gap-8">
            {current.triple.map((item, i) => {
              const isCenter = i === 1;
              const imgSrc = getImageSrc(item, active * 3 + i);
              const canLink = item?.id != null && Number.isFinite(Number(item.id));
              const inner = (
                <div
                  className={[
                    'relative overflow-hidden rounded-2xl bg-white/10 shadow-2xl ring-2 ring-white/25 backdrop-blur-[2px] transition-transform duration-500',
                    isCenter
                      ? 'z-20 h-44 w-28 sm:h-52 sm:w-36 md:h-64 md:w-44 scale-105 md:scale-110'
                      : 'z-10 h-36 w-24 opacity-95 sm:h-44 sm:w-32 md:h-52 md:w-36 scale-90 translate-y-3 md:translate-y-4',
                  ].join(' ')}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    loading={active === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              );
              if (canLink) {
                return (
                  <Link key={`${active}-${i}-${item.id}`} to={`/product/${item.id}`} className="flex shrink-0">
                    {inner}
                  </Link>
                );
              }
              return <div key={`${active}-${i}-ph`} className="flex shrink-0">{inner}</div>;
            })}
          </div>

          <div className="pointer-events-none absolute bottom-24 left-4 hidden text-xs font-medium text-white/90 sm:block md:text-sm">
            {current.leftLabel}
          </div>
          <div className="pointer-events-none absolute bottom-24 right-4 hidden text-xs font-medium text-white/90 sm:block md:text-sm">
            {current.rightLabel}
          </div>

          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/95 md:text-sm">
            {current.slogan}
          </p>

          {/* Dots */}
          <div
            className="mt-4 flex justify-center gap-2"
            role="tablist"
            aria-label={t('hero_carousel.dots_label')}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={t('hero_carousel.go_slide', { n: i + 1 })}
                onClick={() => setActive(i)}
                className={[
                  'h-2.5 w-2.5 rounded-full transition-all duration-300 md:h-3 md:w-3',
                  i === active ? 'scale-110 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/35 hover:bg-white/60',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
