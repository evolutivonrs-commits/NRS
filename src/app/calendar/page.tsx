
"use client"

import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Home,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function CalendarPage() {
  const { getContents } = useStore();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<Record<number, { type: 'new' | 'review' | 'done', count: number }[]>>({});

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (!mounted || !currentDate) return;
    
    const contents = getContents();
    const mapped: Record<number, { type: 'new' | 'review' | 'done', count: number }[]> = {};
    
    contents.forEach(c => {
      if (!c.nextReviewDate) return;
      const reviewDate = new Date(c.nextReviewDate);
      if (reviewDate.getMonth() === currentDate.getMonth() && reviewDate.getFullYear() === currentDate.getFullYear()) {
        const day = reviewDate.getDate();
        if (!mapped[day]) mapped[day] = [];
        
        const type = (c.sm2?.repetition === 0 || !c.sm2) ? 'new' : 'review';
        const existing = mapped[day].find(e => e.type === type);
        if (existing) {
          existing.count++;
        } else {
          mapped[day].push({ type, count: 1 });
        }
      }
    });
    setEvents(mapped);
  }, [currentDate, mounted]);

  if (!mounted || !currentDate) return null;

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider w-fit">
          <Home className="w-4 h-4" />
          Início
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Cronograma</h1>
            <p className="text-muted-foreground">Acompanhe seu ciclo de repetição espaçada.</p>
          </div>
          <div className="flex items-center gap-2 bg-card p-1 rounded-xl border border-border/50 shadow-sm">
            <Button variant="ghost" size="sm" onClick={handleGoToToday} className="text-[10px] font-bold uppercase tracking-wider px-3 h-8 hover:bg-primary/10 hover:text-primary">
              HOJE
            </Button>
            <div className="w-px h-4 bg-border/50 mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(year, month - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 font-bold font-headline min-w-[160px] text-center text-sm md:text-base">
              {monthNames[month]} {year}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(year, month + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="border-none bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-border/50 bg-background/20">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-border/50 bg-background/10" />
                ))}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = events[day] || [];
                  const realToday = new Date();
                  const isToday = day === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear();
                  
                  return (
                    <div 
                      key={day} 
                      className={cn(
                        "min-h-[100px] md:min-h-[120px] p-2 border-r border-b border-border/50 hover:bg-background/50 transition-colors cursor-pointer group",
                        isToday && "bg-primary/5 ring-1 ring-inset ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                          isToday ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {day}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((ev, idx) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "text-[8px] md:text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center justify-between shadow-sm",
                              ev.type === 'new' && "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
                              ev.type === 'review' && "bg-sky-500/10 text-sky-400 border border-sky-500/20",
                              ev.type === 'done' && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                            )}
                          >
                            <span className="truncate">{ev.count} {ev.type === 'new' ? 'NOVO' : ev.type === 'review' ? 'REVISAR' : 'FEITO'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="border-none bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Foco Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Sincronização</span>
                  <span className="text-emerald-400">Ativa</span>
                </div>
                <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[65%]" />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                As datas são recalculadas dinamicamente com base no seu desempenho nas sessões de revisão.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/50 backdrop-blur-sm border border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20" />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">Novo Conteúdo</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full bg-sky-500 shadow-lg shadow-sky-500/20" />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">Revisões Vencidas</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">Ciclo Concluído</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
