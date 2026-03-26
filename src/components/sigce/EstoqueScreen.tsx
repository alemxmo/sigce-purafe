import { Package, AlertTriangle, CheckCircle2, ShoppingCart, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Item {
  id: number;
  nome: string;
  categoria: string;
  qtd: number;
  estoqueMinimo: number;
  pontoReposicao: number;
  local: string;
  status: "adequado" | "alerta" | "comprar";
  ultimaEntrada?: string;
  ultimaSaida?: string;
}

const itens: Item[] = [
  { id: 1, nome: "Camisetas de Batismo", categoria: "Vestuário", qtd: 70, estoqueMinimo: 20, pontoReposicao: 40, local: "SEDE — Almoxarifado A", status: "adequado", ultimaEntrada: "10/03 — 70 un (Print Express)", ultimaSaida: "Último batismo: 08/03 — 12 un" },
  { id: 2, nome: "Pilhas p/ Microfone (AA)", categoria: "Eletrônicos", qtd: 15, estoqueMinimo: 20, pontoReposicao: 48, local: "SEDE — Sala Técnica", status: "comprar", ultimaEntrada: "20/02 — 48 un (SomPro)", ultimaSaida: "Cultos semanais — ~8 un/semana" },
  { id: 3, nome: "Copos Papel Biodegradável 60ml", categoria: "Descartáveis", qtd: 50, estoqueMinimo: 100, pontoReposicao: 500, local: "SEDE — Copa", status: "alerta", ultimaEntrada: "01/03 — 500 un (Dousystem)", ultimaSaida: "Consumo diário: ~30 un" },
  { id: 4, nome: "Livros Pastorais", categoria: "Materiais", qtd: 120, estoqueMinimo: 30, pontoReposicao: 50, local: "SEDE — Secretaria", status: "adequado" },
  { id: 5, nome: "Líquido Haze 5L", categoria: "Consumíveis", qtd: 1, estoqueMinimo: 2, pontoReposicao: 4, local: "SEDE — Sala Técnica", status: "comprar", ultimaEntrada: "10/02 — 4 galões (TACC)", ultimaSaida: "~1 galão/semana" },
  { id: 6, nome: "Desinfetante 5L", categoria: "Limpeza", qtd: 8, estoqueMinimo: 3, pontoReposicao: 6, local: "SEDE — Almoxarifado B", status: "adequado", ultimaEntrada: "08/03 — 12 un (Dousystem)" },
];

const entradasRecentes = [
  { data: "10/03", item: "Camisetas de Batismo (70 un)", fornecedor: "Print Express", local: "SEDE — Almoxarifado A" },
  { data: "08/03", item: "Material de Limpeza completo", fornecedor: "Dousystem", local: "SEDE — Almoxarifado B" },
  { data: "05/03", item: "Kit Café Completo", fornecedor: "Casa do Café", local: "SEDE — Copa" },
];

const statusColor: Record<string, string> = {
  adequado: "bg-success/15 text-success",
  alerta: "bg-warning/15 text-warning",
  comprar: "bg-destructive/15 text-destructive",
};

const statusLabel: Record<string, string> = {
  adequado: "Adequado",
  alerta: "Alerta",
  comprar: "Comprar",
};

export default function EstoqueScreen() {
  const adequados = itens.filter(i => i.status === "adequado").length;
  const alertas = itens.filter(i => i.status === "alerta").length;
  const comprar = itens.filter(i => i.status === "comprar").length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

      <p className="text-[10px] text-muted-foreground">Controle inicial estruturado — base para evolução futura com saídas, inventário e integração completa.</p>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Item</TableHead>
                <TableHead className="text-[11px] font-semibold">Categoria</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Qtd</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Mínimo</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Pt. Reposição</TableHead>
                <TableHead className="text-[11px] font-semibold">Local</TableHead>
                <TableHead className="text-[11px] font-semibold">Nível</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map(item => {
                const pct = Math.min((item.qtd / item.pontoReposicao) * 100, 100);
                const barColor = item.status === "adequado" ? "bg-success" : item.status === "alerta" ? "bg-warning" : "bg-destructive";
                return (
                  <TableRow key={item.id} className={`hover:bg-muted/20 ${item.status === 'comprar' ? 'bg-destructive/5' : ''}`}>
                    <TableCell>
                      <p className="text-xs font-medium">{item.nome}</p>
                      {item.ultimaSaida && <p className="text-[9px] text-muted-foreground">{item.ultimaSaida}</p>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.categoria}</TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-bold ${item.status === 'comprar' ? 'text-destructive' : item.status === 'alerta' ? 'text-warning' : ''}`}>
                        {item.qtd}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{item.estoqueMinimo}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{item.pontoReposicao}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{item.local}</TableCell>
                    <TableCell>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`text-[10px] border-0 ${statusColor[item.status]}`}>{statusLabel[item.status]}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5" /> Entradas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="space-y-2">
            {entradasRecentes.map((e, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div>
                  <p className="text-xs font-medium">{e.item}</p>
                  <p className="text-[10px] text-muted-foreground">{e.fornecedor} → {e.local}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{e.data}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
