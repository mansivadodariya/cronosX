"use client";
import React, { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // Highly tuned Lenis configuration: snappy, responsive, silky smooth without rubbery lag
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false,
      infinite: false,
    });

    window.lenis = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return <>{children}</>;
}
