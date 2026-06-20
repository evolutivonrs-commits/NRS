
"use client"

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Repeat, 
  History, 
  Target, 
  Flame, 
  CheckCircle2,
  PlayCircle,
  PlusCircle,
  ChevronRight,
  Calendar,
  Zap,
  Home,
  HelpCircle,
  BrainCircuit,
  Clock,
  Info
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { getNotebooks, getStats, getPendingReviews, getContents, isPending } = useStore();
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  const chartData = useMemo(() => [
    { name: 'S', count: 4 },
    { name: 'T', count: 7 },
    { name: 'Q', count: 3 },
    { name: 'Q', count: 9 },
    { name: 'S', count: 5 },
    { name: 'S', count: 12 },
    { name: 'D', count: 8 },
  ], []);

  useEffect(() => {
    setMounted(true);
    setToday(new Date());
  }, []);

  const notebooks = useMemo(() => getNotebooks(), [getNotebooks, mounted]);
  const stats = useMemo(() => getStats(), [getStats, mounted]);
  const allContents = useMemo(() => getContents(), [getContents, mounted]);
  const pendingReviews = useMemo(() => today ? getPendingReviews(today) : [], [getPendingReviews, today, mounted]);

  if (!mounted || !today) return null;

  const getPendingCountForNotebook = (notebookId: string) => {
    return allContents.filter(c => 
      c.notebookId === notebookId && isPending(c.nextReviewDate, today)
    ).length;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1 md:space-y-2">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit mb-1">
            <Home className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Início
          </Link>
          <h1 className="text-2xl md:text-5xl font-bold font-headline text-foreground leading-tight tracking-tight">Bem-vindo, Estudioso</h1>
          <p className="text-xs md:text-base text-muted-foreground font-medium">
            {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all h-12 w-12 md:h-14 md:w-14">
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md bg-card border-border rounded-2xl overflow-hidden p-0">
              <div className="bg-primary/10 p-6 md:p-8 flex items-center gap-4">
                <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <div>
                  <DialogTitle className="font-headline text-xl md:text-2xl">Método Lexis Pulse</DialogTitle>
                  <p className="text-xs md:text-sm text-primary/70 font-medium">Ciência aplicada ao seu estudo</p>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                <section className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Fundamento Científico</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos o algoritmo <strong>SM-2 (SuperMemo-2)</strong>. Ele calcula o momento exato em que seu cérebro está prestes a esquecer uma informação para propor uma revisão.
                  </p>
                </section>
                <section className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Níveis de Avaliação</h4>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">1</div>
                      <div>
                        <p className="text-sm font-bold">Esqueci</p>
                        <p className="text-xs text-muted-foreground">O item volta para o início do ciclo de aprendizagem.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xs">2</div>
                      <div>
                        <p className="text-sm font-bold">Parcial</p>
                        <p className="text-xs text-muted-foreground">Lembrou com esforço. O intervalo de revisão será moderado.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">3</div>
                      <div>
                        <p className="text-sm font-bold">Lembro</p>
                        <p className="text-xs text-muted-foreground">Conhecimento sólido. O intervalo será expandido significativamente.</p>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </DialogContent>
          </Dialog>

          {pendingReviews.length > 0 ? (
            <Button size="lg" className="flex-1 md:flex-none bg-accent hover:bg-accent/90 text-white font-bold gap-3 shadow-xl shadow-accent/20 h-12 md:h-14 px-8 rounded-xl text-sm md:text-base transition-all active:scale-95" asChild>
              <Link href="/review">
                <PlayCircle className="w-5 h-5" />
                ESTUDAR ({pendingReviews.length})
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white font-bold gap-3 shadow-xl shadow-primary/20 h-12 md:h-14 px-8 rounded-xl text-sm md:text-base transition-all active:scale-95" asChild>
              <Link href="/notebooks">
                <PlusCircle className="w-5 h-5" />
                {notebooks.length > 0 ? 'ADICIONAR' : 'COMEÇAR'}
              </Link>
            </Button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Link href="/notebooks" className="block transition-all hover:scale-[1.03] active:scale-95">
          <StatCard 
            title="Cadernos" 
            value={stats?.notebooksCount || 0} 
            icon={BookOpen} 
            iconColor="bg-indigo-500/10 text-indigo-500"
            description="Disciplinas ativas"
          />
        </Link>
        <Link href="/review/queue" className="block transition-all hover:scale-[1.03] active:scale-95">
          <StatCard 
            title="Revisar" 
            value={pendingReviews.length} 
            icon={Repeat} 
            iconColor="bg-sky-500/10 text-sky-500"
            description="Itens pendentes"
          />
        </Link>
        <StatCard 
          title="Sequência" 
          value={stats?.dailyStreak || 0} 
          icon={Flame} 
          iconColor="bg-rose-500/10 text-rose-500"
          description="Dias seguidos"
        />
        <StatCard 
          title="Dominados" 
          value={stats?.dominatedContents || 0} 
          icon={CheckCircle2} 
          iconColor="bg-emerald-500/10 text-emerald-500"
          description="Retenção alta"
          info={
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-emerald-500/20 text-emerald-500">
                  <Info className="w-3.5 h-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Materiais Dominados
                  </DialogTitle>
                  <DialogDescription asChild className="pt-4 space-y-4 text-foreground/80">
                    <div className="text-sm">
                      <p>
                        Um material é considerado <strong>Dominado</strong> quando o algoritmo de repetição espaçada identifica que você tem uma altíssima probabilidade de retenção a longo prazo.
                      </p>
                      <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-2 mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Critério Técnico</p>
                        <p>
                          O conteúdo atingiu um <strong>Fator de Facilidade (EF) superior a 2.8</strong>.
                        </p>
                      </div>
                      <p className="mt-4">
                        Isso significa que você respondeu "Dominei" consistentemente nas revisões recentes e o intervalo entre as sessões para este item está se tornando cada vez maior.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          }
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <Card className="lg:col-span-2 border-none bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="p-5 md:p-8 pb-0 md:pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-xl font-headline font-bold">Atividade Semanal</CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium">Materiais revisados nos últimos 7 dias</CardDescription>
              </div>
              <Badge variant="outline" className="h-6 md:h-7 px-2 border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs">
                Performance
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[220px] md:h-[350px] w-full p-4 md:p-8 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600}}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <section className="space-y-6">
          <Card className="border-none bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-6 md:p-8 relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl font-headline leading-tight">Meta de Foco</h4>
                  <p className="text-white/70 text-[10px] md:text-xs uppercase font-bold tracking-[0.2em]">{stats?.dailyStreak || 0} dias ativos</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Progresso Semanal</span>
                  <span>{Math.round(Math.min(((stats?.dailyStreak || 0) / 7) * 100, 100))}%</span>
                </div>
                <Progress value={stats?.dailyStreak ? Math.min((stats.dailyStreak / 7) * 100, 100) : 0} className="h-2 bg-white/20" indicatorClassName="bg-white shadow-[0_0_10px_white]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/40 backdrop-blur-md shadow-sm">
            <CardHeader className="p-5 md:p-8 pb-2">
              <CardTitle className="text-sm md:text-lg font-headline font-bold flex items-center gap-2">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                Nível de Retenção
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 md:p-8 pt-0">
              <div className="flex items-end justify-between gap-4">
                <span className="text-3xl md:text-5xl font-bold font-headline leading-none">{stats?.retentionRate || 0}%</span>
                <div className="text-right">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] md:text-xs font-bold mb-1">ALTA PERFORMANCE</Badge>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Sua memória está otimizada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <Card className="border-none bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="p-5 md:p-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-2xl font-headline font-bold">Para Revisar</CardTitle>
              <Link href="/review/queue" className="text-[10px] md:text-xs font-bold text-primary hover:underline uppercase tracking-widest">VER FILA COMPLETA</Link>
            </div>
          </CardHeader>
          <CardContent className="p-5 md:p-8 pt-0">
            {pendingReviews.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {pendingReviews.slice(0, 3).map((item) => (
                  <Link key={item.id} href="/review">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-transparent hover:border-primary/10 transition-all hover:bg-background/80 group active:scale-[0.98]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-base">
                          {item.title[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm md:text-base truncate max-w-[180px] md:max-w-xs">{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Urgente</p>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 md:py-16 text-center text-muted-foreground border-2 border-dashed border-border/20 rounded-3xl bg-background/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-4" />
                <h4 className="font-bold text-sm md:text-base text-foreground mb-1">Tudo em dia!</h4>
                <p className="text-xs">Sua mente está perfeitamente sincronizada.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-card/40 backdrop-blur-md shadow-sm">
          <CardHeader className="p-5 md:p-8">
            <CardTitle className="text-base md:text-2xl font-headline font-bold">Meus Cadernos</CardTitle>
          </CardHeader>
          <CardContent className="p-5 md:p-8 pt-0">
            {notebooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {notebooks.slice(0, 4).map((nb) => {
                  const pendingCount = getPendingCountForNotebook(nb.id);
                  return (
                    <Link key={nb.id} href={`/notebooks/${nb.id}`}>
                      <div className="p-4 md:p-5 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/60 transition-all relative overflow-hidden h-full flex flex-col justify-between group active:scale-[0.98] shadow-sm">
                        <div 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-xl mb-4 flex items-center justify-center text-white text-base md:text-lg shadow-lg"
                          style={{ backgroundColor: nb.color }}
                        >
                          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        {pendingCount > 0 && (
                          <div className="absolute top-4 right-4">
                            <div className="bg-accent text-white h-2.5 w-2.5 md:h-3 md:w-3 rounded-full animate-pulse shadow-[0_0_12px_hsl(var(--accent))]" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-xs md:text-base truncate mb-1 group-hover:text-primary transition-colors">{nb.name}</h4>
                          <p className="text-[10px] md:text-xs text-muted-foreground uppercase font-bold tracking-tight">{(nb.contentCount || 0)} itens</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 md:py-16 text-center text-muted-foreground border-2 border-dashed border-border/20 rounded-3xl bg-background/10">
                <PlusCircle className="w-10 h-10 text-primary/50 mx-auto mb-4" />
                <h4 className="font-bold text-sm md:text-base text-foreground mb-1">Nenhum caderno</h4>
                <p className="text-xs">Crie seu primeiro caderno para começar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
