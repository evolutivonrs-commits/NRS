
"use client"

import { useState, useEffect, use, useRef, useCallback } from "react";
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  ChevronRight,
  Library as LibraryIcon,
  Scale,
  Languages,
  Book,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Video,
  Music,
  Upload,
  Loader2,
  Home,
  Link as LinkIcon,
  ExternalLink,
  History,
  Target,
  Clock,
  File as FileIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Notebook, Content } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const iconsMap: Record<string, any> = {
  Scale,
  Languages,
  Book,
  TrendingUp,
  Library: LibraryIcon
};

export default function NotebookDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(props.params);
  const id = unwrappedParams.id;
  
  const { getNotebookById, getContentsByNotebook, saveContent, deleteContent } = useStore();
  
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState("");
  const [cSummary, setCSummary] = useState("");
  const [cNotes, setCNotes] = useState("");
  const [cTags, setCTags] = useState("");
  const [cLinks, setCLinks] = useState("");
  const [cImageUrl, setCImageUrl] = useState("");
  const [cVideoUrl, setCVideoUrl] = useState("");
  const [cAudioUrl, setCAudioUrl] = useState("");
  const [cPdfUrl, setCPdfUrl] = useState("");

  const refreshData = useCallback(() => {
    if (!id) return;
    const nb = getNotebookById(id);
    if (!nb) {
      router.push('/notebooks');
      return;
    }
    setNotebook(nb);
    setContents(getContentsByNotebook(id));
  }, [id, getNotebookById, getContentsByNotebook, router]);

  useEffect(() => {
    refreshData();
  }, [id, refreshData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "Para este protótipo, use arquivos menores que 10MB."
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'image') setCImageUrl(base64String);
      if (type === 'video') setCVideoUrl(base64String);
      if (type === 'audio') setCAudioUrl(base64String);
      if (type === 'pdf') setCPdfUrl(base64String);
      setIsUploading(false);
      toast({
        title: "Upload concluído",
        description: "O arquivo foi processado com sucesso."
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível ler o arquivo."
      });
    };
    reader.readAsDataURL(file);
  };

  const resetContentForm = () => {
    setEditingContentId(null);
    setCTitle("");
    setCSummary("");
    setCNotes("");
    setCTags("");
    setCLinks("");
    setCImageUrl("");
    setCVideoUrl("");
    setCAudioUrl("");
    setCPdfUrl("");
  };

  const handleSaveContent = () => {
    if (!cTitle.trim()) return;
    
    saveContent({
      id: editingContentId || crypto.randomUUID(),
      notebookId: id,
      title: cTitle,
      summary: cSummary,
      notes: cNotes,
      tags: cTags.split(',').map(t => t.trim()).filter(Boolean),
      links: cLinks.split(',').map(l => l.trim()).filter(Boolean),
      media: {
        images: cImageUrl ? [cImageUrl] : [],
        videos: cVideoUrl ? [cVideoUrl] : [],
        audios: cAudioUrl ? [cAudioUrl] : [],
        pdfs: cPdfUrl ? [cPdfUrl] : []
      }
    });

    resetContentForm();
    setIsAddContentOpen(false);
    refreshData();
    toast({ 
      title: editingContentId ? "Conteúdo Atualizado" : "Material Adicionado", 
      description: "As alterações foram salvas com sucesso." 
    });
  };

  const handleEdit = (c: Content) => {
    setEditingContentId(c.id);
    setCTitle(c.title);
    setCSummary(c.summary);
    setCNotes(c.notes);
    setCTags(c.tags.join(', '));
    setCLinks(c.links?.join(', ') || "");
    setCImageUrl(c.media?.images?.[0] || "");
    setCVideoUrl(c.media?.videos?.[0] || "");
    setCAudioUrl(c.media?.audios?.[0] || "");
    setCPdfUrl(c.media?.pdfs?.[0] || "");
    setIsAddContentOpen(true);
  };

  const handleDeleteItem = (contentId: string) => {
    deleteContent(contentId);
    refreshData();
    toast({ title: "Excluído", description: "O material foi removido permanentemente." });
  };

  if (!notebook) return null;

  const IconComp = iconsMap[notebook.icon] || LibraryIcon;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto pb-24">
      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider w-fit">
            <Home className="w-4 h-4" />
            Início
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <Link 
            href="/notebooks" 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-medium w-fit"
          >
            Biblioteca
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 md:p-4 rounded-2xl text-white shadow-2xl"
              style={{ backgroundColor: notebook.color }}
            >
              <IconComp className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold font-headline">{notebook.name}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{contents.length} materiais de estudo disponíveis</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <Button 
              variant="outline" 
              className="border-border/50 h-10 md:h-12 px-4 md:px-6 rounded-xl w-full md:w-auto"
              onClick={() => {
                resetContentForm();
                setIsAddContentOpen(true);
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              ADICIONAR MATERIAL
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {contents.length > 0 ? (
          contents.map((item) => (
            <Card key={item.id} className="border-none bg-card/50 backdrop-blur-sm hover:bg-card transition-all group">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => {
                    setSelectedContent(item);
                    setIsViewOpen(true);
                  }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-base md:text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase h-5">
                      {item.sm2?.repetition === 0 ? 'Novo' : `Ciclo ${item.sm2?.repetition}`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.summary || "Sem resumo disponível"}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Próxima: {item.nextReviewDate ? new Date(item.nextReviewDate).toLocaleDateString('pt-BR') : 'Hoje'}
                    </span>
                    {item.media?.images?.length > 0 && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Imagem</span>}
                    {item.media?.videos?.length > 0 && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Vídeo</span>}
                    {item.media?.audios?.length > 0 && <span className="flex items-center gap-1"><Music className="w-3 h-3" /> Áudio</span>}
                    {item.media?.pdfs?.length > 0 && <span className="flex items-center gap-1"><FileIcon className="w-3 h-3" /> PDF</span>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive/70" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => {
                    setSelectedContent(item);
                    setIsViewOpen(true);
                  }}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-2xl">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-2">Caderno Vazio</h3>
            <p className="text-muted-foreground mb-6">Comece a adicionar materiais para este tópico.</p>
            <Button onClick={() => setIsAddContentOpen(true)}>ADICIONAR PRIMEIRO MATERIAL</Button>
          </div>
        )}
      </div>

      <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl md:text-2xl">
              {editingContentId ? "Editar Material" : "Novo Material de Estudo"}
            </DialogTitle>
            <DialogDescription>
              Adicione os detalhes do seu material de estudo para começar a repetição espaçada.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/50 mb-4">
              <TabsTrigger value="basic">Conteúdo</TabsTrigger>
              <TabsTrigger value="media">Mídia/Extra</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label>Título do Conteúdo</Label>
                <Input 
                  placeholder="Ex: Teoria Geral do Estado, Passive Voice..." 
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Resumo/Pergunta (Frente)</Label>
                <Input 
                  placeholder="Resumo do conceito." 
                  value={cSummary}
                  onChange={(e) => setCSummary(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Notas/Explicação (Verso)</Label>
                <Textarea 
                  placeholder="Detalhes completos..." 
                  className="min-h-[120px] md:min-h-[150px]"
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="grid gap-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input 
                  placeholder="direito, civil, prova1" 
                  value={cTags}
                  onChange={(e) => setCTags(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Links Úteis (URLs separadas por vírgula)</Label>
                <Input 
                  placeholder="https://exemplo.com, https://outrolink.com" 
                  value={cLinks}
                  onChange={(e) => setCLinks(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs md:text-sm">
                  <ImageIcon className="w-4 h-4 text-sky-400" /> Imagem
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="URL da imagem" 
                    value={cImageUrl}
                    onChange={(e) => setCImageUrl(e.target.value)}
                    className="flex-1 h-9 text-xs"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={imageInputRef} 
                    onChange={(e) => handleFileUpload(e, 'image')}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs md:text-sm">
                  <Video className="w-4 h-4 text-indigo-400" /> Vídeo
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Link do YouTube" 
                    value={cVideoUrl}
                    onChange={(e) => setCVideoUrl(e.target.value)}
                    className="flex-1 h-9 text-xs"
                  />
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    ref={videoInputRef} 
                    onChange={(e) => handleFileUpload(e, 'video')}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs md:text-sm">
                  <Music className="w-4 h-4 text-emerald-400" /> Áudio
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="URL do arquivo de áudio" 
                    value={cAudioUrl}
                    onChange={(e) => setCAudioUrl(e.target.value)}
                    className="flex-1 h-9 text-xs"
                  />
                  <input 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    ref={audioInputRef} 
                    onChange={(e) => handleFileUpload(e, 'audio')}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs md:text-sm">
                  <FileIcon className="w-4 h-4 text-amber-400" /> PDF
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="URL do PDF" 
                    value={cPdfUrl}
                    onChange={(e) => setCPdfUrl(e.target.value)}
                    className="flex-1 h-9 text-xs"
                  />
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    ref={pdfInputRef} 
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setIsAddContentOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">Cancelar</Button>
            <Button onClick={handleSaveContent} disabled={isUploading} className="w-full sm:w-auto order-1 sm:order-2">
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editingContentId ? "Salvar Alterações" : "Salvar Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto p-0">
          {selectedContent && (
            <div className="flex flex-col h-full">
              <div className="p-6 md:p-10 border-b border-border/50 bg-background/20">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] px-3 py-1">
                    {notebook.name}
                  </Badge>
                  {selectedContent.tags?.map(t => (
                    <Badge key={t} variant="outline" className="text-[10px] bg-background/40">#{t}</Badge>
                  ))}
                </div>
                <DialogTitle className="font-headline text-3xl md:text-5xl mb-4 leading-tight">{selectedContent.title}</DialogTitle>
                <DialogDescription className="text-lg md:text-xl text-foreground/80 italic font-medium">
                  {selectedContent.summary}
                </DialogDescription>
              </div>

              <div className="p-6 md:p-10 space-y-8 md:space-y-12">
                {(selectedContent.media?.images?.length > 0 || selectedContent.media?.videos?.length > 0 || selectedContent.media?.audios?.length > 0 || selectedContent.media?.pdfs?.length > 0) && (
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      Recursos Multimídia
                    </h4>
                    <div className="grid gap-6">
                      {selectedContent.media?.images?.map((img, i) => (
                        <div key={i} className="rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                          <img src={img} alt={selectedContent.title} className="w-full h-auto object-cover max-h-[400px]" />
                        </div>
                      ))}
                      
                      {selectedContent.media?.videos?.map((vid, i) => (
                        <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-border/50 bg-black shadow-2xl">
                          {(vid.includes('youtube.com') || vid.includes('youtu.be')) && !vid.startsWith('data:') ? (
                            <iframe 
                              className="w-full h-full" 
                              src={vid.replace('watch?v=', 'embed/').split('&')[0]} 
                              allowFullScreen
                            />
                          ) : (
                            <video src={vid} controls className="w-full h-full" />
                          )}
                        </div>
                      ))}

                      {selectedContent.media?.audios?.map((aud, i) => (
                        <div key={i} className="p-5 bg-background/40 rounded-2xl border border-border/50 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-emerald-500/10 rounded-full">
                            <Music className="w-5 h-5 text-emerald-400" />
                          </div>
                          <audio src={aud} controls className="flex-1 h-9" />
                        </div>
                      ))}

                      {selectedContent.media?.pdfs?.map((pdf, i) => (
                        <div key={i} className="p-5 bg-background/40 rounded-2xl border border-border/50 flex items-center gap-4 shadow-sm">
                          <div className="p-3 bg-amber-500/10 rounded-full">
                            <FileIcon className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Documento PDF #{i+1}</p>
                            <a 
                              href={pdf} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                            >
                              Abrir em nova aba
                            </a>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="rounded-xl h-9 px-4">
                             <a href={pdf} target="_blank" rel="noopener noreferrer">VER PDF</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Conteúdo Completo / Explicação
                  </h4>
                  <div className="bg-background/40 p-6 md:p-10 rounded-[2.5rem] border border-border/50 leading-relaxed whitespace-pre-wrap text-sm md:text-lg font-medium shadow-inner text-foreground/90">
                    {selectedContent.notes || "Sem notas detalhadas para este material."}
                  </div>
                </section>

                {selectedContent.links && selectedContent.links.length > 0 && (
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Referências e Links
                    </h4>
                    <div className="grid gap-2">
                      {selectedContent.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.startsWith('http') ? link : `https://${link}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between p-4 bg-background/30 hover:bg-background/50 rounded-xl border border-border/30 transition-all group"
                        >
                          <span className="text-sm font-medium truncate flex-1 mr-4">{link}</span>
                          <ExternalLink className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </section>
                )}
                
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
                  <div className="bg-background/40 p-5 rounded-2xl border border-border/30 flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Última Revisão
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {selectedContent.lastStudyDate ? new Date(selectedContent.lastStudyDate).toLocaleDateString('pt-BR') : 'Nunca'}
                    </p>
                  </div>
                  <div className="bg-background/40 p-5 rounded-2xl border border-border/30 flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Próxima Revisão
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {selectedContent.nextReviewDate ? new Date(selectedContent.nextReviewDate).toLocaleDateString('pt-BR') : 'Hoje'}
                    </p>
                  </div>
                  <div className="bg-background/40 p-5 rounded-2xl border border-border/30 flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> Retenção
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {selectedContent.sm2 ? Math.round(selectedContent.sm2.efactor * 20) : 0}% (EF: {selectedContent.sm2?.efactor.toFixed(2)})
                    </p>
                  </div>
                  <div className="bg-background/40 p-5 rounded-2xl border border-border/30 flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <History className="w-3 h-3" /> Ciclos
                    </span>
                    <p className="text-sm font-bold text-foreground">
                      {selectedContent.sm2?.repetition || 0} reps
                    </p>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 p-6 md:p-8 bg-card/90 backdrop-blur-md border-t border-border/50 flex flex-col sm:flex-row gap-3 z-20">
                <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl text-xs font-bold uppercase tracking-wider" onClick={() => {
                  setIsViewOpen(false);
                  handleEdit(selectedContent);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Conteúdo
                </Button>
                <Button className="w-full sm:w-auto flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90" onClick={() => setIsViewOpen(false)}>
                  Fechar Visualização
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
