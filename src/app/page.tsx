'use client';

import { useState, useRef, useEffect } from "react";
import RosePinkScene from './components/RosePinkScene';
import TypingAnimation from '@/app/components/TypingAnimation';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

import { MotionPathPlugin, ScrollSmoother, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {
  const [showClickScreen, setShowClickScreen] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [hoverImages, setHoverImages] = useState<Array<{ id: number; x: number; y: number; image: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const roseRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const imageCounter = useRef(0);
  const lastImageTime = useRef(0);
  const lastImageUsed = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Array of available images
  const images = [
    'one.jpeg', 'two.jpg', 'three.png', 'four.jpeg', 'five.jpg', 'six.png', 'seven.jpeg',
    '1 (3).png', '1 (4).jpeg', '1 (5).jpeg', '1 (6).jpeg', '1 (7).jpeg', '1 (8).jpeg',
    '1 (9).jpeg', '1 (10).jpeg', '1 (11).jpeg', '1 (12).jpeg', '1 (13).jpeg', '1 (14).jpeg',
    '1 (15).jpeg', '1 (16).jpeg', '1 (17).jpeg', '1 (18).jpeg', '1 (19).jpeg', '1 (20).jpeg'
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showLoading) return;
    
    const now = Date.now();
    const timeSinceLastImage = now - lastImageTime.current;
    
    // Only show image if at least 300ms have passed since last image
    if (timeSinceLastImage < 100) return;
    
    lastImageTime.current = now;
    
    // Get a random image that's different from the last one
    let randomImage;
    do {
      randomImage = images[Math.floor(Math.random() * images.length)];
    } while (randomImage === lastImageUsed.current && images.length > 1);
    
    lastImageUsed.current = randomImage;
    
    const newImage = {
      id: imageCounter.current++,
      x: e.clientX,
      y: e.clientY,
      image: randomImage
    };

    setHoverImages(prev => [...prev, newImage]);

    // Remove image after animation
    setTimeout(() => {
      setHoverImages(prev => prev.filter(img => img.id !== newImage.id));
    }, 1500);
  };

  const handleLoadingComplete = () => {
    setFadeOut(true);
    // Wait for fade out animation to complete before hiding loading
    setTimeout(() => {
      setShowLoading(false);
    }, 800);
  };

  const handleUserInteraction = () => {
    // Try to play audio on user interaction
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => {
        console.log('Audio play error:', err);
      });
    }
  };

  const handleClickScreenClick = () => {
    handleUserInteraction();
    setShowClickScreen(false);
  };

  // Initialize audio on mount (will play after user interaction)
  useEffect(() => {
    audioRef.current = new Audio('/mp3/Ed Sheeran - Tenerife Sea .mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.75;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!showLoading && containerRef.current && titleRef.current && roseRef.current) {
      // Initial state - hidden
      gsap.set([titleRef.current, roseRef.current], {
        opacity: 0,
        scale: 0.8
      });

      // Animate in
      const tl = gsap.timeline();
      
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.4)"
      })
      .to(roseRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.6");
    }
  }, [showLoading]);

  useGSAP(()=> {

  }, []);

  return (
    <>
      {/* Initial Click Screen */}
      {showClickScreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-pink-100 to-pink-200 cursor-pointer font-ppmori"
          onClick={handleClickScreenClick}
        >
          <div className="text-center">
            <h1 className="text-7xl md:text-9xl font-bold text-pink-600 mb-8 animate-pulse">
              Click here!
            </h1>
            <p className="text-2xl text-pink-500">✨ 🎁 ✨</p>
          </div>
        </div>
      )}

      {/* Typing Animation Loading Screen */}
      {!showClickScreen && showLoading && (
        <div 
          ref={loadingRef}
          className={`transition-opacity duration-800 ease-in-out ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleUserInteraction}
          onMouseMove={handleUserInteraction}
        >
          <TypingAnimation onComplete={handleLoadingComplete} />
        </div>
      )}
      
      {/* Main Page */}
      <div 
        ref={containerRef} 
        className={` flex items-center justify-center font-intern relative overflow-hidden transition-opacity duration-1000 ease-in-out ${
          showLoading || showClickScreen ? 'opacity-0' : 'opacity-100'
        }`}
        onMouseMove={handleMouseMove}
        style={{
          backdropFilter: 'blur(0.5px)',
          WebkitBackdropFilter: 'blur(0.5px)',
          backgroundColor: '#FFC0CB',
        }}
      >
        {/* Romantic vignette and glare overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.4) 0%, transparent 20%),
              radial-gradient(circle at 70% 60%, rgba(255, 182, 193, 0.3) 0%, transparent 25%),
              radial-gradient(ellipse at center, transparent 40%, rgba(255, 182, 193, 0.2) 100%)
            `,
            mixBlendMode: 'soft-light',
          }}
        />
        
        {/* Hover Images */}
        {hoverImages.map(img => (
          <div
            key={img.id}
            className="fixed pointer-events-none z-0 animate-[fadeInOut_1.5s_ease-in-out]"
            style={{
              left: img.x - 75,
              top: img.y - 75,
              filter: 'blur(0.3px)',
            }}
          >
            <Image
              src={`/imgs/${img.image}`}
              alt="memory"
              width={150}
              height={150}
              className="rounded-lg shadow-2xl object-cover"
            />
          </div>
        ))}

        <div ref={roseRef} className="rose relative z-10 flex items-center justify-center w-screen h-screen">
          <RosePinkScene/>
        </div>
      </div>
    </>
  );
}
