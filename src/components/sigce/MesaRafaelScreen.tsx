import { useState } from "react";
import {
  Search, Filter, Eye, Send, FileText, RotateCcw, MessageSquare,
  AlertCircle, Clock, ChevronRight, Plus, Paperclip, CheckCircle2, User
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

interface Pedido {
  id: number;
  item: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  prazo: string;
  urgencia: "normal" | "alta" | "critica";
  qtd: number;
  status: "nova" | "em_cotacao" | "aguardando_complemento" | "aguardando_aprovacao";
  cotacoes: number;
  melhorPreco?: string;
  comentarios: { texto: string; por: string; data: string }[];
  checklist: { item: string; done: boolean }[];
}

const pedidos: Pedido[] = [
  {
    id: 1, item: "Líquido p/ Máquina de Haze (Galão 05L)", solicitante: "Caslu", area: "Iluminação",
    centroCusto: "LOUVOR", prazo: "Próx. domingo", urgencia: "critica", qtd: 2, status: "nova", cotacoes: 0,
    comentarios: [{ texto: "Urgente! Sem haze o culto fica sem efeito.", por: "Caslu", data: "10/03 09:15" }],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: false },
      { item: "Solicitar cotação", done: false },
      { item: "Comparar preços", done: false },
      { item: "Enviar para aprovação", done: false },
    ],
  },
  {
    id: 2, item: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)",
    solicitante: "Pr. Rafael Diniz", area: "Central de Atendimento", centroCusto: "CENTRAL",
    prazo: "15/03", urgencia: "alta", qtd: 1, status: "em_cotacao", cotacoes: 3, melhorPreco: "R$ 389,61",
    comentarios: [
      { texto: "Estoque de café acabou completamente.", por: "Pr. Rafael Diniz", data: "09/03 14:30" },
      { texto: "3 cotações recebidas. Casa do Café tem melhor preço.", por: "Rafael", data: "10/03 08:00" },
    ],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: true },
      { item: "Solicitar cotação", done: true },
      { item: "Comparar preços", done: true },
      { item: "Enviar para aprovação", done: false },
    ],
  },
  {
    id: 4, item: "Kit Lanche Infantil (Suco, Biscoito, Guardanapo)", solicitante: "Marcos (Kids)",
    area: "Kids", centroCusto: "KIDS", prazo: "Sábado", urgencia: "alta", qtd: 100,
    status: "nova", cotacoes: 0,
    comentarios: [{ texto: "Evento Kids especial com 100 crianças.", por: "Marcos", data: "10/03 11:45" }],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: false },
      { item: "Solicitar cotação", done: false },
      { item: "Comparar preços", done: false },
      { item: "Enviar para aprovação", done: false },
    ],
  },
  {
    id: 3, item: "Material de Limpeza (Desinfetante, Detergente, Pano, Luvas)", solicitante: "Michele",
    area: "Administrativo", centroCusto: "SEDE", prazo: "12/03", urgencia: "normal", qtd: 1,
    status: "aguardando_aprovacao", cotacoes: 3, melhorPreco: "R$ 780,00",
    comentarios: [
      { texto: "Reposição mensal.", por: "Michele", data: "07/03 10:00" },
      { texto: "Dousystem tem melhor preço e prazo.", por: "Rafael", data: "08/03 09:00" },
      { texto: "Enviado para aprovação da Bispa.", por: "Rafael", data: "08/03 09:30" },
    ],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: true },
      { item: "Solicitar cotação", done: true },
      { item: "Comparar preços", done: true },
      { item: "Enviar para aprovação", done: true },
    ],
  },
  {
    id: 5, item: "Banner Lona 3x2m — Campanha Páscoa", solicitante: "Dani Criativo",
    area: "Criativo", centroCusto: "CRIATIVO", prazo: "20/03", urgencia: "normal", qtd: 2,
    status: "em_cotacao", cotacoes: 2, melhorPreco: "R$ 340,00",
    comentarios: [
      { texto: "Preciso de 2 banners iguais, arte já pronta.", por: "Dani", data: "08/03 14:00" },
      { texto: "2 cotações recebidas, aguardando terceira.", por: "Rafael", data: "09/03 16:00" },
    ],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: true },
      { item: "Solicitar cotação", done: true },
      { item: "Comparar preços", done: false },
      { item: "Enviar para aprovação", done: false },
    ],
  },
  {
    id: 6, item: "Pilhas p/ Microfone AA (caixa c/48)", solicitante: "Sound Team",
    area: "Louvor", centroCusto: "LOUVOR", prazo: "14/03", urgencia: "alta", qtd: 2,
    status: "aguardando_complemento", cotacoes: 1,
    comentarios: [
      { texto: "Precisamos de pilhas AA, não AAA.", por: "Sound Team", data: "09/03 08:00" },
      { texto: "Devolvido: especificar marca preferida e se aceita recarregável.", por: "Rafael", data: "09/03 10:00" },
    ],
    checklist: [
      { item: "Verificar fornecedores cadastrados", done: true },
      { item: "Solicitar cotação", done: true },
      { item: "Comparar preços", done: false },
      { item: "Enviar para aprovação", done: false },
    ],
  },
];

