
"use client";

import { useState } from 'react';
import { Sprout, History, Globe, Plus } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WinForm } from './WinForm';
import { useToast } from '@/hooks/use-toast';
import type { WinLog } from '@/app/lib/types';
import type { Flower } from '@/app/lib/flowers';
import { FLOWERS } from '@/app/lib/flowers';


const FLOWER_COST_TIERS = [
    { from: 0, to: 3, cost: 30 },
    { from: 4, to: 6, cost: 40 },
    { from: 7, to: Infinity, cost: 50 },
];

const calculateFlowerGrowth = (dewdrops: number) => {
    let flowerCount = 0;
    let remainingDewdrops = dewdrops;
    let costForNext = FLOWER_COST_TIERS[0].cost;
    let currentTierIndex = 0;

    while (currentTierIndex < FLOWER_COST_TIERS.length) {
        const tier = FLOWER_COST_TIERS[currentTierIndex];
        const flowersInTier = tier.to - (tier.from > 0 ? tier.from -1 : 0);
        const dewdropsForTier = flowersInTier * tier.cost;

        if (tier.to !== Infinity && remainingDewdrops >= dewdropsForTier) {
            remainingDewdrops -= dewdropsForTier;
            flowerCount += flowersInTier;
            currentTierIndex++;
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

    return {
        flowerCount,
        dewdropsForNextFlower,
        progressToNextFlower,
    };
};

const getRandomFlower = (exclude: Flower[] = []): Flower => {
  const availableFlowers = FLOWERS.filter(
    (f) => !exclude.some((e) => e.name === f.name)
  );
  const pool = availableFlowers.length > 0 ? availableFlowers : FLOWERS;
  return pool[Math.floor(Math.random() * pool.length)];
};


type BottomNavProps = {
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


export function BottomNav({ onShowFeedback }: BottomNavProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleWinLog = (win: string, gratitude: string) => {
    setIsFormOpen(false);
    
    try {
      // --- Read current state from localStorage ---
      const savedLogs = localStorage.getItem('winbloom-logs') || '[]';
      const logs: WinLog[] = JSON.parse(savedLogs);
      const savedDewdrops = localStorage.getItem('winbloom-dewdrops') || '0';
      const previousDewdrops = JSON.parse(savedDewdrops);
      const savedBloomedFlowers = localStorage.getItem('winbloom-bloomed-flowers') || '[]';
      const bloomedFlowers: string[] = JSON.parse(savedBloomedFlowers);
      const savedTargetFlower = localStorage.getItem('winbloom-target-flower');
      const currentTargetFlower: Flower | null = savedTargetFlower ? JSON.parse(savedTargetFlower) : null;
      
      // --- Update state ---
      const newLog: WinLog = { id: new Date().toISOString(), win, gratitude, date: new Date().toISOString() };
      const updatedLogs = [newLog, ...logs];
      const updatedDewdrops = previousDewdrops + 10;
      
      // --- Save updated state ---
      localStorage.setItem('winbloom-logs', JSON.stringify(updatedLogs));
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(updatedDewdrops));

      // --- Determine if a flower bloomed ---
      const { flowerCount: prevFlowerCount } = calculateFlowerGrowth(previousDewdrops);
      const { flowerCount: newFlowerCount, dewdropsForNextFlower, progressToNextFlower } = calculateFlowerGrowth(updatedDewdrops);

      if (newFlowerCount > prevFlowerCount) {
        const flowerToBloom = currentTargetFlower || getRandomFlower();
        
        // Update bloomed flowers list and set new target
        const updatedBloomedFlowers = [...bloomedFlowers, flowerToBloom.icon];
        localStorage.setItem('winbloom-bloomed-flowers', JSON.stringify(updatedBloomedFlowers));
        
        const newTarget = getRandomFlower(updatedBloomedFlowers.map(icon => FLOWERS.find(f => f.icon === icon)).filter(Boolean) as Flower[]);
        localStorage.setItem('winbloom-target-flower', JSON.stringify(newTarget));

        onShowFeedback({
          didBloom: true,
          flower: flowerToBloom,
        });

      } else {
        onShowFeedback({
          didBloom: false,
          progress: {
            dewdropsForNextFlower,
            progressToNextFlower,
            currentTargetFlower,
          },
        });
      }

    } catch (error) {
       console.error("Failed to save to localStorage", error);
       toast({ variant: 'destructive', title: 'Oh no!', description: 'Could not save your win.' });
    }
  };


  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-sm border-t",
      "flex sm:hidden", // Default to flex, hidden on sm and up
      "justify-around pt-2 text-muted-foreground",
      "pb-[env(safe-area-inset-bottom)]"
    )}>
      <TabsList className="grid grid-cols-4 w-full h-full bg-transparent p-0">
        <TabsTrigger value="garden" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
          <Sprout className="size-6" />
          <span className="text-xs font-semibold">My Garden</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
          <History className="size-6" />
          <span className="text-xs font-semibold">My Growth</span>
        </TabsTrigger>
        <TabsTrigger value="global" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
          <Globe className="size-6" />
          <span className="text-xs font-semibold">Bloom Feed</span>
        </TabsTrigger>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center justify-center h-full gap-1 text-[#EA3E7D] dark:text-primary">
              <Plus className="size-6" />
              <span className="text-xs font-semibold">Log A Win</span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Cultivate Your Day</DialogTitle>
            </DialogHeader>
            <WinForm onWinLog={handleWinLog} />
          </DialogContent>
        </Dialog>
      </TabsList>
    </div>
  );
}
