
"use client"

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  History, 
  Search, 
  Zap,
  ChevronRight,
  BookOpen,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { Content } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ReviewQueuePage() {
  const { getContents, getNotebooks, isPending } = useStore();
  const [contents, setContents] = useState<Content[]>([]);
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setToday(now);
    setContents(getContents());
    setNotebooks(getNotebooks());
  }, [getContents, getNotebooks]);

  if (!mounted || !today) return null;

  const pending = contents
    .filter(c => isPending(c.nextReviewDate, today))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime());

  const upcoming = contents
    .filter(c => !isPending(c.nextReviewDate, today))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime());

  const getNotebookName = (id: string) => notebooks.find(n => n.id === id)?.name || "Geral";
  const getNotebookColor = (id: string) => notebooks.find(n => n.id === id)?.color || "#6366F1";

  const MaterialCard = ({ item }: { item: Content }) => (
    <Card className="border-none bg-card/50 backdrop-blur-sm hover:bg-card transition-all group mb-3 last:mb-0 overflow-hidden shadow-sm border border-transparent hover:border-primary/20">
      <CardContent className="p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex shrink-0 items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: getNotebookColor(item.notebookId) }}
          >
            <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm md:text-lg group-hover:text-primary transition-colors truncate">{item.title}</h4>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 md:gap-x-5 text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-sky-400" />
                {new Date(item.nextReviewDate).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-indigo-400" />
                Ciclo: {item.sm2.interval}d
              </span>
              <Badge variant="outline" className="text-[7px] md:text-[9px] h-4 px-1 bg-background/50 border-primary/20 text-primary">
                {getNotebookName(item.notebookId)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {isPending(item.nextReviewDate, today) ? (
            <Button size="sm" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white h-9 md:h-11 px-6 md:px-8 rounded-xl text-[10px] md:text-xs font-bold shadow-lg shadow-accent/20" asChild>
              <Link href="/review">ESTUDAR</Link>
            </Button>
          ) : (
             <Button variant="outline" size="sm" className="w-full md:w-auto h-9 md:h-11 px-4 md:px-6 rounded-xl text-[10px] md:text-xs font-bold border-border/50" asChild>
                <Link href={`/notebooks/${item.notebookId}`}>
                  VER
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
             </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-5xl mx-auto pb-24">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit">
            <Home className="w-3 h-3 md:w-4 md:h-4" />
            Início
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-1">Fila de Estudo</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Veja o que você precisa revisar hoje.</p>
          </div>
          {pending.length > 0 && (
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold gap-2 shadow-lg shadow-accent/20 w-full md:w-auto h-12 md:h-14 rounded-xl px-8 text-base md:text-lg" asChild>
              <Link href="/review">
                <Zap className="w-5 h-5 md:w-6 md:h-6" />
                ESTUDAR ({pending.length})
              </Link>
            </Button>
          )}
        </div>
      </header>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Buscar na fila..." 
          className="pl-11 md:pl-12 h-11 md:h-14 bg-card/50 border-border/50 focus:border-primary text-sm md:text-base rounded-xl md:rounded-2xl shadow-sm transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-background/50 h-11 md:h-14 p-1 mb-6 md:mb-8 rounded-xl md:rounded-2xl border border-border/30">
          <TabsTrigger value="pending" className="rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-white shadow-none uppercase tracking-widest">
            PARA HOJE ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-white shadow-none uppercase tracking-widest">
            PRÓXIMAS ({upcoming.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {pending.length > 0 ? (
            pending.map(item => <MaterialCard key={item.id} item={item} />)
          ) : (
            <div className="text-center py-16 md:py-32 border-2 border-dashed border-border/30 rounded-2xl md:rounded-[2.5rem] bg-card/10">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl md:text-2xl font-bold font-headline mb-1">Mente em Dia!</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Você completou tudo por hoje.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {upcoming.length > 0 ? (
            upcoming.map(item => <MaterialCard key={item.id} item={item} />)
          ) : (
            <div className="text-center py-16 md:py-32 border-2 border-dashed border-border/30 rounded-2xl md:rounded-[2.5rem] bg-card/10">
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl md:text-2xl font-bold font-headline mb-1">Sem Agendamentos</h3>
              <p className="text-xs md:text-sm text-muted-foreground">Nenhuma revisão futura.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
