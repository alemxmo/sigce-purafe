import { Package, CheckCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ItemEstoque {
  item: string;
  qtd: number;
  max: number;
  status: "Adequado" | "Alerta" | "Comprar";
}

const itens: ItemEstoque[] = [
  { item: "Camisetas de Batismo", qtd: 70, max: 100, status: "Adequado" },
  { item: "Pilhas p/ Microfone (AA)", qtd: 15, max: 100, status: "Comprar" },
  { item: "Copos Papel Biodegradável 60ml", qtd: 50, max: 200, status: "Alerta" },
  { item: "Livros Pastorais", qtd: 120, max: 150, status: "Adequado" },
];

const statusConfig = {
  Adequado: { color: "bg-success/15 text-success", barColor: "bg-success", icon: CheckCircle },
  Alerta: { color: "bg-warning/15 text-warning", barColor: "bg-warning", icon: AlertTriangle },
  Comprar: { color: "bg-destructive/15 text-destructive", barColor: "bg-destructive", icon: ShoppingCart },
};

export default function EstoqueScreen() {
  const adequados = itens.filter(i => i.status === "Adequado").length;
  const alertas = itens.filter(i => i.status === "Alerta").length;
  const comprar = itens.filter(i => i.status === "Comprar").length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 text-center">
            <Package className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{itens.length}</p>
            <p className="text-xs text-muted-foreground">SKUs Monitorados</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold text-success">{adequados}</p>
            <p className="text-xs text-muted-foreground">Adequados</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold text-warning">{alertas}</p>
            <p className="text-xs text-muted-foreground">Em Alerta</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 text-center">
            <ShoppingCart className="h-5 w-5 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold text-destructive">{comprar}</p>
            <p className="text-xs text-muted-foreground">Para Compra</p>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {itens.map((item, i) => {
          const cfg = statusConfig[item.status];
          const pct = Math.round((item.qtd / item.max) * 100);
          return (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${cfg.color.split(' ')[0]}`}>
                      <cfg.icon className={`h-4 w-4 ${cfg.color.split(' ')[1]}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.qtd} unidades em estoque</p>
                    </div>
                  </div>
                  <Badge className={`border-0 text-xs ${cfg.color}`}>{item.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${cfg.barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium w-10 text-right">{pct}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
