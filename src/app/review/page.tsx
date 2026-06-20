
"use client"

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  Zap, 
  ArrowLeft,
  FileText,
  Music,
  Video,
  Image as ImageIcon,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Content, ReviewRating } from "@/lib/types";

export default function ReviewPage() {
  const { getPendingReviews, updateContentReview, getNotebooks } = useStore();
  const [reviews, setReviews] = useState<Content[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState({ forgot: 0, partial: 0, remembered: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pending = getPendingReviews();
    setReviews(pending);
  }, [getPendingReviews]);

  if (!mounted) return null;

  if (reviews.length === 0 && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 md:w-16 md:h-16 text-primary fill-current" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold font-headline leading-tight tracking-tight">Mente em Dia!</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xs md:max-w-md mx-auto leading-relaxed">
            Parabéns! Você completou todas as suas revisões para hoje. Seu conhecimento está sendo consolidado.
          </p>
        </div>
        <div className="pt-8 w-full max-w-xs flex flex-col gap-4">
          <Button asChild className="w-full bg-primary h-14 rounded-2xl text-base md:text-lg font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
            <Link href="/notebooks">Explorar Biblioteca</Link>
          </Button>
          <Button asChild variant="ghost" className="gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            <Link href="/">
              <Home className="w-4 h-4" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const current = reviews[currentIdx];
  const progress = reviews.length > 0 ? (currentIdx / reviews.length) * 100 : 0;
  const notebook = getNotebooks().find(n => n.id === current?.notebookId);

  const handleRating = (rating: ReviewRating) => {
    if (!current) return;
    updateContentReview(current.id, rating);
    setResults(prev => ({ ...prev, [rating]: prev[rating as keyof typeof results] + 1 }));

    if (currentIdx < reviews.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/10">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Sessão Concluída!</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xs md:max-w-md mx-auto">
            Sua retenção a longo prazo agradece. Aqui está o resumo:
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-8 w-full max-w-md pt-8 bg-card/40 p-6 md:p-10 rounded-[2rem] border border-border/50 shadow-2xl">
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-bold text-emerald-400">{results.remembered}</p>
            <p className="text-[9px] md:text-[11px] text-muted-foreground uppercase font-bold tracking-widest">Dominei</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-bold text-sky-400">{results.partial}</p>
            <p className="text-[9px] md:text-[11px] text-muted-foreground uppercase font-bold tracking-widest">Esforcei</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-bold text-rose-400">{results.forgot}</p>
            <p className="text-[9px] md:text-[11px] text-muted-foreground uppercase font-bold tracking-widest">Esqueci</p>
          </div>
        </div>
        <div className="pt-10 w-full max-w-xs">
          <Button asChild className="w-full bg-primary h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
            <Link href="/">Finalizar Sessão</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-44 md:pb-8 min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0 h-10 w-10 md:h-12 md:w-12 border border-border/50">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1 flex flex-col gap-2 px-2 md:px-6">
          <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span>Material {currentIdx + 1} de {reviews.length}</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress || 0} className="h-1.5 md:h-2" indicatorClassName="bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        </div>
        <Badge variant="outline" className="shrink-0 h-10 md:h-12 px-4 border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-xl hidden sm:flex">
          <Zap className="w-4 h-4 mr-2 fill-current" />
          Modo Foco
        </Badge>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-8">
        <Card className={cn(
          "w-full max-w-3xl min-h-[380px] md:min-h-[500px] flex flex-col border-none bg-card/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-500 rounded-[2rem] md:rounded-[3rem]",
          showAnswer ? "shadow-primary/10 ring-1 ring-primary/20" : "hover:scale-[1.01]"
        )}>
          <CardContent className="p-8 md:p-16 flex-1 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 relative z-10">
            <div className="space-y-6 w-full">
              <div className="flex justify-center">
                <Badge 
                  className="text-white border-none uppercase tracking-[0.2em] text-[10px] md:text-xs px-5 py-1.5 font-bold shadow-xl rounded-lg"
                  style={{ backgroundColor: notebook?.color || 'var(--primary)' }}
                >
                  {notebook?.name || 'Geral'}
                </Badge>
              </div>
              
              <h2 className="text-2xl md:text-5xl font-bold font-headline tracking-tight leading-tight text-foreground px-2">
                {current.title}
              </h2>

              <p className="text-base md:text-2xl text-muted-foreground max-w-lg mx-auto leading-relaxed italic font-medium opacity-80">
                {current.summary}
              </p>
            </div>

            {!showAnswer && current.media?.images?.length > 0 && (
              <div className="w-full max-w-sm md:max-w-lg mx-auto rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl animate-in zoom-in-95 duration-500">
                <img src={current.media.images[0]} alt="Referência Visual" className="w-full h-auto object-cover max-h-[220px] md:max-h-[300px]" />
              </div>
            )}

            {!showAnswer ? (
              <div className="pt-8 w-full flex justify-center">
                <Button 
                  onClick={() => setShowAnswer(true)}
                  className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white px-12 md:px-20 h-16 md:h-20 rounded-2xl md:rounded-[2rem] font-bold text-xl md:text-2xl shadow-2xl shadow-accent/30 transition-all hover:scale-105 active:scale-95 group"
                >
                  REVELAR EXPLICAÇÃO
                </Button>
              </div>
            ) : (
              <div className="w-full space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left pt-10 border-t border-border/30">
                {(current.media?.videos?.length > 0 || current.media?.audios?.length > 0) && (
                  <div className="grid gap-4 md:gap-6">
                    {current.media?.videos?.map((vid, i) => (
                      <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-border/50 bg-black shadow-2xl">
                        {vid.includes('youtube.com') || vid.includes('youtu.be') ? (
                          <iframe className="w-full h-full" src={vid.replace('watch?v=', 'embed/').split('&')[0]} allowFullScreen />
                        ) : (
                          <video src={vid} controls className="w-full h-full" />
                        )}
                      </div>
                    ))}
                    {current.media?.audios?.map((aud, i) => (
                      <div key={i} className="p-5 bg-background/50 rounded-2xl border border-border/50 flex items-center gap-4 shadow-inner">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                          <Music className="w-5 h-5 text-emerald-500" />
                        </div>
                        <audio src={aud} controls className="flex-1 h-9" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 md:space-y-6 bg-background/50 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-border/50 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/30" />
                  <h4 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                    <FileText className="w-4 h-4 md:w-5 md:h-5" />
                    CONTEÚDO COMPLETO
                  </h4>
                  <p className="text-sm md:text-xl leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                    {current.notes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showAnswer && (
        <div className="fixed bottom-0 left-0 right-0 p-6 md:p-12 bg-background/80 backdrop-blur-3xl border-t border-border/50 animate-in slide-in-from-bottom-full duration-700 z-50">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 md:gap-8">
            <div className="flex items-center justify-center gap-5 text-muted-foreground">
              <div className="h-px flex-1 bg-border/30" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] opacity-60">Como foi seu desempenho?</span>
              <div className="h-px flex-1 bg-border/30" />
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-8">
              <Button 
                variant="outline" 
                onClick={() => handleRating('forgot')}
                className="h-24 md:h-36 flex-col gap-2 md:gap-4 rounded-2xl md:rounded-[2.5rem] border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/20 hover:border-rose-500 transition-all hover:scale-105 active:scale-95 group shadow-lg"
              >
                <XCircle className="w-6 h-6 md:w-10 md:h-10 text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Esqueci</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleRating('partial')}
                className="h-24 md:h-36 flex-col gap-2 md:gap-4 rounded-2xl md:rounded-[2.5rem] border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/20 hover:border-sky-500 transition-all hover:scale-105 active:scale-95 group shadow-lg"
              >
                <HelpCircle className="w-6 h-6 md:w-10 md:h-10 text-sky-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Parcial</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleRating('remembered')}
                className="h-24 md:h-36 flex-col gap-2 md:gap-4 rounded-2xl md:rounded-[2.5rem] border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all hover:scale-105 active:scale-95 group shadow-lg"
              >
                <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Dominei</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
