'use client';

import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  onComplete: () => void;
}

export default function TypingAnimation({ onComplete }: TypingAnimationProps) {
  const line1 = "Happy Birthday, Love!";
  const line2 = "I love you so much!";

  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [currentLine, setCurrentLine] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    if (currentLine === 1) {
      if (currentIndex < line1.length) {
        const timeout = setTimeout(() => {
          setDisplayedLine1(prev => prev + line1[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLine(2);
          setCurrentIndex(0);
        }, 100);
        return () => clearTimeout(timeout);
      }
    } else if (currentLine === 2) {
      if (currentIndex < line2.length) {
        const timeout = setTimeout(() => {
          setDisplayedLine2(prev => prev + line2[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setShowHearts(true);
        }, 0);
        const completeTimeout = setTimeout(() => {
          onComplete();
        }, 1500);
        return () => {
          clearTimeout(timeout);
          clearTimeout(completeTimeout);
        };
      }
    }
  }, [currentIndex, currentLine, line1, line2, onComplete]);

  const isTyping = (currentLine === 1 && currentIndex < line1.length) || (currentLine === 2 && currentIndex < line2.length);

  return (
    <div className="fixed w-screen h-screen font-ppmori inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-pink-900 via-rose-800 to-red-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-linear-to-b from-pink-300/40 via-transparent to-transparent transform -skew-x-12 animate-pulse" />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-linear-to-b from-rose-300/30 via-transparent to-transparent transform skew-x-12 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)' }} />
      <div className="text-center px-8 w-full h-full flex flex-col items-center justify-center relative z-10">
        <div className="text-5xl md:text-[10rem] uppercase font-black text-transparent bg-clip-text bg-linear-to-r from-pink-200 via-rose-300 to-pink-200 drop-shadow-[0_0_30px_rgba(255,182,193,0.5)] animate-glow">
          {displayedLine1}
          {currentLine === 1 && isTyping && <span className="animate-pulse text-pink-300">|</span>}
        </div>
        {displayedLine2 && (
          <div className="text-5xl md:text-[10rem] uppercase font-bold text-transparent bg-clip-text bg-linear-to-r from-rose-200 via-pink-300 to-rose-200 mt-4 drop-shadow-[0_0_30px_rgba(255,182,193,0.5)] animate-glow" style={{ animationDelay: '0.5s' }}>
            {displayedLine2}
            {currentLine === 2 && isTyping && <span className="animate-pulse text-pink-300">|</span>}
          </div>
        )}
        {showHearts && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '15%', bottom: '-50px', animationDelay: '0s', animationDuration: '3s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '25%', bottom: '-50px', animationDelay: '0.2s', animationDuration: '3.5s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '35%', bottom: '-50px', animationDelay: '0.4s', animationDuration: '2.8s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '45%', bottom: '-50px', animationDelay: '0.1s', animationDuration: '3.2s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '55%', bottom: '-50px', animationDelay: '0.3s', animationDuration: '2.9s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '65%', bottom: '-50px', animationDelay: '0.5s', animationDuration: '3.3s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '75%', bottom: '-50px', animationDelay: '0.2s', animationDuration: '3.1s' }}>❤️</div>
            <div className="absolute text-4xl animate-float-up opacity-0" style={{ left: '85%', bottom: '-50px', animationDelay: '0.4s', animationDuration: '2.7s' }}>❤️</div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-up {
            0% { transform: translateY(0) scale(0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 20px rgba(255,182,193,0.5)); }
            50% { filter: drop-shadow(0 0 40px rgba(255,182,193,0.9)); }
          }
          .animate-float-up {
            animation: float-up 3s ease-out forwards;
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `
      }} />
    </div>
  );
}