const columns: { status: string; label: string; color: string }[] = [
  { status: "nova", label: "Novas Solicitações", color: "bg-primary" },
  { status: "em_cotacao", label: "Em Cotação", color: "bg-warning" },
  { status: "aguardando_complemento", label: "Aguard. Complemento", color: "bg-destructive" },
  { status: "aguardando_aprovacao", label: "Aguard. Aprovação", color: "bg-success" },
];

const urgenciaColor: Record<string, string> = {
  normal: "bg-muted text-muted-foreground",
  alta: "bg-warning/15 text-warning",
  critica: "bg-destructive/15 text-destructive",
};

export default function MesaRafaelScreen() {
  const [selected, setSelected] = useState<Pedido | null>(null);
  const [busca, setBusca] = useState("");

  const getByStatus = (status: string) =>
    pedidos.filter(p => p.status === status && (!busca || p.item.toLowerCase().includes(busca.toLowerCase()) || p.solicitante.toLowerCase().includes(busca.toLowerCase())));

  const handleAction = (action: string, pedido: Pedido) => {
    const msgs: Record<string, string> = {
      cotacao: `Cotação solicitada para "${pedido.item}"`,
      aprovar: `"${pedido.item}" enviado para aprovação executiva`,
      devolver: `"${pedido.item}" devolvido ao solicitante para ajuste`,
      consolidar: `Pedido "${pedido.item}" consolidado com sucesso`,
    };
    toast({ title: "✅ Ação Realizada", description: msgs[action] || "Ação executada." });
    setSelected(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Workspace operacional — gerencie todas as solicitações em um só lugar.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar pedido..." className="pl-9 h-8 text-xs" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map(col => {
          const items = getByStatus(col.status);
          return (
            <div key={col.status} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <div className={`h-2 w-2 rounded-full ${col.color}`} />
                <h3 className="text-xs font-semibold">{col.label}</h3>
                <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">{items.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[120px] p-2 rounded-xl bg-muted/30">
                {items.map(p => (
                  <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(p)}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold leading-tight line-clamp-2">{p.item}</p>
                        <span className="text-[9px] text-muted-foreground font-mono shrink-0">#{String(p.id).padStart(3, '0')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{p.solicitante}</span>
                        <span>•</span>
                        <span>{p.centroCusto}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className={`text-[9px] border-0 ${urgenciaColor[p.urgencia]}`}>{p.urgencia === "critica" ? "URGENTE" : p.urgencia === "alta" ? "Alta" : "Normal"}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> {p.prazo}
                        </span>
                      </div>
                      {p.cotacoes > 0 && (
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">{p.cotacoes} cotações</span>
                          {p.melhorPreco && <span className="font-semibold text-success">{p.melhorPreco}</span>}
                        </div>
                      )}
                      {/* Checklist progress */}
                      <div className="flex gap-0.5">
                        {p.checklist.map((c, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${c.done ? 'bg-success' : 'bg-muted'}`} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-6 w-6 mb-1 opacity-20" />
                    <p className="text-[10px]">Nenhum pedido</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm">Pedido #{String(selected.id).padStart(3, '0')}</SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="font-semibold text-sm">{selected.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selected.solicitante} • {selected.area} • {selected.centroCusto}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Qtd</p>
                    <p className="text-sm font-bold">{selected.qtd}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Prazo</p>
                    <p className="text-sm font-bold">{selected.prazo}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Cotações</p>
                    <p className="text-sm font-bold">{selected.cotacoes}</p>
                  </div>
                </div>

                {selected.melhorPreco && (
                  <div className="p-3 rounded-lg bg-success/5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Melhor preço encontrado</span>
                    <span className="text-sm font-bold text-success">{selected.melhorPreco}</span>
                  </div>
                )}

                {/* Checklist */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Checklist de Cotação</p>
                  <div className="space-y-1.5">
                    {selected.checklist.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`h-4 w-4 rounded border flex items-center justify-center ${c.done ? 'bg-success border-success' : 'border-border'}`}>
                          {c.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span className={c.done ? 'line-through text-muted-foreground' : ''}>{c.item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Comentários</p>
                  <div className="space-y-2">
                    {selected.comentarios.map((c, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs">{c.texto}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{c.por} • {c.data}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ações Rápidas</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="h-9 text-xs justify-start" onClick={() => handleAction("cotacao", selected)}>
                      <FileText className="h-3.5 w-3.5 mr-1.5" /> Solicitar Cotação
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 text-xs justify-start">
                      <Paperclip className="h-3.5 w-3.5 mr-1.5" /> Anexar Orçamento
                    </Button>
                    <Button size="sm" variant="outline" className="h-9 text-xs justify-start text-destructive" onClick={() => handleAction("devolver", selected)}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Devolver p/ Ajuste
                    </Button>
                    <Button size="sm" className="h-9 text-xs justify-start bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAction("aprovar", selected)}>
                      <Send className="h-3.5 w-3.5 mr-1.5" /> Enviar p/ Aprovação
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
