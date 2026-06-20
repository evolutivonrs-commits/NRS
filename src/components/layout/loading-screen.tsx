"use client"

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Simula o tempo de carregamento inicial ou espera a montagem do app
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2000); // 500ms após o fade out começar

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        
        {/* Animated Logo */}
        <div className="relative bg-primary p-6 rounded-[2rem] shadow-2xl shadow-primary/40 animate-in zoom-in-50 duration-500">
          <Zap className="w-16 h-16 text-primary-foreground fill-current animate-pulse" />
        </div>
      </div>
      
      {/* App Name */}
      <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <h1 className="text-3xl font-bold font-headline tracking-tighter">Lexis Pulse</h1>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
