import { useState } from "react";
import { CheckCircle2, Trophy, TrendingDown, Send, Star } from "lucide-react";
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
}

const solicitacao = {
  id: 2,
  item: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)",
  solicitante: "Pr. Rafael Diniz",
  area: "Central de Atendimento",
  centroCusto: "CENTRAL",
  qtd: 1,
  urgencia: "Alta",
};

const cotacoes: Cotacao[] = [
  {
    fornecedor: "Casa do Café", precoUnitario: "R$ 389,61", valorTotal: "R$ 389,61",
    frete: "Grátis", prazo: "2 dias úteis", formaPagamento: "Pix à vista",
    obs: "Fornecedor preferencial. Entrega própria.", melhor: true,
  },
  {
    fornecedor: "Mercado Boa Compra", precoUnitario: "R$ 415,00", valorTotal: "R$ 415,00",
    frete: "R$ 25,00", prazo: "3 dias úteis", formaPagamento: "Boleto 7 dias",
    obs: "Inclui jarras térmicas superiores.", melhor: false,
  },
  {
    fornecedor: "Distribuidora Central", precoUnitario: "R$ 432,50", valorTotal: "R$ 432,50",
    frete: "R$ 35,00", prazo: "5 dias úteis", formaPagamento: "Boleto 14 dias",
    obs: "Entrega apenas às terças e quintas.", melhor: false,
  },
];

const cotacao2Solicitacao = {
  id: 5,
  item: "Banner Lona 3x2m — Campanha Páscoa",
  solicitante: "Dani Criativo",
  area: "Criativo",
  centroCusto: "CRIATIVO",
  qtd: 2,
  urgencia: "Normal",
};

const cotacoes2: Cotacao[] = [
  {
    fornecedor: "Print Express", precoUnitario: "R$ 170,00", valorTotal: "R$ 340,00",
    frete: "R$ 30,00", prazo: "7 dias úteis", formaPagamento: "Pix à vista",
    obs: "Arte precisa ser enviada em alta resolução.", melhor: true,
  },
  {
    fornecedor: "Gráfica Rápida SP", precoUnitario: "R$ 195,00", valorTotal: "R$ 390,00",
    frete: "Grátis", prazo: "5 dias úteis", formaPagamento: "Boleto 7 dias",
    obs: "Frete incluso para Grande SP.", melhor: false,
  },
];

interface ComparadorProps {
  sol: typeof solicitacao;
  cots: Cotacao[];
}

function Comparador({ sol, cots }: ComparadorProps) {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const melhorValor = cots.find(c => c.melhor);
  const pioresValores = cots.filter(c => !c.melhor);
  const savingPotencial = pioresValores.length > 0
    ? `R$ ${(parseFloat(pioresValores[pioresValores.length - 1].valorTotal.replace(/[R$\s.]/g, '').replace(',', '.')) - parseFloat(melhorValor!.valorTotal.replace(/[R$\s.]/g, '').replace(',', '.'))).toFixed(2).replace('.', ',')}`
    : "—";

  const handleEnviar = () => {
    toast({ title: "✅ Enviado para Aprovação", description: `${sol.item} — Fornecedor: ${selecionado || melhorValor?.fornecedor}` });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{sol.item}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sol.solicitante} • {sol.area} • {sol.centroCusto} • Qtd: {sol.qtd}</p>
          </div>
          <Badge className="bg-warning/15 text-warning border-0 text-[10px] shrink-0">{sol.urgencia}</Badge>
        </div>

        {/* Saving */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5">
          <TrendingDown className="h-5 w-5 text-success" />
          <div>
            <p className="text-[10px] text-muted-foreground">Saving potencial vs. pior cotação</p>
            <p className="text-lg font-bold text-success">{savingPotencial}</p>
          </div>
        </div>

        {/* Table */}
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cots.map((c, i) => (
                <TableRow key={i} className={`hover:bg-muted/20 ${c.melhor ? 'bg-success/5' : ''} ${selecionado === c.fornecedor ? 'ring-1 ring-primary' : ''}`}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{c.fornecedor}</span>
                      {c.melhor && <Trophy className="h-3.5 w-3.5 text-warning" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-xs font-bold ${c.melhor ? 'text-success' : ''}`}>{c.valorTotal}</span>
                  </TableCell>
                  <TableCell className="text-xs">{c.frete}</TableCell>
                  <TableCell className="text-xs">{c.prazo}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.formaPagamento}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground max-w-[150px] truncate">{c.obs}</TableCell>
                  <TableCell>
                    <Button size="sm" variant={selecionado === c.fornecedor ? "default" : "outline"} className="h-7 text-[10px] px-2"
                      onClick={() => setSelecionado(c.fornecedor)}>
                      {selecionado === c.fornecedor ? <><CheckCircle2 className="h-3 w-3 mr-1" />Selecionado</> : "Selecionar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button size="sm" className="h-9 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={handleEnviar}
            disabled={!selecionado && !melhorValor}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Enviar para Aprovação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CotacoesScreen() {
  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-muted-foreground">Compare propostas de fornecedores lado a lado e selecione a melhor opção.</p>

      <Comparador sol={solicitacao} cots={cotacoes} />
      <Comparador sol={cotacao2Solicitacao} cots={cotacoes2} />
    </div>
  );
}
