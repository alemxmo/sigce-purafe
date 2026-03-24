import { useState } from "react";
import { AlertTriangle, CheckCircle, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ContaPagar {
  fornecedor: string;
  descricao: string;
  vencimento: string;
  vencimentoTag: string;
  valor: number;
  categoria: string;
  centroCusto: string;
  status: string;
}

const contas: ContaPagar[] = [
  { fornecedor: "Dousystem", descricao: "Mat Descartável e Limpeza", vencimento: "Hoje", vencimentoTag: "hoje", valor: 2112.0, categoria: "Boleto", centroCusto: "SEDE", status: "Pendente" },
  { fornecedor: "IPTU 2/10", descricao: "Imposto Territorial", vencimento: "Amanhã", vencimentoTag: "amanha", valor: 4678.38, categoria: "Boleto", centroCusto: "CENTRAL", status: "Pendente" },
  { fornecedor: "TACC Iluminação", descricao: "Líquido de Haze", vencimento: "09/03", vencimentoTag: "futuro", valor: 1180.0, categoria: "Pix", centroCusto: "SEDE", status: "Liberado p/ Pagamento" },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinanceiroScreen() {
  const [filtroVenc, setFiltroVenc] = useState("todos");
  const [filtroCc, setFiltroCc] = useState("todos");

  const filtered = contas.filter(c => {
    if (filtroVenc !== "todos" && c.vencimentoTag !== filtroVenc) return false;
    if (filtroCc !== "todos" && c.centroCusto !== filtroCc) return false;
    return true;
  });

  const totalPendente = contas.filter(c => c.status === "Pendente").reduce((s, c) => s + c.valor, 0);
  const totalLiberado = contas.filter(c => c.status !== "Pendente").reduce((s, c) => s + c.valor, 0);
  const vencHoje = contas.filter(c => c.vencimentoTag === "hoje").length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Pendente</p>
              <p className="text-xl font-bold">{fmt(totalPendente)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Liberado</p>
              <p className="text-xl font-bold">{fmt(totalLiberado)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vencimentos Críticos</p>
              <p className="text-xl font-bold">{vencHoje}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filtroVenc} onValueChange={setFiltroVenc}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Vencimento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os vencimentos</SelectItem>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="amanha">Amanhã</SelectItem>
            <SelectItem value="futuro">Futuro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCc} onValueChange={setFiltroCc}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Centro de Custo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os centros</SelectItem>
            <SelectItem value="SEDE">SEDE</SelectItem>
            <SelectItem value="CENTRAL">CENTRAL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Fornecedor</TableHead>
              <TableHead className="font-semibold">Descrição</TableHead>
              <TableHead className="font-semibold">Vencimento</TableHead>
              <TableHead className="font-semibold text-right">Valor</TableHead>
              <TableHead className="font-semibold">Categoria</TableHead>
              <TableHead className="font-semibold">Centro Custo</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={i} className="hover:bg-muted/30">
                <TableCell className="font-medium">{c.fornecedor}</TableCell>
                <TableCell className="text-muted-foreground">{c.descricao}</TableCell>
                <TableCell>
                  <span className={`font-medium ${c.vencimentoTag === 'hoje' ? 'text-destructive' : c.vencimentoTag === 'amanha' ? 'text-warning' : ''}`}>
                    {c.vencimento}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">{fmt(c.valor)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{c.categoria}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">{c.centroCusto}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs border-0 ${
                    c.status === "Pendente"
                      ? "bg-warning/15 text-warning"
                      : "bg-success/15 text-success"
                  }`}>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhuma conta encontrada com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
