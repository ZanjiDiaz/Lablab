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
  const [showFlowersReveal, setShowFlowersReveal] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [hoverImages, setHoverImages] = useState<Array<{ id: number; x: number; y: number; image: string }>>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  const [basePath, setBasePath] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const roseRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const imageCounter = useRef(0);
  const lastImageTime = useRef(0);
  const lastImageUsed = useRef<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageCounter = useRef(0);

  // Message object - you can write your messages here
  const messages = [
    "Hi Lablabb!!",
    "Thank you lablabb sa lahaaat!",
    "Palagi mo lang tatandaan na mahal kita palagi",
    "Palagi kong ipagpapasalamat kay Lord na ikaw yung dumating sa buhay ko",
    "Mas matanda ka na sakin hahahaha!",
    "Ano handa mo love? Penge spaghetti",
    "Nakangiti ka nanaman!",
    "What if mas matangkad ka sakin? huhuhu",
    "Mahal na mahal kita lablab!",
    "Sana ol 25 years old!",
    "25 ka na pero baby parin kita",
    "Please be mine forever",
    "Bawal ka ma stress ngayon ha?",
    "I'll never leave",
    "Buti nagka internet hahahaha",
    "Natutuwa ako sayoooooo!",
    "I miss you naaaaaaaa",
    "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "Ganda ng background music no lablab?",
    "Kahit anong mangyari, andito lang ako",
    "Sorry love kung corny to hahahaha I love you!",
    "Durog na tong rose kaka pindot mo hahaha",
    "Happy happy happy birthday lablab!",
  ];

  // Set basePath after component mounts
  useEffect(() => {
    if (window.location.hostname.includes('github.io')) {
      setBasePath('/Lablab');
    } else {
      setBasePath('');
    }
  }, []);

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
    setShowLoading(false);
    
    // Play audio immediately when loading completes
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log('Audio play error:', err);
        });
      }
    }, 100);
  };

  const handleUserInteraction = () => {
    // Do nothing - audio will play automatically when main page loads
  };

  const handleClickScreenClick = () => {
    setShowClickScreen(false);
    setShowFlowersReveal(true);
    
    // Hide flowers reveal after 3 seconds and show typing animation
    setTimeout(() => {
      setShowFlowersReveal(false);
    }, 3000);
  };

  const handleRoseClick = () => {
    // Pick a random message from the messages array
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Generate random position for the message, avoiding the bottom area where the rose is
    const randomX = Math.random() * (window.innerWidth - 400) + 200;
    const randomY = Math.random() * (window.innerHeight - 400) + 100; // Avoid bottom area
    
    // Create a new message with unique ID
    const newMessage = {
      id: messageCounter.current++,
      x: randomX,
      y: randomY,
      text: randomMessage
    };
    
    setDisplayedMessages(prev => [...prev, newMessage]);
    
    // Remove this message after 3 seconds
    setTimeout(() => {
      setDisplayedMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 3000);
  };

  // Initialize audio on mount (will play after user interaction)
  useEffect(() => {
    if (!basePath && typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      // Wait for basePath to be set
      return;
    }
    
    const audio = new Audio(`${basePath}/mp3/Ed Sheeran - Tenerife Sea .mp3`);
    audio.loop = true;
    audio.volume = 0.75;
    audio.preload = 'auto'; // Preload the audio
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [basePath]);

  // Background slideshow effect
  useEffect(() => {
    if (showLoading) return;
    
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [showLoading, images.length]);

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
          <div className="text-center font-ppmori">
            <h1 className="text-7xl md:text-9xl font-bold text-pink-600 mb-8 animate-pulse">
              Click here!
            </h1>
            <p className="text-2xl text-pink-500">✨ 🎁 ✨</p>
          </div>
        </div>
      )}

      {/* Flowers Reveal Screen */}
      {showFlowersReveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white font-ppmori overflow-hidden">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img  
              src={`${basePath}/flowers.png`}
              alt="flowers"
              className="absolute inset-0 w-full h-full object-contain animate-[scaleIn_2s_ease-out]"
            />
            <h1 className="relative z-10 text-7xl md:text-9xl font-black text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">
              Charaaaaaaaaan
            </h1><br />
            <p className="relative z-10 text-7xl md:text-9xl font-black text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"> Hahahahahahaha </p>
          </div>
        </div>
      )}

      {/* Typing Animation Loading Screen */}
      {!showClickScreen && !showFlowersReveal && showLoading && (
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
        className={`font-ppmori flex items-end justify-center relative overflow-hidden transition-opacity duration-1000 ease-in-out w-screen h-screen ${
          showLoading || showClickScreen ? 'opacity-0' : 'opacity-100'
        }`}
        onMouseMove={handleMouseMove}
        style={{
          backdropFilter: 'blur(0.5px)',
          WebkitBackdropFilter: 'blur(0.5px)',
        }}
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 w-full h-full  bg-linear-to-br from-pink-200 to-pink-300">
          {images.map((img, index) => (
            <div
              key={img}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center"
              style={{
                opacity: index === currentBgIndex ? 1 : 0,
                zIndex: 0,
              }}
            >
              <img
                src={`${basePath}/imgs/${img}`}
                alt="background"
                className="w-full h-full object-contain"
                style={{ objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>

        {/* Overlay to create romantic atmosphere */}
        <div 
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background: 'rgba(255, 192, 203, 0.3)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Romantic vignette and glare overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.6) 0%, transparent 20%),
              radial-gradient(circle at 70% 60%, rgba(255, 182, 193, 0.5) 0%, transparent 25%),
              radial-gradient(ellipse at center, transparent 40%, rgba(139, 69, 69, 0.4) 100%)
            `,
            mixBlendMode: 'soft-light',
          }}
        />

        {/* Cinematic lens flare */}
        <div 
          className="absolute inset-0 pointer-events-none z-5 animate-pulse"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 10%),
              radial-gradient(circle at 80% 20%, rgba(255, 182, 193, 0.15) 0%, transparent 15%)
            `,
            animationDuration: '4s',
          }}
        />
        
        {/* Hover Images */}
        {hoverImages.map(img => (
          <div
            key={img.id}
            className="fixed pointer-events-none z-20 animate-[fadeInOut_1.5s_ease-in-out]"
            style={{
              left: img.x - 75,
              top: img.y - 75,
              filter: 'brightness(1.1) contrast(1.1)',
            }}
          >
            <Image
              src={`${basePath}/imgs/${img.image}`}
              alt="memory"
              width={150}
              height={150}
              className="rounded-lg shadow-2xl object-cover w-[150px] h-[150px]"
              style={{ display: 'block' }}
            />
          </div>
        ))}

        <div 
          ref={roseRef} 
          className="rose z-30 flex items-center justify-center w-1/2 h-1/2 cursor-pointer"
          onClick={handleRoseClick}
        >
          <RosePinkScene/>
        </div>

        {/* Message Display */}
        {displayedMessages.map(msg => (
          <div 
            key={msg.id}
            className="fixed z-40 pointer-events-none animate-[fadeInOut_3s_ease-in-out]"
            style={{
              left: msg.x,
              top: msg.y,
              transform: 'translate(-50%, -50%)',
              filter: 'brightness(1.1) contrast(1.1)',
            }}
          >
            <div className="bg-linear-to-br from-pink-900/60 to-red-900/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-pink-500/40 max-w-2xl font-ppmori">
              <p className="text-pink-100 text-2xl leading-relaxed font-light text-center font-ppmori">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
