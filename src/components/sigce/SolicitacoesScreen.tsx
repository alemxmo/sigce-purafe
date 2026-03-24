import { Search, Eye, Clock, AlertCircle, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SolicitacaoCard {
  id: number;
  solicitante: string;
  area: string;
  pedido: string;
  urgencia?: string;
  valor?: string;
  status: string;
}

const columns: { title: string; status: string; color: string }[] = [
  { title: "Aguardando Cotação", status: "aguardando_cotacao", color: "bg-warning" },
  { title: "Em Negociação", status: "em_negociacao", color: "bg-primary" },
  { title: "Aguardando Aprovação", status: "aguardando_aprovacao", color: "bg-success" },
];

const solicitacoes: SolicitacaoCard[] = [
  {
    id: 1,
    solicitante: "Caslu",
    area: "Iluminação",
    pedido: "Líquido p/ Máquina de Haze (Galão 05L)",
    urgencia: "Para o próximo domingo",
    status: "aguardando_cotacao",
  },
  {
    id: 2,
    solicitante: "Pr. Rafael Diniz",
    area: "Central de Atendimento",
    pedido: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)",
    valor: "R$ 389,61",
    status: "em_negociacao",
  },
];

export default function SolicitacoesScreen() {
  const getCardsByStatus = (status: string) => solicitacoes.filter(s => s.status === status);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Busca */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar solicitações..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-muted px-3 py-1.5">Todos</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted px-3 py-1.5">Urgente</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted px-3 py-1.5">Iluminação</Badge>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map(col => {
          const cards = getCardsByStatus(col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <Badge variant="secondary" className="ml-auto text-xs h-5 px-2">{cards.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-muted/40">
                {cards.map(card => (
                  <Card key={card.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm leading-tight">{card.pedido}</p>
                          <p className="text-xs text-muted-foreground mt-1">{card.solicitante} • {card.area}</p>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">#{String(card.id).padStart(3, '0')}</span>
                      </div>
                      {card.urgencia && (
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                          <span className="text-xs font-medium text-destructive">{card.urgencia}</span>
                        </div>
                      )}
                      {card.valor && (
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold">Valor atual: {card.valor}</span>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="w-full h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3.5 w-3.5 mr-1" /> Ver detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {cards.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Clock className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-xs">Nenhuma solicitação</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
