"use client";

import { useState } from 'react';
import { Menu, Sprout, History, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TabsList, TabsTrigger } from './ui/tabs';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Main Menu</SheetTitle>
        </SheetHeader>
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
