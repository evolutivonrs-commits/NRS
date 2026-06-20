
"use client"

import { 
  Target, 
  Bell, 
  Moon, 
  Languages, 
  Zap,
  Save,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function PreferencesPage() {
  const [dailyGoal, setDailyGoal] = useState([20]);

  const handleSave = () => {
    toast({
      title: "Preferências Salvas",
      description: "Suas configurações de estudo foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <header className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider w-fit">
          <Home className="w-4 h-4" />
          Início
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Preferências</h1>
            <p className="text-muted-foreground">Personalize sua experiência de estudo e metas.</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            SALVAR
          </Button>
        </div>
      </header>

      <section className="space-y-6">
        <Card className="border-none bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Metas de Estudo
            </CardTitle>
            <CardDescription>Defina quanto você quer se desafiar diariamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Revisões Diárias (Meta)</Label>
                <span className="font-bold text-primary">{dailyGoal[0]} cards</span>
              </div>
              <Slider 
                value={dailyGoal} 
                onValueChange={setDailyGoal} 
                max={100} 
                step={5}
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                Sugerimos pelo menos 20 revisões diárias para manter uma boa taxa de retenção.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                Notificações
              </CardTitle>
              <CardDescription>Gerencie seus alertas e lembretes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders" className="cursor-pointer">Lembretes Diários</Label>
                <Switch id="reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="streaks" className="cursor-pointer">Alertas de Sequência (Streak)</Label>
                <Switch id="streaks" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-features" className="cursor-pointer">Novidades da IA</Label>
                <Switch id="new-features" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                Interface e Tema
              </CardTitle>
              <CardDescription>Aparência do seu ambiente de estudo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tema Escuro (Obrigatório)</Label>
                <Switch defaultChecked disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label>Animações Fluídas</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Idioma</Label>
                <span className="text-sm font-medium">Português (BR)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Configurações de IA
            </CardTitle>
            <CardDescription>Controle como a inteligência artificial ajuda você.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Sugestões Automáticas de Tags</p>
                <p className="text-xs text-muted-foreground">A IA sugere tags baseadas no seu conteúdo.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Resumos Inteligentes</p>
                <p className="text-xs text-muted-foreground">Gera resumos para a frente dos seus flashcards.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
