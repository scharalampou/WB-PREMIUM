
"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { WinBloomDashboard } from '@/components/WinBloomDashboard';
import { GlobalFeed } from '@/components/GlobalFeed';
import { GrowthHistory } from '@/components/GrowthHistory';
import { BottomNav } from '@/components/BottomNav';
import { LogFeedback } from '@/components/LogFeedback';
import type { Flower } from '@/app/lib/flowers';

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

export default function Home() {
  const [feedbackData, setFeedbackData] = useState<FeedbackState>({ isOpen: false, didBloom: false });
  const [key, setKey] = useState(Date.now()); // Used to force re-render of dashboard

  const handleShowFeedback = (feedback: Omit<FeedbackState, 'isOpen'>) => {
    setFeedbackData({ ...feedback, isOpen: true });
  };

  const handleFeedbackClose = () => {
    setFeedbackData({ isOpen: false, didBloom: false });
    // Force a re-render of the dashboard to ensure flower list is updated
    setKey(Date.now()); 
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {feedbackData.isOpen && (
        <LogFeedback
          feedback={feedbackData}
          onClose={handleFeedbackClose}
        />
      )}
      <Tabs defaultValue="garden" className="w-full">
        <Header />
        <main className="container mx-auto px-4 pt-3 pb-28 sm:pb-8">
            <TabsContent value="garden" className="mt-6 space-y-6">
              <WinBloomDashboard key={key} onShowFeedback={handleShowFeedback} />
            </TabsContent>
            <TabsContent value="history" className="mt-6 space-y-6">
              <GrowthHistory />
            </TabsContent>
            <TabsContent value="global" className="mt-6 space-y-6">
              <GlobalFeed />
            </TabsContent>
        </main>
        <BottomNav onShowFeedback={handleShowFeedback} />
      </Tabs>
    </div>
  );
}
