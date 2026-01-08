import { Leaf, Menu, Globe, History, Sprout } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TabsList, TabsTrigger } from './ui/tabs';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background z-10 border-border">
      <div className={cn("container mx-auto px-4 flex items-center justify-between", "py-6")}>
        
        {/* Left Aligned Items */}
        <div className="flex items-center justify-start">
            {/* Desktop Logo (Left) */}
            <div className="hidden md:flex items-center gap-2">
                <Leaf className="text-primary size-7" />
                <h1 className="text-2xl font-headline font-bold text-[#121212] dark:text-primary">
                    WinBloom
                </h1>
            </div>
            {/* Mobile Nav (Hamburger) for medium screens */}
            <div className="hidden sm:block md:hidden">
              <MobileNav />
            </div>
        </div>

        {/* Centered Items */}
        <div className="absolute left-1/2 -translate-x-1/2">
            {/* Mobile/Tablet Logo (Center) */}
            <div className="flex sm:flex md:hidden items-center gap-2">
                <Leaf className="text-primary size-7" />
                <h1 className="text-2xl font-headline font-bold text-[#121212] dark:text-primary">
                WinBloom
                </h1>
            </div>

            {/* Desktop Nav (Center) */}
            <div className="hidden md:flex">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                    <TabsTrigger value="garden">
                    <Sprout className="mr-2 h-4 w-4" />
                    My Garden
                    </TabsTrigger>
                    <TabsTrigger value="history">
                    <History className="mr-2 h-4 w-4" />
                    My Growth
                    </TabsTrigger>
                    <TabsTrigger value="global">
                    <Globe className="mr-2 h-4 w-4" />
                    Bloom Feed
                    </TabsTrigger>
                </TabsList>
            </div>
        </div>


        {/* Right Aligned Items */}
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
