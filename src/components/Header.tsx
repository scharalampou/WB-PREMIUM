import { Leaf } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Leaf className="text-primary size-7" />
          <h1 className="text-2xl font-headline font-bold text-primary">
            WinBloom
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
