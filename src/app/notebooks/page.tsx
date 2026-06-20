
"use client"

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Library,
  Scale,
  Languages,
  Book,
  TrendingUp,
  Filter,
  ArrowRight,
  Edit2,
  Home,
  Trash2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { Notebook } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const iconsMap: Record<string, any> = {
  Scale,
  Languages,
  Book,
  TrendingUp,
  Library
};

const colors = [
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Violet', value: '#8B5CF6' },
];

export default function NotebooksPage() {
  const { getNotebooks, saveNotebook, deleteNotebook, getContents, isPending } = useStore();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(colors[0].value);
  const [newIcon, setNewIcon] = useState("Library");

  useEffect(() => {
    setMounted(true);
    setNotebooks(getNotebooks());
    setContents(getContents());
  }, [getNotebooks, getContents]);

  if (!mounted) return null;

  const refreshData = () => {
    setNotebooks(getNotebooks());
    setContents(getContents());
  };

  const filtered = notebooks.filter(nb => 
    nb.name.toLowerCase().includes(search.toLowerCase())
  );

  const getPendingCount = (notebookId: string) => {
    const now = new Date();
    return contents.filter(c => 
      c.notebookId === notebookId && isPending(c.nextReviewDate, now)
    ).length;
  };

  const handleSaveNotebook = () => {
    if (!newName.trim()) return;
    
    const notebookData: Notebook = {
      id: editingId || crypto.randomUUID(),
      name: newName,
      color: newColor,
      icon: newIcon,
      createdAt: editingId ? (notebooks.find(n => n.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      contentCount: editingId ? (notebooks.find(n => n.id === editingId)?.contentCount || 0) : 0
    };

    saveNotebook(notebookData);
    refreshData();
    resetForm();
    setIsCreateOpen(false);
    toast({ 
      title: editingId ? "Caderno Atualizado" : "Caderno Criado", 
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewName("");
    setNewColor(colors[0].value);
    setNewIcon("Library");
  };

  const handleEdit = (nb: Notebook) => {
    setEditingId(nb.id);
    setNewName(nb.name);
    setNewColor(nb.color);
    setNewIcon(nb.icon);
    setIsCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNotebook(id);
    refreshData();
    toast({ title: "Excluído", description: "Caderno removido permanentemente." });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 max-w-7xl mx-auto pb-24 md:pb-8">
      <header className="flex flex-col gap-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] w-fit">
          <Home className="w-3.5 h-3.5" />
          Início
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">Biblioteca</h1>
            <p className="text-xs md:text-base text-muted-foreground font-medium">Gerencie suas disciplinas e conteúdos de estudo.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white gap-3 h-12 md:h-14 px-8 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                NOVO CADERNO
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-[450px] bg-card border-border rounded-[2rem] p-6 md:p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-headline text-2xl md:text-3xl font-bold">
                  {editingId ? "Editar Caderno" : "Novo Caderno"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Personalize sua nova disciplina de estudo.</p>
              </DialogHeader>
              <div className="grid gap-8 py-2">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">Nome da Disciplina</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Direito Civil, Inglês Básico..." 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-12 md:h-14 bg-background/50 border-border/50 rounded-xl"
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">Identidade Visual</Label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setNewColor(c.value)}
                        className={`w-9 h-9 md:w-11 md:h-11 rounded-full transition-all flex items-center justify-center ${newColor === c.value ? 'ring-4 ring-white ring-offset-4 ring-offset-background scale-110' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                        style={{ backgroundColor: c.value }}
                      >
                        {newColor === c.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground">Ícone Representativo</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.keys(iconsMap).map((iconName) => {
                      const IconComp = iconsMap[iconName];
                      return (
                        <Button
                          key={iconName}
                          variant={newIcon === iconName ? "default" : "outline"}
                          className={`h-12 md:h-14 w-full p-0 rounded-xl transition-all ${newIcon === iconName ? 'bg-primary shadow-lg shadow-primary/20' : 'border-border/50 bg-background/50'}`}
                          onClick={() => setNewIcon(iconName)}
                        >
                          <IconComp className={cn("w-5 h-5 md:w-6 md:h-6", newIcon === iconName ? "text-white" : "text-muted-foreground")} />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-10 flex-col sm:flex-row gap-3">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="w-full sm:w-auto order-2 sm:order-1 h-12 rounded-xl font-bold text-muted-foreground">Cancelar</Button>
                <Button onClick={handleSaveNotebook} className="w-full sm:w-auto order-1 sm:order-2 h-12 px-10 rounded-xl font-bold shadow-xl shadow-primary/20">
                  {editingId ? "Salvar Alterações" : "Criar Caderno"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Buscar nos seus cadernos..." 
          className="pl-12 bg-card/40 border-border/50 focus:border-primary transition-all h-12 md:h-16 rounded-2xl text-sm md:text-lg font-medium shadow-sm backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {filtered.map((nb) => {
          const Icon = iconsMap[nb.icon] || Library;
          const pending = getPendingCount(nb.id);
          
          return (
            <Card key={nb.id} className="group relative overflow-hidden border-none bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm rounded-[2rem]">
              <Link href={`/notebooks/${nb.id}`} className="absolute inset-0 z-10" aria-label={`Ver caderno ${nb.name}`} />
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="p-3 md:p-4 rounded-[1.25rem] text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: nb.color }}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="relative z-20 flex gap-2">
                    {pending > 0 && (
                      <Badge className="bg-accent text-white border-none animate-pulse h-6 text-[9px] md:text-[10px] px-2.5 font-bold rounded-lg shadow-lg shadow-accent/20">
                        <Zap className="w-3 h-3 mr-1.5 fill-current" />
                        {pending} REVISAR
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 text-muted-foreground hover:bg-background/50 rounded-xl">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl p-2 min-w-[160px]">
                        <DropdownMenuItem className="rounded-lg h-10 font-medium" onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(nb);
                        }}>
                          <Edit2 className="w-4 h-4 mr-3" />
                          Editar Caderno
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive rounded-lg h-10 font-medium" onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(nb.id);
                        }}>
                          <Trash2 className="w-4 h-4 mr-3" />
                          Excluir Permanentemente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="space-y-1 mb-6">
                  <h3 className="text-xl md:text-2xl font-bold font-headline group-hover:text-primary transition-colors truncate pr-2">{nb.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-[0.1em]">
                    Desde {new Date(nb.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-border/30">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs md:text-sm font-bold text-foreground">{nb.contentCount} itens</span>
                    {pending > 0 ? (
                      <span className="text-[9px] md:text-[10px] font-bold text-accent uppercase tracking-widest animate-pulse">
                         Pendentes hoje
                      </span>
                    ) : (
                      <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                         Em dia
                      </span>
                    )}
                  </div>
                  <div className="bg-background/50 p-2 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex flex-col items-center justify-center p-10 rounded-[2rem] border-2 border-dashed border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-[220px] md:min-h-[280px]"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] bg-muted/50 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:scale-110">
              <Plus className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <p className="font-bold text-sm md:text-base text-muted-foreground group-hover:text-primary transition-all uppercase tracking-[0.2em]">Criar Novo Caderno</p>
          </button>
        )}
      </div>
    </div>
  );
}
