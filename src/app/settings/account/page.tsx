
"use client"

import { 
  User, 
  Mail, 
  Shield, 
  Cloud, 
  Download, 
  Trash2, 
  LogOut,
  FileSpreadsheet,
  FileText,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <header className="space-y-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider w-fit">
          <Home className="w-4 h-4" />
          Início
        </Link>
        <h1 className="text-4xl font-bold font-headline mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">Gerencie seu perfil, dados e segurança.</p>
      </header>

      <section className="space-y-6">
        <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 ring-4 ring-primary/10">
                <AvatarImage src="https://picsum.photos/seed/user123/200/200" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold font-headline">Estudioso Pulse</h2>
                <p className="text-muted-foreground">estudioso.pulse@exemplo.com</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-8 text-xs border-border/50">Editar Perfil</Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs border-border/50 text-destructive hover:bg-destructive/10">Sair</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                Sincronização
              </CardTitle>
              <CardDescription>Mantenha seus estudos salvos na nuvem.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Backup Automático</p>
                  <p className="text-xs text-muted-foreground">Último backup: Hoje, 10:45</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-border/50" />
              <Button className="w-full h-10 rounded-xl bg-background/50 border-border/50 hover:bg-primary hover:text-white" variant="outline">
                Sincronizar Agora
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Segurança
              </CardTitle>
              <CardDescription>Configurações de acesso e privacidade.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full h-10 rounded-xl justify-between px-4 border-border/50">
                <span className="text-sm">Alterar Senha</span>
                <Shield className="w-4 h-4 opacity-50" />
              </Button>
              <Button variant="outline" className="w-full h-10 rounded-xl justify-between px-4 border-border/50">
                <span className="text-sm">Autenticação em Dois Fatores</span>
                <Switch />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-500" />
              Exportação de Dados
            </CardTitle>
            <CardDescription>Baixe seus dados em formatos legíveis.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 justify-start gap-4 rounded-xl border-border/50 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 group">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">CSV / Excel</p>
                <p className="text-[10px] text-muted-foreground">Planilha completa</p>
              </div>
            </Button>
            <Button variant="outline" className="h-14 justify-start gap-4 rounded-xl border-border/50 hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-400 group">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <FileText className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm">PDF (Relatório)</p>
                <p className="text-[10px] text-muted-foreground">Resumo das atividades</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none bg-rose-500/5 border border-rose-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-rose-500">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-sm font-bold">Zerar Progresso</p>
                <p className="text-xs text-muted-foreground">Reinicia o algoritmo para todos os cards.</p>
              </div>
              <Button variant="ghost" className="text-rose-500 hover:bg-rose-500/10">Zerar</Button>
            </div>
            <Separator className="bg-rose-500/10" />
            <div className="flex items-center justify-between gap-8">
              <div>
                <p className="text-sm font-bold">Excluir Conta</p>
                <p className="text-xs text-muted-foreground">Remove permanentemente todos os dados.</p>
              </div>
              <Button variant="ghost" className="text-rose-500 hover:bg-rose-500/10">Excluir</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
