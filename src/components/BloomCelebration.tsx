
"use client";

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { Sprout } from 'lucide-react';

import type { Flower } from '@/app/lib/flowers';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Custom shapes for react-confetti
const petalColors = ['#f4a2b8', '#fff0f5', '#dda0dd']; // Pinks and purples
const dropletColor = '#87ceeb'; // Sky blue

const drawPetal = (context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(0, 0);
  context.bezierCurveTo(5, 10, 10, 0, 15, 5);
  context.bezierCurveTo(10, 10, 5, 15, 0, 10);
  context.bezierCurveTo(-5, 15, -10, 10, -15, 5);
  context.bezierCurveTo(-10, 0, -5, 10, 0, 0);
  context.closePath();
  context.fill();
};

const drawDroplet = (context: CanvasRenderingContext2D) => {
  context.beginPath();
  context.moveTo(0, -5);
  context.arc(0, 0, 5, Math.PI, 0);
  context.closePath();
  context.fill();
};

type BloomCelebrationProps = {
  flower: Flower;
  onClose: () => void;
};

export const BloomCelebration: React.FC<BloomCelebrationProps> = ({ flower, onClose }) => {
  const { width, height } = useWindowSize();
  const [isRunning, setIsRunning] = useState(true);
  const [showSprout, setShowSprout] = useState(true);

  useEffect(() => {
    // Start confetti and animation
    setIsRunning(true);
    setShowSprout(true);

    // Transition from sprout to flower after a short delay
    const sproutTimer = setTimeout(() => {
      setShowSprout(false);
    }, 800); // Animation duration for sprout -> flower

    // Stop confetti after a few seconds
    const confettiTimer = setTimeout(() => {
      setIsRunning(false);
    }, 4000);

    return () => {
      clearTimeout(sproutTimer);
      clearTimeout(confettiTimer);
    };
  }, [flower]);

  if (!width || !height) {
    return null;
  }
  
  const confettiPieces = Array(150).fill(null).map((_, i) => ({
    draw: drawPetal,
    color: petalColors[i % petalColors.length],
  })).concat(Array(50).fill(null).map(() => ({
    draw: drawDroplet,
    color: dropletColor,
  })));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4">
      <Confetti
        width={width}
        height={height}
        recycle={isRunning}
        numberOfPieces={isRunning ? 200 : 0}
        gravity={0.05}
        initialVelocityY={-10}
        confettiSource={{ x: width / 2, y: height, w: width, h: 0 }}
        drawShape={(context) => {
            const piece = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
            context.fillStyle = piece.color;
            piece.draw(context);
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
        <div className="relative w-32 h-32 flex items-center justify-center">
            {showSprout ? (
                <Sprout className="text-primary size-24 animate-bloom" />
            ) : (
                <span className="text-8xl animate-pulse-grow">{flower.icon}</span>
            )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-headline font-bold text-primary dark:text-accent">Your Garden is Blooming!</h2>
          <p className="text-xl text-foreground">You just grew a beautiful {flower.name}.</p>
          <p className="text-muted-foreground italic pt-2">
            Your small wins are turning into something beautiful.
          </p>
        </div>

        <Button 
          onClick={onClose} 
          size="lg" 
          className="font-bold text-lg w-full max-w-xs"
        >
          Plant My Next Seed
        </Button>
      </div>
    </div>
  );
};
