
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
  info?: React.ReactNode;
}

export function StatCard({ title, value, icon: Icon, description, trend, className, iconColor, info }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none bg-card/40 backdrop-blur-md shadow-sm transition-all hover:bg-card/60 relative group", className)}>
      <CardContent className="p-4 md:p-6">
        {info && (
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            {info}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="order-2 md:order-1">
            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl md:text-4xl font-bold font-headline tracking-tight">{value}</h3>
            {description && (
              <p className="text-[9px] md:text-[11px] text-muted-foreground mt-1 font-medium italic opacity-80">{description}</p>
            )}
            {trend && (
              <p className={cn(
                "text-xs mt-2 font-bold flex items-center gap-1",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 md:p-4 rounded-xl md:rounded-2xl w-fit order-1 md:order-2 shadow-inner transition-transform group-hover:scale-110", 
            iconColor || "bg-primary/10"
          )}>
            <Icon className={cn("w-5 h-5 md:w-6 md:h-6", iconColor ? "text-foreground" : "text-primary")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
