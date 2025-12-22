'use client';

import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [visible, setVisible] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Animatsiyani darhol boshlash
    setStartAnimation(true);

    // Animatsiya tugaganda fade out
    const endTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const letters = ['F', 'i', 'x', 'o', 'o'];

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex text-5xl md:text-7xl lg:text-8xl font-bold text-white">
        {letters.map((letter, index) => {
          // Har bir harf uchun turli yo'nalishlar
          const letterAnimations = [
            startAnimation ? 'animate-from-left' : 'opacity-0',      // F - chapdan
            startAnimation ? 'animate-from-top' : 'opacity-0',       // i - tepadan  
            startAnimation ? 'animate-from-bottom' : 'opacity-0',    // x - pastdan
            startAnimation ? 'animate-from-top' : 'opacity-0',       // o - tepadan (1-chi)
            startAnimation ? 'animate-from-right' : 'opacity-0',     // o - o'ngdan (2-chi)
          ];

          return (
            <div
              key={index}
              className={`inline-block ${letterAnimations[index]} transform hover:scale-110 transition-transform duration-300`}
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: '1.2s',
                animationFillMode: 'forwards',
                animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                textShadow: '0 0 20px rgba(255,255,255,0.3)'
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>
      
      {/* Gradient overlay for beautiful effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-400/10 to-transparent pointer-events-none"></div>

      <style jsx global>{`
        @keyframes from-top {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes from-left {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes from-right {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes from-bottom {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-from-top {
          animation: from-top 1s ease-out forwards;
        }

        .animate-from-left {
          animation: from-left 1s ease-out forwards;
        }

        .animate-from-right {
          animation: from-right 1s ease-out forwards;
        }

        .animate-from-bottom {
          animation: from-bottom 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 