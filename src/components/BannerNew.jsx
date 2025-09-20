import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const getBanners = (t) => [
  {
    id: 1,
    title: t('banners.aetherDrift.title'),
    subtitle: t('banners.aetherDrift.subtitle'),
    cta: t('banners.aetherDrift.cta'),
    image: "/images/aetherdrift.jpg",
    bgColor: "from-cyan-400 via-blue-500 to-purple-600",
    setCode: "dft"
  },
  {
    id: 2,
    title: t('banners.finalFantasy.title'),
    subtitle: t('banners.finalFantasy.subtitle'),
    cta: t('banners.finalFantasy.cta'),
    image: "/images/finalfantasy.jpg",
    bgColor: "from-orange-400 via-red-500 to-pink-600",
    setCode: "fin"
  },
  {
    id: 3,
    title: t('banners.modernHorizons.title'),
    subtitle: t('banners.modernHorizons.subtitle'),
    cta: t('banners.modernHorizons.cta'),
    image: "/images/modernhorizons.jpg",
    bgColor: "from-teal-400 via-cyan-500 to-blue-600",
    setCode: "mh3"
  }
];

const BannerNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const banners = getBanners(t);

  const handleBannerClick = (setCode) => {
    navigate(`/search?set=${setCode}`);
  };

  // Auto-rotation using original timing
  useEffect(() => {
    if (!banners.length) return;
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Handle banner click events from dynamic buttons
  useEffect(() => {
    const handleBannerClickEvent = (event) => {
      handleBannerClick(event.detail);
    };

    window.addEventListener('bannerClick', handleBannerClickEvent);
    return () => window.removeEventListener('bannerClick', handleBannerClickEvent);
  }, []);

  // Original sliding animation logic
  const goTo = (idx, direction = "right") => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    
    const container = document.querySelector('.carousel-container');
    const currentSlide = container.querySelector('.current-slide');
    const nextSlide = container.querySelector('.next-slide');
    
    const nextBanner = banners[idx];
    
    // Setup next slide with new design
    nextSlide.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br ${nextBanner.bgColor}">
        <div class="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent"></div>
        <div class="absolute right-0 top-0 h-full w-full md:w-2/3 lg:w-3/5">
          <div class="h-full w-full bg-cover bg-center" style="background-image: url(${nextBanner.image}); clip-path: polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%);">
            <div class="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/30"></div>
          </div>
          <div class="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-black/20 to-transparent" style="clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%);"></div>
        </div>
      </div>
      <div class="absolute inset-0 flex items-center">
        <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">${nextBanner.title}</h1>
            <p class="text-lg md:text-xl text-white mb-6">${nextBanner.subtitle}</p>
            <button onclick="window.dispatchEvent(new CustomEvent('bannerClick', { detail: '${nextBanner.setCode}' }))" class="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded transition-all duration-300 shadow-lg hover:shadow-xl">${nextBanner.cta}</button>
          </div>
        </div>
      </div>
    `;
    
    // Set initial position
    if (direction === "right") {
      nextSlide.style.transform = 'translateX(100%)';
    } else {
      nextSlide.style.transform = 'translateX(-100%)';
    }
    
    // Start animation
    requestAnimationFrame(() => {
      currentSlide.style.transform = direction === "right" ? 'translateX(-100%)' : 'translateX(100%)';
      nextSlide.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      // Disable transitions temporarily to avoid visual jumps
      currentSlide.style.transition = 'none';
      nextSlide.style.transition = 'none';
      
      // Update the current slide content immediately
      setCurrent(idx);
      
      // Reset positions instantly without transitions
      currentSlide.style.transform = 'translateX(0)';
      nextSlide.innerHTML = '';
      nextSlide.style.transform = direction === "right" ? 'translateX(100%)' : 'translateX(-100%)';
      
      // Re-enable transitions after a brief delay
      setTimeout(() => {
        currentSlide.style.transition = '';
        nextSlide.style.transition = '';
      }, 50);
    }, 500);
    
    clearTimeout(timeoutRef.current);
  };

  const handlePrev = () => goTo((current - 1 + banners.length) % banners.length, "left");
  const handleNext = () => goTo((current + 1) % banners.length, "right");

  const currentBanner = banners[current];

  return (
    <section className="relative overflow-hidden px-4 md:px-6 lg:px-8 mt-6 w-full">
      {/* True fullwidth banner */}
      <div className="relative w-full h-80 md:h-96 lg:h-[450px] overflow-hidden rounded-2xl">
        
        {/* Left arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 z-20"
          aria-label="Previous"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Carousel container with original animation system */}
        <div className="carousel-container relative w-full h-full overflow-hidden">
          {/* Current slide */}
          <div className="current-slide absolute inset-0 transition-transform duration-500 ease-out">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentBanner.bgColor}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent"></div>
              
              {/* Image with diagonal clip */}
              <div className="absolute right-0 top-0 h-full w-full md:w-2/3 lg:w-3/5">
                <div 
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentBanner.image})`,
                    clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/30"></div>
                </div>
                
                {/* Second diagonal overlay on the right */}
                <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-black/20 to-transparent"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%)'
                  }}>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {currentBanner.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white mb-6 drop-shadow-lg">
                    {currentBanner.subtitle}
                  </p>
                  <button 
                    onClick={() => handleBannerClick(currentBanner.setCode)}
                    className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {currentBanner.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Next slide (for animation) */}
          <div className="next-slide absolute inset-0 transition-transform duration-500 ease-out" style={{transform: 'translateX(100%)'}}></div>
        </div>
        
        {/* Right arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 z-20"
          aria-label="Next"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx, idx > current ? "right" : "left")}
              className={`w-4 h-2 rounded-full transition-all duration-300 ${current === idx ? "bg-sky-400 w-8" : "bg-white/60"}`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerNew;