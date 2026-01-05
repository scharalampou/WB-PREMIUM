"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    // Render a placeholder or null on the server and initial client render
    return <div className="flex items-center space-x-2 h-9 w-20" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={theme === 'light' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
      >
        <Sun className="h-6 w-6" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
      >
        <Moon className="h-6 w-6" />
      </Button>
    </div>
  )
}
