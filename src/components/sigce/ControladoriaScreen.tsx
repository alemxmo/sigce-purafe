import { TrendingDown, TrendingUp, DollarSign, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const savingData = [
  { pedido: "Retiro Fazenda Pura Fé", original: 6250, fechado: 6000, economia: 250, negociador: "Janete" },
  { pedido: "Material de Limpeza SEDE", original: 850, fechado: 780, economia: 70, negociador: "Janete" },
  { pedido: "Camisetas de Batismo (100un)", original: 3200, fechado: 2800, economia: 400, negociador: "Rafael" },
  { pedido: "Kit Café — Central", original: 415, fechado: 389.61, economia: 25.39, negociador: "Rafael" },
  { pedido: "Líquido Haze 5L (4x)", original: 1320, fechado: 1180, economia: 140, negociador: "Janete" },
  { pedido: "Copos Biodegradáveis 60ml", original: 580, fechado: 520, economia: 60, negociador: "Rafael" },
];

const despesasRecorrentes = [
  { item: "Kit Café Mensal", valor: "R$ 389,61", frequencia: "Mensal", prox: "01/04" },
  { item: "Material de Limpeza", valor: "R$ 780,00", frequencia: "Mensal", prox: "01/04" },
  { item: "IPTU (parcela 3/10)", valor: "R$ 4.678,38", frequencia: "Mensal", prox: "10/04" },
  { item: "Internet + Telefonia", valor: "R$ 1.250,00", frequencia: "Mensal", prox: "05/04" },
];

const vencimentosFuturos = [
  { data: "15/03", total: "R$ 6.000,00", itens: 1 },
  { data: "20/03", total: "R$ 3.420,00", itens: 3 },
  { data: "01/04", total: "R$ 8.097,99", itens: 4 },
  { data: "05/04", total: "R$ 1.250,00", itens: 1 },
  { data: "10/04", total: "R$ 4.678,38", itens: 1 },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const totalOriginal = savingData.reduce((s, d) => s + d.original, 0);
const totalFechado = savingData.reduce((s, d) => s + d.fechado, 0);
const totalSaving = savingData.reduce((s, d) => s + d.economia, 0);
const pctSaving = ((totalSaving / totalOriginal) * 100).toFixed(1);

export default function ControladoriaScreen() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-foreground" />
              </div>
            </div>
            <p className="text-lg font-bold">{fmt(totalOriginal)}</p>
            <p className="text-[10px] text-muted-foreground">Valor Original Total</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-lg font-bold">{fmt(totalFechado)}</p>
            <p className="text-[10px] text-muted-foreground">Valor Fechado</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-lg font-bold text-success">{fmt(totalSaving)}</p>
            <p className="text-[10px] text-muted-foreground">Saving Acumulado ({pctSaving}%)</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
            </div>
            <p className="text-lg font-bold">{savingData.length}</p>
            <p className="text-[10px] text-muted-foreground">Negociações no Mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Saving Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalhamento de Saving</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Pedido</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor Original</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor Fechado</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Economia</TableHead>
                <TableHead className="text-[11px] font-semibold">%</TableHead>
                <TableHead className="text-[11px] font-semibold">Negociador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingData.map((d, i) => (
                <TableRow key={i} className="hover:bg-muted/20">
                  <TableCell className="text-xs font-medium">{d.pedido}</TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground line-through">{fmt(d.original)}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">{fmt(d.fechado)}</TableCell>
                  <TableCell className="text-xs text-right font-bold text-success">{fmt(d.economia)}</TableCell>
                  <TableCell><Badge className="text-[10px] bg-success/15 text-success border-0">{((d.economia / d.original) * 100).toFixed(1)}%</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.negociador}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell className="text-xs">TOTAL</TableCell>
                <TableCell className="text-xs text-right">{fmt(totalOriginal)}</TableCell>
                <TableCell className="text-xs text-right">{fmt(totalFechado)}</TableCell>
                <TableCell className="text-xs text-right text-success">{fmt(totalSaving)}</TableCell>
                <TableCell><Badge className="text-[10px] bg-success/15 text-success border-0">{pctSaving}%</Badge></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Recorrentes + Vencimentos */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Despesas Recorrentes</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="space-y-2">
              {despesasRecorrentes.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div>
                    <p className="text-xs font-medium">{d.item}</p>
                    <p className="text-[10px] text-muted-foreground">{d.frequencia} • Próx: {d.prox}</p>
                  </div>
                  <span className="text-xs font-semibold">{d.valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Previsão de Caixa — Vencimentos</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="space-y-2">
              {vencimentosFuturos.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{v.data}</span>
                    <Badge variant="secondary" className="text-[9px]">{v.itens} {v.itens === 1 ? 'item' : 'itens'}</Badge>
                  </div>
                  <span className="text-xs font-bold">{v.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
