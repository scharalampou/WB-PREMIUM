
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { WinLog } from '@/app/lib/types';
import { WinForm } from './WinForm';
import { GardenDisplay } from './GardenDisplay';
import { useToast } from '@/hooks/use-toast';
import { FLOWERS, type Flower } from '@/app/lib/flowers';

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
    
    const dewdropsForNextFlower = costForNext - remainingDewdrops;
    const progressToNextFlower = (remainingDewdrops / costForNext) * 100;
    const totalProgressSteps = costForNext / 10;
    const currentProgressSteps = Math.floor(remainingDewdrops / 10);

    return {
        flowerCount,
        dewdropsForNextFlower,
        progressToNextFlower,
        totalProgressSteps,
        currentProgressSteps,
    };
};

const getRandomFlower = (exclude: Flower[] = []): Flower => {
  const availableFlowers = FLOWERS.filter(
    (f) => !exclude.some((e) => e.name === f.name)
  );
  const pool = availableFlowers.length > 0 ? availableFlowers : FLOWERS;
  return pool[Math.floor(Math.random() * pool.length)];
};


type WinBloomDashboardProps = {
  onShowFeedback: (feedback: {
    didBloom: boolean;
    flower?: Flower;
    progress?: {
      dewdropsForNextFlower: number;
      progressToNextFlower: number;
      currentTargetFlower: Flower | null;
    }
  }) => void;
}

export function WinBloomDashboard({ onShowFeedback }: WinBloomDashboardProps) {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  const [bloomedFlowers, setBloomedFlowers] = useState<string[]>([]);
  const [currentTargetFlower, setCurrentTargetFlower] = useState<Flower | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedDewdrops = localStorage.getItem('winbloom-dewdrops') || '0';
    const savedLogs = localStorage.getItem('winbloom-logs') || '[]';
    const savedBloomedFlowers = localStorage.getItem('winbloom-bloomed-flowers') || '[]';
    const savedTargetFlower = localStorage.getItem('winbloom-target-flower');

    const initialDewdrops = JSON.parse(savedDewdrops);
    const initialLogs = JSON.parse(savedLogs);
    
    const { flowerCount } = calculateFlowerGrowth(initialDewdrops);
    const initialBloomedFlowers = JSON.parse(savedBloomedFlowers);

    setDewdrops(initialDewdrops);
    setLogs(initialLogs);

    if (initialBloomedFlowers.length < flowerCount) {
        const flowersToAdd = flowerCount - initialBloomedFlowers.length;
        const newBlooms = [...initialBloomedFlowers];
        for (let i = 0; i < flowersToAdd; i++) {
            newBlooms.push(FLOWERS[newBlooms.length % FLOWERS.length].icon);
        }
        setBloomedFlowers(newBlooms);
        localStorage.setItem('winbloom-bloomed-flowers', JSON.stringify(newBlooms));
    } else {
        setBloomedFlowers(initialBloomedFlowers);
    }
    
    if (savedTargetFlower) {
      setCurrentTargetFlower(JSON.parse(savedTargetFlower));
    } else {
      const initialTarget = getRandomFlower();
      setCurrentTargetFlower(initialTarget);
      localStorage.setItem('winbloom-target-flower', JSON.stringify(initialTarget));
    }
  }, []);

  const {
      flowerCount,
      dewdropsForNextFlower,
      progressToNextFlower,
      totalProgressSteps,
      currentProgressSteps,
  } = useMemo(() => calculateFlowerGrowth(dewdrops), [dewdrops]);

  
  const handleWinLog = (win: string, gratitude: string) => {
    const newLog: WinLog = {
      id: new Date().toISOString(),
      win,
      gratitude,
      date: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('winbloom-logs', JSON.stringify(updatedLogs));

    const previousDewdrops = dewdrops;
    const updatedDewdrops = previousDewdrops + 10;
    setDewdrops(updatedDewdrops);
    localStorage.setItem('winbloom-dewdrops', JSON.stringify(updatedDewdrops));
    
    const { flowerCount: prevFlowerCount } = calculateFlowerGrowth(previousDewdrops);
    const { flowerCount: newFlowerCount, dewdropsForNextFlower: nextDewdrops, progressToNextFlower: nextProgress } = calculateFlowerGrowth(updatedDewdrops);

    if (newFlowerCount > prevFlowerCount) {
      const flowerToBloom = currentTargetFlower || getRandomFlower();
      
      const updatedBloomedFlowers = [...bloomedFlowers, flowerToBloom.icon];
      setBloomedFlowers(updatedBloomedFlowers);
      localStorage.setItem('winbloom-bloomed-flowers', JSON.stringify(updatedBloomedFlowers));

      const newTarget = getRandomFlower(updatedBloomedFlowers.map(icon => FLOWERS.find(f => f.icon === icon)).filter(Boolean) as Flower[]);
      setCurrentTargetFlower(newTarget);
      localStorage.setItem('winbloom-target-flower', JSON.stringify(newTarget));

      onShowFeedback({
        didBloom: true,
        flower: flowerToBloom,
      });
    } else {
      onShowFeedback({
        didBloom: false,
        progress: {
          dewdropsForNextFlower: nextDewdrops,
          progressToNextFlower: nextProgress,
          currentTargetFlower: currentTargetFlower
        }
      });
    }
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}
