'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function MatrixRain({ children }) {
  const canvasRef = useRef(null);
  const pathname = usePathname();
  const isTransitioning = useRef(false);
  const animationRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const firstMount = useRef(true);

  // Initial content display after first render
  useEffect(() => {
    if (firstMount.current) {
      setTimeout(() => {
        setContentVisible(true);
        firstMount.current = false;
      }, 100);
    }

    // Cleanup on component unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Matrix effect implementation
  const startMatrixEffect = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Re-apply black background after resize
      if (isTransitioning.current) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial black fill
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Character setup
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ';
    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);

    // Arrays for tracking drops
    const drops = Array.from({ length: columns }, () => Math.random() * -50);
    const speeds = Array.from(
      { length: columns },
      () => 0.5 + Math.random() * 1.5
    );

    // Color variations
    const colors = Array.from({ length: columns }, () => {
      const hue = 120 + Math.random() * 40 - 20;
      const saturation = 80 + Math.random() * 20;
      const lightness = 40 + Math.random() * 20;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });

    // Highlight characters
    const highlightIndices = new Set(
      Array.from({ length: Math.floor(columns / 10) }, () =>
        Math.floor(Math.random() * columns)
      )
    );

    // Animation function
    const draw = () => {
      if (!isTransitioning.current) return;

      // Semi-transparent black fill for fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Different styling for highlights
        if (highlightIndices.has(i)) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `${fontSize + 2}px monospace`;
        } else {
          ctx.fillStyle = colors[i];
          ctx.font = `${fontSize}px monospace`;
        }

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drops at random intervals
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        // Update position
        drops[i] += speeds[i];
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    isTransitioning.current = true;
    setOpacity(1);
    animationRef.current = requestAnimationFrame(draw);

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isTransitioning.current = false;
    };
  }, []);

  // Handle clicks on internal links
  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      // Skip transition for download links or external links
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        href === pathname ||
        link.hasAttribute('download') // Skip transition if download attribute is present
      )
        return;

      // Start transition
      setContentVisible(false);
      startMatrixEffect();
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [pathname, startMatrixEffect]);

  // Handle path changes
  useEffect(() => {
    if (firstMount.current) return;

    // Hide content and start effect
    setContentVisible(false);
    const cleanup = startMatrixEffect();

    // Timing for transition end
    const transitionDuration = 1000;
    const endTransitionTimer = setTimeout(() => {
      setOpacity(0);
      setContentVisible(true);
    }, transitionDuration);

    return () => {
      clearTimeout(endTransitionTimer);
      if (cleanup) cleanup();
    };
  }, [pathname, startMatrixEffect]);

  return (
    <>
      {/* Black background layer */}
      <div
        className={`fixed inset-0 bg-black pointer-events-none z-40 transition-opacity duration-700 ease-in-out ${
          opacity ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Matrix canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ease-in-out ${
          opacity ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Page content */}
      <div
        className={`h-full relative z-10 transition-opacity duration-700 ease-in-out ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </>
  );
}
