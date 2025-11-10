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

  useEffect(() => {
    if (currentLine === 1) {
      if (currentIndex < line1.length) {
        const timeout = setTimeout(() => {
          setDisplayedLine1(prev => prev + line1[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        // Move to line 2
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
        // Typing complete
        const timeout = setTimeout(() => {
          onComplete();
        }, 1500);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, currentLine, line1, line2, onComplete]);

  const isTyping = (currentLine === 1 && currentIndex < line1.length) || 
                   (currentLine === 2 && currentIndex < line2.length);

  return (
    <div className="fixed w-screen h-screen font-ppmori inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-red-50">
      <div className="text-center px-8 border-2 w-full h-full flex flex-col items-center justify-center  border-black">
        <div className="text-5xl md:text-[10rem] uppercase font-black text-pink-600 ">
          {displayedLine1}
          {currentLine === 1 && isTyping && (
            <span className="animate-pulse">|</span>
          )}
        </div>
        {displayedLine2 && (
          <div className="text-5xl md:text-[10rem] uppercase font-bold text-pink-600 mt-4 ">
            {displayedLine2}
            {currentLine === 2 && isTyping && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
