
"use client";

import React from 'react';
import type { Flower } from '@/app/lib/flowers';
import { Button } from './ui/button';
import { Sprout, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';


const CircularProgressBar = ({ progress }: { progress: number }) => {
    const size = 160;
    const strokeWidth = 12;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            <circle cx={center} cy={center} r={radius} stroke="#D6D8D5" strokeWidth={strokeWidth} fill="transparent" />
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#129263"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-dashoffset 0.5s ease-out',
                }}
            />
        </svg>
    );
};


type FeedbackState = {
  isOpen: boolean;
  didBloom: boolean;
  flower?: Flower;
  progress?: {
    dewdropsForNextFlower: number;
    progressToNextFlower: number;
    currentTargetFlower: Flower | null;
  }
}

type LogFeedbackProps = {
  feedback: FeedbackState;
  onClose: () => void;
};

export const LogFeedback: React.FC<LogFeedbackProps> = ({ feedback, onClose }) => {
  const { didBloom, flower, progress } = feedback;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="absolute top-8 flex items-center gap-2">
            <Leaf className="text-primary size-7" />
            <h1 className="text-2xl font-headline font-bold text-[#121212] dark:text-primary">
                WinBloom
            </h1>
        </div>
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-md mx-auto">
        <h2 className="text-4xl font-headline font-bold text-primary dark:text-accent">Well Done!</h2>

        {didBloom && flower ? (
          <div className="flex flex-col items-center space-y-4">
            <span className="text-8xl animate-bloom">{flower.icon}</span>
            <p className="text-xl text-foreground">You just grew a beautiful {flower.name}.</p>
          </div>
        ) : (
          progress && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative flex items-center justify-center">
                <CircularProgressBar progress={progress.progressToNextFlower} />
                <div className="absolute">
                  <Sprout className="text-accent" size={80} />
                </div>
              </div>
              <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs mt-2">
                Just {progress.dewdropsForNextFlower} more Dewdrops until your {progress.currentTargetFlower?.name || 'next flower'} blooms!
              </p>
            </div>
          )
        )}
        
        <Button 
          onClick={onClose} 
          size="lg" 
          className="font-bold text-lg w-full max-w-xs"
        >
          {didBloom ? "See My Garden" : "Continue"}
        </Button>
      </div>
    </div>
  );
};
