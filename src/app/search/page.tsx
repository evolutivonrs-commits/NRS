
"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Search as SearchIcon, 
  BookOpen, 
  FileText,
  ChevronRight,
  History,
  Home
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function SearchPage() {
  const { getNotebooks, getContents } = useStore();
  const [query, setQuery] = useState("");
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotebooks(getNotebooks());
    setContents(getContents());
  }, []);

  if (!mounted) return null;

  const notebookResults = notebooks.filter(nb => 
    nb.name.toLowerCase().includes(query.toLowerCase())
  ).map(nb => ({ ...nb, type: 'notebook', subtitle: `${nb.contentCount} materiais`, link: `/notebooks/${nb.id}` }));

  const contentResults = contents.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.summary.toLowerCase().includes(query.toLowerCase())
  ).map(c => {
    const nb = notebooks.find(n => n.id === c.notebookId);
    return { ...c, type: 'content', subtitle: `${nb?.name || 'Geral'} > Material`, link: `/notebooks/${c.notebookId}` };
  });

  const filtered = query.length > 1 ? [...notebookResults, ...contentResults] : [];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <header className="space-y-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider w-fit">
          <Home className="w-4 h-4" />
          Início
        </Link>
        <h1 className="text-4xl font-bold font-headline text-foreground">Busca Global</h1>
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Buscar notas, cadernos, conceitos..." 
            className="pl-12 h-14 bg-card border-border/50 focus:border-primary text-lg rounded-2xl shadow-xl shadow-background"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {query.length <= 1 ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">
              <History className="w-4 h-4" />
              Categorias Populares
            </div>
            <div className="flex flex-wrap gap-2">
              {notebooks.map(nb => (
                <Button key={nb.id} variant="outline" className="rounded-full border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => setQuery(nb.name)}>
                  {nb.name}
                </Button>
              ))}
              {notebooks.length === 0 && <p className="text-sm text-muted-foreground">Nenhum caderno criado ainda.</p>}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Encontrados {filtered.length} resultados</p>
          </div>

          <div className="space-y-3">
            {filtered.map((result, idx) => (
              <Link key={`${result.type}-${idx}`} href={result.link}>
                <Card className="border-none bg-card/50 hover:bg-card transition-all cursor-pointer group shadow-sm mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        result.type === 'notebook' ? "bg-indigo-500/10 text-indigo-500" : "bg-accent/10 text-accent"
                      )}>
                        {result.type === 'notebook' ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold group-hover:text-primary transition-colors">{result.name || result.title}</h4>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground">Tente buscar por algo diferente ou verifique a ortografia.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
