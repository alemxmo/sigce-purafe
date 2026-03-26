import { useState } from "react";
import { CreditCard, AlertTriangle, CheckCircle2, Clock, Copy, Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface Pagamento {
  id: number;
  fornecedor: string;
  descricao: string;
  vencimento: string;
  valor: string;
  categoria: string;
  centroCusto: string;
  status: "pendente" | "liberado" | "pago" | "atrasado" | "parcial";
  formaPagamento: string;
  pix?: string;
  banco?: string;
  responsavel: string;
  obs?: string;
  comprovante?: boolean;
}

const pagamentos: Pagamento[] = [
  {
    id: 1, fornecedor: "Dousystem", descricao: "Mat Descartável e Limpeza", vencimento: "Hoje",
    valor: "R$ 2.112,00", categoria: "Boleto", centroCusto: "SEDE", status: "pendente",
    formaPagamento: "Boleto", banco: "BB — Ag 1234 / CC 56789-0", pix: "12345678000101",
    responsavel: "Financeiro", obs: "Vencimento crítico",
  },
  {
    id: 2, fornecedor: "IPTU 2/10", descricao: "Imposto Territorial", vencimento: "Amanhã",
    valor: "R$ 4.678,38", categoria: "Boleto", centroCusto: "CENTRAL", status: "pendente",
    formaPagamento: "Boleto", responsavel: "Financeiro",
  },
  {
    id: 3, fornecedor: "TACC Iluminação", descricao: "Líquido de Haze", vencimento: "09/03",
    valor: "R$ 1.180,00", categoria: "Pix", centroCusto: "SEDE", status: "pago",
    formaPagamento: "Pix", pix: "tacc@iluminacao.com.br", responsavel: "Financeiro",
    comprovante: true,
  },
  {
    id: 4, fornecedor: "Fazenda Pura Fé", descricao: "Retiro Liderança — Sinal", vencimento: "15/03",
    valor: "R$ 3.000,00", categoria: "Pix", centroCusto: "EVENTOS", status: "liberado",
    formaPagamento: "Pix", pix: "56789012000105", banco: "Caixa — Ag 2345 / CC 67890-1",
    responsavel: "Financeiro", obs: "Sinal de 50% — restante na data do evento",
  },
  {
    id: 5, fornecedor: "Casa do Café", descricao: "Kit Café — Central", vencimento: "11/03",
    valor: "R$ 389,61", categoria: "Pix", centroCusto: "CENTRAL", status: "liberado",
    formaPagamento: "Pix", pix: "(11)933333333", responsavel: "Financeiro",
  },
  {
    id: 6, fornecedor: "Print Express", descricao: "Banners Campanha Páscoa", vencimento: "05/03",
    valor: "R$ 680,00", categoria: "Boleto", centroCusto: "CRIATIVO", status: "atrasado",
    formaPagamento: "Boleto", responsavel: "Financeiro", obs: "Boleto vencido — solicitar 2ª via",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning/15 text-warning" },
  liberado: { label: "Liberado p/ Pagamento", color: "bg-primary/15 text-primary" },
  pago: { label: "Pago", color: "bg-success/15 text-success" },
  atrasado: { label: "Atrasado", color: "bg-destructive/15 text-destructive" },
  parcial: { label: "Parcial", color: "bg-warning/15 text-warning" },
};

export default function FinanceiroScreen() {
  const [filtroVenc, setFiltroVenc] = useState("todos");
  const [filtroCc, setFiltroCc] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const filtered = pagamentos.filter(p => {
    if (filtroVenc === "hoje" && p.vencimento !== "Hoje") return false;
    if (filtroVenc === "amanha" && p.vencimento !== "Amanhã") return false;
    if (filtroVenc === "futuro" && ["Hoje", "Amanhã"].includes(p.vencimento)) return false;
    if (filtroCc !== "todos" && p.centroCusto !== filtroCc) return false;
    if (filtroStatus !== "todos" && p.status !== filtroStatus) return false;
    return true;
  });

  const totalPendente = pagamentos.filter(p => p.status === "pendente").reduce((s, p) => s + parseFloat(p.valor.replace(/[R$\s.]/g, '').replace(',', '.')), 0);
  const totalLiberado = pagamentos.filter(p => p.status === "liberado").reduce((s, p) => s + parseFloat(p.valor.replace(/[R$\s.]/g, '').replace(',', '.')), 0);
  const totalPago = pagamentos.filter(p => p.status === "pago").reduce((s, p) => s + parseFloat(p.valor.replace(/[R$\s.]/g, '').replace(',', '.')), 0);
  const totalAtrasado = pagamentos.filter(p => p.status === "atrasado").reduce((s, p) => s + parseFloat(p.valor.replace(/[R$\s.]/g, '').replace(',', '.')), 0);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCopyPix = (pix: string) => {
    navigator.clipboard.writeText(pix);
    toast({ title: "📋 Pix Copiado", description: pix });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-warning">{fmt(totalPendente)}</p>
          <p className="text-[10px] text-muted-foreground">Pendente</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-primary">{fmt(totalLiberado)}</p>
          <p className="text-[10px] text-muted-foreground">Liberado p/ Pagamento</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-success">{fmt(totalPago)}</p>
          <p className="text-[10px] text-muted-foreground">Pago</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-destructive">{fmt(totalAtrasado)}</p>
          <p className="text-[10px] text-muted-foreground">Atrasado</p>
        </CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filtroVenc} onValueChange={setFiltroVenc}>
          <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Vencimento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="amanha">Amanhã</SelectItem>
            <SelectItem value="futuro">Futuro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCc} onValueChange={setFiltroCc}>
          <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Centro Custo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="SEDE">SEDE</SelectItem>
            <SelectItem value="CENTRAL">CENTRAL</SelectItem>
            <SelectItem value="EVENTOS">EVENTOS</SelectItem>
            <SelectItem value="CRIATIVO">CRIATIVO</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="liberado">Liberado</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                <TableHead className="text-[11px] font-semibold">Descrição</TableHead>
                <TableHead className="text-[11px] font-semibold">Vencimento</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor</TableHead>
                <TableHead className="text-[11px] font-semibold">Forma</TableHead>
                <TableHead className="text-[11px] font-semibold">Centro</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
                <TableHead className="text-[11px] font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => {
                const st = statusConfig[p.status];
                return (
                  <TableRow key={p.id} className={`hover:bg-muted/20 ${p.vencimento === 'Hoje' || p.status === 'atrasado' ? 'bg-destructive/5' : ''}`}>
                    <TableCell>
                      <p className="text-xs font-medium">{p.fornecedor}</p>
                      {p.banco && <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">{p.banco}</p>}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs">{p.descricao}</p>
                      {p.obs && <p className="text-[9px] text-muted-foreground">{p.obs}</p>}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${p.vencimento === 'Hoje' || p.status === 'atrasado' ? 'text-destructive font-bold' : ''}`}>
                        {p.vencimento}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-right">{p.valor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.formaPagamento}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{p.centroCusto}</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border-0 ${st.color}`}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {p.pix && (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => handleCopyPix(p.pix!)}>
                            <Copy className="h-3 w-3 mr-0.5" /> Pix
                          </Button>
                        )}
                        {p.status !== "pago" && (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]">
                            <Upload className="h-3 w-3 mr-0.5" /> Comprovante
                          </Button>
                        )}
                        {p.comprovante && (
                          <Badge className="text-[9px] bg-success/15 text-success border-0">✓ Comprovante</Badge>
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
