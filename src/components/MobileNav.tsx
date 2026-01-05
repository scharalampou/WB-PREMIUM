"use client";

import { useState } from 'react';
import { Menu, Sprout, History, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useTabsContext } from './ui/tabs'; // Assuming you can export context

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // A simple trick to get the Tabs context functions. This is not ideal.
  // In a real app, you might lift state up or use a different navigation library.
  // For this demo, we can simulate a click on the real (but hidden) tabs.
  const handleNavClick = (value: string) => {
    const trigger = document.getElementById(`radix--trigger-${value}`);
    if (trigger) {
      trigger.click();
    }
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col space-y-4 pt-8">
            <TabsList className="grid grid-cols-1 h-auto">
                <TabsTrigger value="garden" onClick={() => setIsOpen(false)}>
                    <Sprout className="mr-2 h-4 w-4" />
                    My Garden
                </TabsTrigger>
                <TabsTrigger value="history" onClick={() => setIsOpen(false)}>
                    <History className="mr-2 h-4 w-4" />
                    My Growth
                </TabsTrigger>
                <TabsTrigger value="global" onClick={() => setIsOpen(false)}>
                    <Users className="mr-2 h-4 w-4" />
                    Community
                </TabsTrigger>
            </TabsList>
        </div>
      </SheetContent>
    </Sheet>
  );
}
