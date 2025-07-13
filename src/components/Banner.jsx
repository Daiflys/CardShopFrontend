import React, { useState, useEffect, useRef } from "react";

const banners = [
  {
    title: "AETHERDRIFT",
    subtitle: "Ramp & Furious",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "MAGIC X FINAL FANTASY",
    subtitle: "It's the Final (Fantasy) Countdown",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "MODERN HORIZONS",
    subtitle: "New Horizons Await",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
  {
    title: "LEGENDARY BATTLES",
    subtitle: "Epic Showdowns",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    cta: "BUY NOW",
  },
];

const slideOut = {
  right: "-translate-x-full transition-transform duration-500",
  left: "translate-x-full transition-transform duration-500",
};
const slideIn = {
  right: "translate-x-full",
  left: "-translate-x-full",
};
const slideActive = "translate-x-0 transition-transform duration-500";

// Nueva función para invertir la dirección
const oppositeDirection = (dir) => (dir === "right" ? "left" : "right");

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [nextIdx, setNextIdx] = useState(null);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [enterActive, setEnterActive] = useState(false);
  const timeoutRef = useRef(null);
  const animTimeoutRef = useRef(null);

  // Rotación automática
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Limpia animación al desmontar
  useEffect(() => () => clearTimeout(animTimeoutRef.current), []);

  // Activa la animación de entrada en el siguiente tick
  useEffect(() => {
    if (isAnimating && nextIdx !== null) {
      setEnterActive(false);
      const id = setTimeout(() => setEnterActive(true), 20); // pequeño delay para forzar el reflow
      return () => clearTimeout(id);
    }
  }, [isAnimating, nextIdx]);

  const goTo = (idx, dir = "right") => {
    if (isAnimating || idx === current) return;
    setDirection(dir);
    setNextIdx(idx);
    setIsAnimating(true);
    setEnterActive(false);
    animTimeoutRef.current = setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
      setNextIdx(null);
      setEnterActive(false);
    }, 500);
    clearTimeout(timeoutRef.current);
  };

  const handlePrev = () => goTo((current - 1 + banners.length) % banners.length, "left");
  const handleNext = () => goTo((current + 1) % banners.length, "right");

  return (
    <section className="relative bg-gray-800 text-white py-10 px-2 md:px-8 flex items-center justify-center overflow-hidden rounded-lg shadow-lg mt-6 min-h-[260px] md:min-h-[340px]">
      {/* Flecha izquierda */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 z-10"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      {/* Carrusel con animación */}
      <div className="relative w-full max-w-6xl h-full min-h-[180px] md:min-h-[220px] flex items-center justify-center overflow-hidden">
        {/* Banner actual (saliente durante animación) */}
        <div
          className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between w-full h-full ${isAnimating ? slideOut[direction] : slideActive}`}
          style={{ zIndex: isAnimating ? 1 : 2 }}
        >
          <div className="z-10 max-w-xl flex-1 px-4 md:px-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight drop-shadow-lg">{banners[current].title}</h1>
            <h2 className="text-xl md:text-3xl font-semibold mb-6 drop-shadow-lg">{banners[current].subtitle}</h2>
            <button className="bg-blue-700 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-800 transition">{banners[current].cta}</button>
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
        {/* Banner entrante (solo durante animación) */}
        {isAnimating && nextIdx !== null && (
          <div
            className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between w-full h-full ${slideIn[oppositeDirection(direction)]}${enterActive ? ` ${slideActive}` : ""}`}
            style={{ zIndex: 2 }}
          >
            <div className="z-10 max-w-xl flex-1 px-4 md:px-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight drop-shadow-lg">{banners[nextIdx].title}</h1>
              <h2 className="text-xl md:text-3xl font-semibold mb-6 drop-shadow-lg">{banners[nextIdx].subtitle}</h2>
              <button className="bg-blue-700 text-white font-bold px-6 py-2 rounded shadow hover:bg-blue-800 transition">{banners[nextIdx].cta}</button>
            </div>
            <div className="flex-1 flex items-center justify-center relative min-w-[180px] min-h-[120px] md:min-w-[320px] md:min-h-[220px]">
              <img
                src={banners[nextIdx].image}
                alt={banners[nextIdx].title}
                className="object-contain h-40 md:h-60 w-auto rounded-lg shadow-lg"
                draggable="false"
              />
            </div>
          </div>
        )}
      </div>
      {/* Flecha derecha */}
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 z-10"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, idx > current ? "right" : "left")}
            className={`w-4 h-2 rounded-full transition-all duration-300 ${current === idx ? "bg-blue-500 w-8" : "bg-white/60"}`}
            aria-label={`Ir al banner ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner; 