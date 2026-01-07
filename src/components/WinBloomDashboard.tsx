
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { WinLog } from '@/app/lib/types';
import { WinForm } from './WinForm';
import { GardenDisplay } from './GardenDisplay';
import { useToast } from '@/hooks/use-toast';
import { Sprout } from 'lucide-react';
import { FLOWERS, type Flower } from '@/app/lib/flowers';

const wittyHeadlines = [
  "Adulting level: Expert. 🏆",
  "You’re winning at life today! ✨",
  "Basically an Olympic Legend now. 🥇",
  "Making moves and taking names! 🪴",
  "Achievement unlocked: Absolute Legend. 🙌",
  "Not saying you're a hero, but... 🦸‍♂️",
  "That win was elite. Seriously. 🔥",
  "You're doing the thing! Keep going. 🚀",
];


const FLOWER_COST_TIERS = [
    { from: 0, to: 3, cost: 30 },
    { from: 4, to: 6, cost: 40 },
    { from: 7, to: 9, cost: 50 },
    { from: 10, to: 12, cost: 60 },
    { from: 13, to: Infinity, cost: 70 },
];

const calculateFlowerGrowth = (dewdrops: number) => {
    let flowerCount = 0;
    let remainingDewdrops = dewdrops;
    let dewdropsForNextFlower = 0;
    let costForNext = FLOWER_COST_TIERS[0].cost;

    for (const tier of FLOWER_COST_TIERS) {
        const flowersInTier = tier.to - (tier.from > 0 ? tier.from -1 : 0);
        const dewdropsForTier = flowersInTier * tier.cost;

        if (remainingDewdrops >= dewdropsForTier && tier.to !== Infinity) {
            remainingDewdrops -= dewdropsForTier;
            flowerCount += flowersInTier;
        } else {
            const flowersInThisTier = Math.floor(remainingDewdrops / tier.cost);
            flowerCount += flowersInThisTier;
            remainingDewdrops -= flowersInThisTier * tier.cost;
            costForNext = tier.cost;
            break;
        }
    }
    
    dewdropsForNextFlower = costForNext - remainingDewdrops;
    const progressToNextFlower = (remainingDewdrops / costForNext) * 100;
    const totalProgressSteps = costForNext / 10;
    const currentProgressSteps = Math.floor(remainingDewdrops / 10);

    return {
        flowerCount,
        dewdropsForNextFlower,
        progressToNextFlower,
        totalProgressSteps,
        currentProgressSteps,
        costForNext,
    };
};

const getRandomFlower = (exclude: Flower[] = []): Flower => {
  const availableFlowers = FLOWERS.filter(
    (f) => !exclude.some((e) => e.name === f.name)
  );
  const pool = availableFlowers.length > 0 ? availableFlowers : FLOWERS;
  return pool[Math.floor(Math.random() * pool.length)];
};

export function WinBloomDashboard() {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  const [bloomedFlowers, setBloomedFlowers] = useState<string[]>([]);
  const [currentTargetFlower, setCurrentTargetFlower] = useState<Flower | null>(null);
  const [lastFlowerToastCount, setLastFlowerToastCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedDewdrops = localStorage.getItem('winbloom-dewdrops');
      if (savedDewdrops) setDewdrops(JSON.parse(savedDewdrops));
      
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedLogs) setLogs(JSON.parse(savedLogs));

      const savedBloomed = localStorage.getItem('winbloom-bloomed-flowers');
      const initialBloomed = savedBloomed ? JSON.parse(savedBloomed) : [];
      setBloomedFlowers(initialBloomed);
      setLastFlowerToastCount(initialBloomed.length);

      const savedTarget = localStorage.getItem('winbloom-target-flower');
      if (savedTarget) {
        setCurrentTargetFlower(JSON.parse(savedTarget));
      } else {
        const initialTarget = getRandomFlower();
        setCurrentTargetFlower(initialTarget);
        localStorage.setItem('winbloom-target-flower', JSON.stringify(initialTarget));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const {
      flowerCount,
      dewdropsForNextFlower,
      progressToNextFlower,
      totalProgressSteps,
      currentProgressSteps,
      costForNext,
  } = useMemo(() => calculateFlowerGrowth(dewdrops), [dewdrops]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(dewdrops));
      
      if (flowerCount > lastFlowerToastCount) {
        const newBloomedFlower = currentTargetFlower;

        if (newBloomedFlower) {
            const updatedBloomedFlowers = [...bloomedFlowers, newBloomedFlower.icon];
            setBloomedFlowers(updatedBloomedFlowers);
            localStorage.setItem('winbloom-bloomed-flowers', JSON.stringify(updatedBloomedFlowers));
        
            toast({
              className: "bg-primary text-primary-foreground border-none",
              title: (
                <div className="flex items-center gap-2 font-bold text-primary-foreground">
                  <span className="text-2xl">{newBloomedFlower.icon}</span>
                  <span>A new {newBloomedFlower.name} has bloomed!</span>
                </div>
              ),
              description: "Your garden is flourishing!",
              duration: 10000,
            });

            const newTarget = getRandomFlower([newBloomedFlower]);
            setCurrentTargetFlower(newTarget);
            localStorage.setItem('winbloom-target-flower', JSON.stringify(newTarget));
        }
        setLastFlowerToastCount(flowerCount);
      }
    }
  }, [dewdrops, isClient, toast, flowerCount, lastFlowerToastCount, currentTargetFlower, bloomedFlowers]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-logs', JSON.stringify(logs));
    }
  }, [logs, isClient]);
  
  const handleWinLog = (win: string, gratitude: string) => {
    const newLog: WinLog = {
      id: new Date().toISOString(),
      win,
      gratitude,
      date: new Date().toISOString(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
    setDewdrops(prevDewdrops => prevDewdrops + 10);
    
    const randomHeadline = wittyHeadlines[Math.floor(Math.random() * wittyHeadlines.length)];

    toast({
      className: "bg-primary text-primary-foreground border-none",
      title: <span className="font-bold">{randomHeadline}</span>,
      description: "Success! +10 Dewdrops added to your balance.",
      duration: 10000,
    });
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <GardenDisplay 
            dewdrops={dewdrops}
            progressToNextFlower={progressToNextFlower}
            currentProgressSteps={currentProgressSteps}
            totalProgressSteps={totalProgressSteps}
            dewdropsForNextFlower={dewdropsForNextFlower}
            bloomedFlowers={bloomedFlowers}
            logCount={logs.length}
            currentTargetFlower={currentTargetFlower}
          />
        </div>
        <div className="lg:col-span-2 space-y-6 hidden sm:block">
           <WinForm onWinLog={handleWinLog} />
        </div>
      </div>
    </div>
  );
}
