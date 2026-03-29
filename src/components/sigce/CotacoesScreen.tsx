import { useState } from "react";
import { Trophy, TrendingDown, Send, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Cotacao {
  fornecedor: string;
  precoUnitario: string;
  valorTotal: string;
  frete: string;
  prazo: string;
  formaPagamento: string;
  obs: string;
  melhor: boolean;
  maisRapido?: boolean;
}

interface SolicitacaoCotacao {
  id: number;
  item: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  qtd: number;
  urgencia: string;
  cotacoes: Cotacao[];
  enviado: boolean;
}

const initialSolicitacoes: SolicitacaoCotacao[] = [
  {
    id: 2, item: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)",
    solicitante: "Pr. Rafael Diniz", area: "Central de Atendimento", centroCusto: "CENTRAL", qtd: 1, urgencia: "Alta",
    enviado: false,
    cotacoes: [
      { fornecedor: "Casa do Café", precoUnitario: "R$ 389,61", valorTotal: "R$ 389,61", frete: "Grátis", prazo: "2 dias úteis", formaPagamento: "Pix à vista", obs: "Fornecedor preferencial. Entrega própria.", melhor: true, maisRapido: true },
      { fornecedor: "Mercado Boa Compra", precoUnitario: "R$ 415,00", valorTotal: "R$ 415,00", frete: "R$ 25,00", prazo: "3 dias úteis", formaPagamento: "Boleto 7 dias", obs: "Inclui jarras térmicas superiores.", melhor: false },
      { fornecedor: "Distribuidora Central", precoUnitario: "R$ 432,50", valorTotal: "R$ 432,50", frete: "R$ 35,00", prazo: "5 dias úteis", formaPagamento: "Boleto 14 dias", obs: "Entrega apenas às terças e quintas.", melhor: false },
    ],
  },
  {
    id: 5, item: "Banner Lona 3x2m — Campanha Páscoa",
    solicitante: "Dani Criativo", area: "Criativo", centroCusto: "CRIATIVO", qtd: 2, urgencia: "Normal",
    enviado: false,
    cotacoes: [
      { fornecedor: "Print Express", precoUnitario: "R$ 170,00", valorTotal: "R$ 340,00", frete: "R$ 30,00", prazo: "7 dias úteis", formaPagamento: "Pix à vista", obs: "Arte precisa ser enviada em alta resolução.", melhor: true },
      { fornecedor: "Gráfica Rápida SP", precoUnitario: "R$ 195,00", valorTotal: "R$ 390,00", frete: "Grátis", prazo: "5 dias úteis", formaPagamento: "Boleto 7 dias", obs: "Frete incluso para Grande SP.", melhor: false, maisRapido: true },
    ],
  },
];

function parseValue(v: string): number {
  return parseFloat(v.replace(/[R$\s.]/g, '').replace(',', '.'));
}

interface ComparadorProps {
  sol: SolicitacaoCotacao;
  onEnviar: (id: number) => void;
}

function Comparador({ sol, onEnviar }: ComparadorProps) {
  const melhorValor = sol.cotacoes.find(c => c.melhor);
  const pioresValores = sol.cotacoes.filter(c => !c.melhor);
  const savingPotencial = pioresValores.length > 0
    ? `R$ ${(parseValue(pioresValores[pioresValores.length - 1].valorTotal) - parseValue(melhorValor!.valorTotal)).toFixed(2).replace('.', ',')}`
    : "—";

  return (
    <Card className={`border-0 shadow-sm ${sol.enviado ? 'ring-2 ring-success/30' : ''}`}>
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{sol.item}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sol.solicitante} • {sol.area} • {sol.centroCusto} • Qtd: {sol.qtd}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-warning/15 text-warning border-0 text-[10px]">{sol.urgencia}</Badge>
            {sol.enviado && <Badge className="bg-success text-success-foreground border-0 text-[10px]">Enviado</Badge>}
          </div>
        </div>

        {/* Saving */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5">
          <TrendingDown className="h-5 w-5 text-success" />
          <div>
            <p className="text-[10px] text-muted-foreground">Saving potencial vs. pior cotação</p>
            <p className="text-lg font-bold text-success">{savingPotencial}</p>
          </div>
        </div>

        {/* Table — all quotes shown, no selection */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor Total</TableHead>
                <TableHead className="text-[11px] font-semibold">Frete</TableHead>
                <TableHead className="text-[11px] font-semibold">Prazo</TableHead>
                <TableHead className="text-[11px] font-semibold">Pagamento</TableHead>
                <TableHead className="text-[11px] font-semibold">Obs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sol.cotacoes.map((c, i) => (
                <TableRow key={i} className={`hover:bg-muted/20 ${c.melhor ? 'bg-success/5' : ''}`}>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium">{c.fornecedor}</span>
                      {c.melhor && <Badge className="bg-success text-success-foreground text-[8px] px-1.5 h-4 border-0">Melhor Preço</Badge>}
                      {c.maisRapido && <Badge className="bg-primary/15 text-primary text-[8px] px-1.5 h-4 border-0">Mais Rápido</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-bold ${c.melhor ? 'text-success' : ''}`}>{c.valorTotal}</span>
                  </TableCell>
                  <TableCell className="text-xs">{c.frete}</TableCell>
                  <TableCell className="text-xs">{c.prazo}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.formaPagamento}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground max-w-[150px] truncate">{c.obs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          {sol.enviado ? (
            <div className="flex items-center gap-2 text-xs text-success font-medium">
              <Star className="h-4 w-4" /> Todas as cotações enviadas para aprovação executiva
            </div>
          ) : (
            <Button size="sm" className="h-9 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={() => onEnviar(sol.id)}>
              <Send className="h-3.5 w-3.5 mr-1.5" /> Enviar Todas as Cotações para Aprovação
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CotacoesScreen() {
  const [solicitacoes, setSolicitacoes] = useState(initialSolicitacoes);

  const handleEnviar = (id: number) => {
    setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, enviado: true } : s));
    const sol = solicitacoes.find(s => s.id === id);
    toast({ title: "✅ Cotações enviadas para aprovação", description: `${sol?.cotacoes.length} cotações de "${sol?.item}" enviadas para aprovação executiva.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-muted-foreground">Compare todas as propostas recebidas e envie o pacote completo para aprovação executiva.</p>
      {solicitacoes.map(sol => (
        <Comparador key={sol.id} sol={sol} onEnviar={handleEnviar} />
      ))}
    </div>
  );
}
