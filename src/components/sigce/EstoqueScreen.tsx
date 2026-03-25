import { useState } from "react";
import { Package, CheckCircle, AlertTriangle, ShoppingCart, ArrowDown, ArrowUp, MapPin, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ItemEstoque {
  id: number;
  item: string;
  categoria: string;
  qtd: number;
  estoqueMinimo: number;
  pontoReposicao: number;
  max: number;
  local: string;
  status: "adequado" | "alerta" | "comprar";
  ultimaEntrada?: string;
  ultimaSaida?: string;
  sugestaoCompra: boolean;
}

const itens: ItemEstoque[] = [
  { id: 1, item: "Camisetas de Batismo", categoria: "Vestuário", qtd: 70, estoqueMinimo: 30, pontoReposicao: 50, max: 150, local: "SEDE — Almoxarifado A", status: "adequado", ultimaEntrada: "10/03 — 70 un (Print Express)", ultimaSaida: "03/03 — 15 un (Batismo Março)", sugestaoCompra: false },
  { id: 2, item: "Pilhas p/ Microfone (AA)", categoria: "Eletrônicos", qtd: 15, estoqueMinimo: 40, pontoReposicao: 60, max: 100, local: "SEDE — Cabine Som", status: "comprar", ultimaEntrada: "20/02 — 48 un (SomPro)", ultimaSaida: "09/03 — 12 un (Culto)", sugestaoCompra: true },
  { id: 3, item: "Copos Papel Biodegradável 60ml", categoria: "Copa & Cozinha", qtd: 50, estoqueMinimo: 100, pontoReposicao: 200, max: 500, local: "SEDE — Copa", status: "alerta", ultimaEntrada: "01/03 — 500 un (Dousystem)", ultimaSaida: "10/03 — 200 un (Semana)", sugestaoCompra: true },
  { id: 4, item: "Livros Pastorais", categoria: "Literatura", qtd: 120, estoqueMinimo: 20, pontoReposicao: 40, max: 200, local: "SEDE — Livraria", status: "adequado", ultimaEntrada: "15/02 — 50 un (Editora Fé)", ultimaSaida: "08/03 — 10 un (Classe Batismo)", sugestaoCompra: false },
  { id: 5, item: "Líquido Haze Galão 5L", categoria: "Consumíveis", qtd: 0, estoqueMinimo: 2, pontoReposicao: 4, max: 10, local: "SEDE — Cabine Iluminação", status: "comprar", ultimaEntrada: "01/02 — 4 un (TACC)", ultimaSaida: "09/03 — 2 un (Culto Especial)", sugestaoCompra: true },
  { id: 6, item: "Kit Café Melitta", categoria: "Copa & Cozinha", qtd: 3, estoqueMinimo: 2, pontoReposicao: 4, max: 10, local: "SEDE — Copa", status: "alerta", ultimaEntrada: "05/03 — 4 un (Casa do Café)", ultimaSaida: "10/03 — 1 un (Semana)", sugestaoCompra: false },
  { id: 7, item: "Desinfetante 5L", categoria: "Limpeza", qtd: 8, estoqueMinimo: 3, pontoReposicao: 5, max: 15, local: "SEDE — Almoxarifado B", status: "adequado", ultimaEntrada: "08/03 — 6 un (Dousystem)", ultimaSaida: "10/03 — 2 un", sugestaoCompra: false },
  { id: 8, item: "Copos Papel 200ml (cx)", categoria: "Copa & Cozinha", qtd: 5, estoqueMinimo: 10, pontoReposicao: 20, max: 50, local: "FAZENDA — Depósito", status: "comprar", ultimaEntrada: "01/02 — 30 cx", ultimaSaida: "09/03 — 15 cx (Retiro)", sugestaoCompra: true },
];

const statusConfig = {
  adequado: { label: "Adequado", color: "bg-success/15 text-success", barColor: "bg-success" },
  alerta: { label: "Alerta", color: "bg-warning/15 text-warning", barColor: "bg-warning" },
  comprar: { label: "Comprar", color: "bg-destructive/15 text-destructive", barColor: "bg-destructive" },
};

export default function EstoqueScreen() {
  const [filtroLocal, setFiltroLocal] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const filtered = itens.filter(i => {
    if (filtroStatus !== "todos" && i.status !== filtroStatus) return false;
    if (filtroLocal !== "todos" && !i.local.toLowerCase().includes(filtroLocal.toLowerCase())) return false;
    return true;
  });

  const adequados = itens.filter(i => i.status === "adequado").length;
  const alertas = itens.filter(i => i.status === "alerta").length;
  const comprar = itens.filter(i => i.status === "comprar").length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">{itens.length}</p>
          <p className="text-[10px] text-muted-foreground">SKUs Monitorados</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-success">{adequados}</p>
          <p className="text-[10px] text-muted-foreground">Adequados</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-warning">{alertas}</p>
          <p className="text-[10px] text-muted-foreground">Em Alerta</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-destructive">{comprar}</p>
          <p className="text-[10px] text-muted-foreground">Para Compra</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="adequado">Adequado</SelectItem>
            <SelectItem value="alerta">Alerta</SelectItem>
            <SelectItem value="comprar">Comprar</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroLocal} onValueChange={setFiltroLocal}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Local" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Locais</SelectItem>
            <SelectItem value="sede">SEDE</SelectItem>
            <SelectItem value="fazenda">FAZENDA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Item</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Saldo</TableHead>
                <TableHead className="text-[11px] font-semibold">Nível</TableHead>
                <TableHead className="text-[11px] font-semibold">Mín / Repos.</TableHead>
                <TableHead className="text-[11px] font-semibold">Local</TableHead>
                <TableHead className="text-[11px] font-semibold">Última Entrada</TableHead>
                <TableHead className="text-[11px] font-semibold">Última Saída</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => {
                const cfg = statusConfig[item.status];
                const pct = Math.min(Math.round((item.qtd / item.max) * 100), 100);
                return (
                  <TableRow key={item.id} className={`hover:bg-muted/20 ${item.status === 'comprar' ? 'bg-destructive/5' : ''}`}>
                    <TableCell>
                      <p className="text-xs font-medium">{item.item}</p>
                      <p className="text-[10px] text-muted-foreground">{item.categoria}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-sm font-bold ${item.status === 'comprar' ? 'text-destructive' : item.status === 'alerta' ? 'text-warning' : ''}`}>
                        {item.qtd}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${cfg.barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{pct}%</span>
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{item.estoqueMinimo} / {item.pontoReposicao}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{item.local}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[10px] text-success">
                        <ArrowDown className="h-2.5 w-2.5" />
                        <span className="text-muted-foreground">{item.ultimaEntrada}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[10px]">
                        <ArrowUp className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.ultimaSaida}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`text-[10px] border-0 ${cfg.color}`}>{cfg.label}</Badge>
                        {item.sugestaoCompra && (
                          <RefreshCw className="h-3 w-3 text-primary" title="Sugestão de nova compra" />
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
