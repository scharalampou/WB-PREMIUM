
"use client";

import { Droplets, Sprout } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ConfettiBurst } from './Confetti';

// A new component for the circular progress bar
const CircularProgressBar = ({ progress }: { progress: number }) => {
    const size = 160; // SVG canvas size
    const strokeWidth = 12;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background track */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#D6D8D5"
                strokeWidth={strokeWidth}
                fill="transparent"
            />
            {/* Progress stroke */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#6AC394"
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

interface DewdropProgressBarProps {
    currentSteps: number;
    totalSteps: number;
}

const DewdropProgressBar = ({ currentSteps, totalSteps }: DewdropProgressBarProps) => {
    const progressPercentage = totalSteps > 0 ? (currentSteps / totalSteps) * 100 : 0;
    // We want to show a dewdrop for each 10-dewdrop increment, excluding the final flower.
    const intermediateStepCount = Math.max(0, totalSteps > 0 ? totalSteps -1 : 0);
    
    return (
        <div className="w-full mt-4">
            <div className="relative w-full h-2 rounded-full" style={{ backgroundColor: '#D6D8D5' }}>
                <div
                    className="absolute h-2 rounded-full"
                    style={{ 
                        width: `${progressPercentage}%`, 
                        transition: 'width 0.5s ease-out',
                        backgroundColor: '#6AC394' 
                    }}
                ></div>

                {/* Starting Seedling Icon */}
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ left: '0%', backgroundColor: '#FFF0C2' }}>
                     <span className="text-4xl">🪴</span>
                </div>

                {/* Intermediate Dewdrop Steps */}
                {Array.from({ length: intermediateStepCount }).map((_, i) => {
                    const stepPosition = `${((i + 1) / totalSteps) * 100}%`;
                    const isFilled = (i + 1) <= currentSteps;
                    return (
                        <div
                            key={`step-${i}`}
                            className={cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center")}
                            style={{ 
                                left: stepPosition,
                                backgroundColor: isFilled ? '#6AC394' : '#D6D8D5',
                             }}
                        >
                            <Droplets className={cn("size-5", isFilled ? 'text-white' : 'text-white')} />
                        </div>
                    );
                })}

                {/* Final Flower Step */}
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ left: '100%' }}>
                     <span className="text-4xl">🌸</span>
                </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">Your progress to the next flower!</p>
        </div>
    );
};

interface GardenDisplayProps {
    dewdrops: number;
    progressToNextFlower: number;
    dewdropsForNextFlower: number;
    flowerCount: number;
    logCount: number;
    currentProgressSteps: number;
    totalProgressSteps: number;
}

export function GardenDisplay({
    dewdrops,
    progressToNextFlower,
    dewdropsForNextFlower,
    flowerCount,
    logCount,
    currentProgressSteps,
    totalProgressSteps,
}: GardenDisplayProps) {
    const showConfetti = dewdrops > 0 && totalProgressSteps > 0 && dewdrops % (totalProgressSteps * 10) === 0 && logCount > 0;

    return (
        <>
            {showConfetti && <ConfettiBurst />}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <div className="space-y-1.5">
                            <CardTitle className="font-headline">Dewdrop Balance</CardTitle>
                            <CardDescription>Earn 10 Dewdrops for every win you log!</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-4xl font-bold text-primary dark:text-accent">
                            <Droplets className="size-7" style={{ color: '#6AC394' }} />
                            <span>{dewdrops}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {logCount > 0 && totalProgressSteps > 0 && (
                            <DewdropProgressBar currentSteps={currentProgressSteps} totalSteps={totalProgressSteps} />
                        )}
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline">Your Digital Garden</CardTitle>
                        <CardDescription>Watch your garden grow with every win you log.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 bg-accent/10 rounded-b-lg border-2 border-dashed border-accent/30 dark:bg-card">
                        <div className="w-full flex flex-col items-center flex-grow">
                            <div className="flex flex-col items-center justify-center gap-4 text-center flex-grow">
                                {logCount === 0 ? (
                                    <div className="relative flex items-center justify-center h-[160px] w-[160px]">
                                        <Sprout className="text-accent" size={64} />
                                    </div>
                                ) : (
                                    <div className="relative flex items-center justify-center">
                                        <CircularProgressBar progress={progressToNextFlower} />
                                        <div className="absolute">
                                            <Sprout className="text-accent" size={80} />
                                        </div>
                                    </div>
                                )}
                                <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs mt-2">
                                    {logCount === 0
                                        ? "Existing is a full-time job. Rest is productive, too."
                                        : `Just ${dewdropsForNextFlower} more Dewdrops to go until your next flower!`}
                                </p>
                            </div>
                            {flowerCount > 0 && (
                                <>
                                    <div className="w-full border-t border-border my-4"></div>
                                    <p className="text-muted-foreground mb-4 font-headline text-lg">Your bloomed flowers</p>
                                    <div className="w-full flex flex-wrap justify-center gap-x-2 gap-y-4">
                                        {Array.from({ length: flowerCount }).map((_, i) => (
                                            <div key={i} className="flex justify-center">
                                                <span
                                                    className="text-4xl animate-bloom"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                >
                                                    🌸
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
