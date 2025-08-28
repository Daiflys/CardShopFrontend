import React, { useState, useEffect, useRef } from "react";
import { getBanners } from "../api/banner";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getBanners()
      .then(setBanners)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (!banners.length) return;
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, banners.length]);

  const goTo = (idx, direction = "right") => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    
    const container = document.querySelector('.carousel-container');
    const currentSlide = container.querySelector('.current-slide');
    const nextSlide = container.querySelector('.next-slide');
    
    // Setup next slide
    nextSlide.innerHTML = `
      <div class="z-10 max-w-xl flex-1 px-4 md:px-0">
        <h1 class="text-3xl md:text-5xl font-bold mb-2 leading-tight drop-shadow-lg">${banners[idx].title}</h1>
        <h2 class="text-xl md:text-3xl font-semibold mb-6 drop-shadow-lg">${banners[idx].subtitle}</h2>
        <button class="bg-blue-700 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-800 transition">${banners[idx].cta}</button>
      </div>
      <div class="flex-1 flex items-center justify-center relative min-w-[180px] min-h-[120px] md:min-w-[320px] md:min-h-[220px]">
        <img
          src="${banners[idx].image}"
          alt="${banners[idx].title}"
          class="object-contain h-40 md:h-60 w-auto rounded-lg shadow-lg"
          draggable="false"
        />
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

  if (loading) return <div className="p-8 text-center">Loading banners...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!banners.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900 text-white py-10 px-2 md:px-8 flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl mt-8 min-h-[260px] md:min-h-[340px] border border-white/10 backdrop-blur-sm">
      {/* Left arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 z-10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Carousel container */}
      <div className="carousel-container relative w-full max-w-6xl h-full min-h-[180px] md:min-h-[220px] flex items-center justify-center overflow-hidden">
        {/* Current slide */}
        <div className="current-slide absolute inset-0 flex flex-col md:flex-row items-center justify-between w-full h-full transition-transform duration-500 ease-out">
          <div className="z-10 max-w-xl flex-1 px-4 md:px-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{banners[current].title}</h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6 drop-shadow-lg text-blue-100">{banners[current].subtitle}</h2>
            <button className="btn-accent hover:scale-105 transition-all duration-300 shadow-xl">{banners[current].cta}</button>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-w-[180px] min-h-[120px] md:min-w-[320px] md:min-h-[220px]">
            <img
              src={banners[current].image}
              alt={banners[current].title}
              className="object-contain h-40 md:h-60 w-auto rounded-lg shadow-lg"
              draggable="false"
            />
          </div>
        </div>
        
        {/* Next slide (for animation) */}
        <div className="next-slide absolute inset-0 flex flex-col md:flex-row items-center justify-between w-full h-full transition-transform duration-500 ease-out" style={{transform: 'translateX(100%)'}}></div>
      </div>
      
      {/* Right arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 z-10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, idx > current ? "right" : "left")}
            className={`h-2 rounded-full transition-all duration-300 hover:scale-110 ${current === idx ? "bg-gradient-to-r from-yellow-400 to-orange-500 w-8 shadow-lg" : "bg-white/60 w-4 hover:bg-white/80"}`}
            aria-label={`Go to banner ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;