import { useState } from "react";
import { Truck, Package, CheckCircle2, AlertTriangle, Clock, MapPin, ExternalLink, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Entrega {
  id: number;
  pedido: string;
  fornecedor: string;
  previsao: string;
  metodo: string;
  rastreio?: string;
  transportadora?: string;
  endereco: string;
  solicitante: string;
  responsavel: string;
  status: "em_transito" | "despachado" | "entregue" | "atrasado" | "retirada";
  divergencia?: string;
}

const entregas: Entrega[] = [
  { id: 1, pedido: "Camisetas de Batismo (70 un)", fornecedor: "Print Express", previsao: "Hoje", metodo: "Transportadora", rastreio: "BR1234567890", transportadora: "Jadlog", endereco: "SEDE — Rua Principal, 500", solicitante: "Eventos", responsavel: "Logística", status: "em_transito" },
  { id: 2, pedido: "Líquido Haze 5L (4x)", fornecedor: "TACC Iluminação", previsao: "Amanhã", metodo: "Transportadora", rastreio: "BR0987654321", transportadora: "Total Express", endereco: "SEDE — Rua Principal, 500", solicitante: "Louvor", responsavel: "Logística", status: "despachado" },
  { id: 3, pedido: "Kit Café Completo", fornecedor: "Casa do Café", previsao: "05/03", metodo: "Entrega Própria", endereco: "SEDE — Rua Principal, 500", solicitante: "Central", responsavel: "Logística", status: "entregue" },
  { id: 4, pedido: "Material de Limpeza", fornecedor: "Dousystem", previsao: "08/03", metodo: "Retirada", endereco: "Dousystem — Av. Industrial, 1200", solicitante: "SEDE", responsavel: "Logística", status: "retirada" },
  { id: 5, pedido: "Pilhas AA cx/48 (2x)", fornecedor: "SomPro Audio", previsao: "07/03", metodo: "Correios", rastreio: "SS123456789BR", transportadora: "Correios", endereco: "SEDE — Rua Principal, 500", solicitante: "Louvor", responsavel: "Logística", status: "atrasado", divergencia: "Prazo expirado — sem atualização desde 06/03" },
  { id: 6, pedido: "Copos Biodegradáveis (1000un)", fornecedor: "Dousystem", previsao: "10/03", metodo: "Motoboy", endereco: "SEDE — Rua Principal, 500", solicitante: "Central", responsavel: "Logística", status: "despachado" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  em_transito: { label: "Em Trânsito", color: "bg-primary/15 text-primary", icon: Truck },
  despachado: { label: "Despachado", color: "bg-warning/15 text-warning", icon: Package },
  entregue: { label: "Entregue", color: "bg-success/15 text-success", icon: CheckCircle2 },
  atrasado: { label: "Atrasado", color: "bg-destructive/15 text-destructive", icon: AlertTriangle },
  retirada: { label: "Retirada", color: "bg-muted text-muted-foreground", icon: MapPin },
};

export default function LogisticaScreen() {
  const handleCheckin = (pedido: string) => {
    toast({ title: "📦 Check-in Realizado", description: `${pedido} — Recebimento confirmado e estoque atualizado.` });
  };

  const handleNotifyWhatsApp = (pedido: string, solicitante: string) => {
    const msg = encodeURIComponent(`*SIG3B — Notificação de Entrega*\n\n📦 O pedido "${pedido}" foi recebido com sucesso!\n\nÁrea solicitante: ${solicitante}\nStatus: ✅ Entregue e conferido`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    toast({ title: "📱 WhatsApp Aberto", description: `Notificação para ${solicitante}` });
  };

  const emTransito = entregas.filter(e => ["em_transito", "despachado"].includes(e.status)).length;
  const entreguesHoje = entregas.filter(e => e.status === "entregue").length;
  const atrasados = entregas.filter(e => e.status === "atrasado").length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-primary">{emTransito}</p>
          <p className="text-[10px] text-muted-foreground">Em Trânsito / Despachado</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-success">{entreguesHoje}</p>
          <p className="text-[10px] text-muted-foreground">Entregues</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-destructive">{atrasados}</p>
          <p className="text-[10px] text-muted-foreground">Atrasados</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">{entregas.filter(e => e.status === "retirada").length}</p>
          <p className="text-[10px] text-muted-foreground">Para Retirada</p>
        </CardContent></Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Pedido</TableHead>
                <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                <TableHead className="text-[11px] font-semibold">Previsão</TableHead>
                <TableHead className="text-[11px] font-semibold">Método</TableHead>
                <TableHead className="text-[11px] font-semibold">Endereço</TableHead>
                <TableHead className="text-[11px] font-semibold">Rastreio</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
                <TableHead className="text-[11px] font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entregas.map(e => {
                const st = statusConfig[e.status];
                return (
                  <TableRow key={e.id} className={`hover:bg-muted/20 ${e.status === 'atrasado' ? 'bg-destructive/5' : ''}`}>
                    <TableCell>
                      <p className="text-xs font-medium">{e.pedido}</p>
                      <p className="text-[10px] text-muted-foreground">{e.solicitante}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.fornecedor}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${e.status === 'atrasado' ? 'text-destructive' : ''}`}>{e.previsao}</span>
                    </TableCell>
                    <TableCell className="text-xs">{e.metodo}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground max-w-[140px] truncate">{e.endereco}</TableCell>
                    <TableCell>
                      {e.rastreio ? (
                        <span className="text-[10px] font-mono text-primary cursor-pointer flex items-center gap-0.5">
                          {e.rastreio.slice(0, 8)}… <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      ) : <span className="text-[10px] text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell><Badge className={`text-[10px] border-0 ${st.color}`}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {["em_transito", "despachado", "retirada"].includes(e.status) && (
                          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => handleCheckin(e.pedido)}>
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Check-in
                          </Button>
                        )}
                        {["em_transito", "despachado", "retirada"].includes(e.status) && (
                          <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => handleNotifyWhatsApp(e.pedido, e.solicitante)}>
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        )}
                        {e.status === "entregue" && <Badge className="text-[9px] bg-success/15 text-success border-0">✓ Recebido</Badge>}
                        {e.status === "atrasado" && (
                          <span className="text-[10px] text-destructive">{e.divergencia}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
