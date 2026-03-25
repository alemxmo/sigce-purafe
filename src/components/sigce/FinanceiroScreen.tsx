import { useState } from "react";
import { AlertTriangle, CheckCircle, CreditCard, Copy, Upload, Clock, FileText, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Pagamento {
  id: number;
  fornecedor: string;
  descricao: string;
  vencimento: string;
  vencimentoTag: string;
  valor: number;
  categoria: string;
  centroCusto: string;
  status: "pendente" | "liberado" | "pago" | "atrasado" | "parcial";
  pix?: string;
  banco?: string;
  nf?: string;
  comprovante: boolean;
}

const pagamentos: Pagamento[] = [
  { id: 1, fornecedor: "Dousystem", descricao: "Mat Descartável e Limpeza", vencimento: "Hoje", vencimentoTag: "hoje", valor: 2112.0, categoria: "Boleto", centroCusto: "SEDE", status: "pendente", pix: "12345678000101", banco: "BB Ag 1234 / CC 56789-0", comprovante: false },
  { id: 2, fornecedor: "IPTU 2/10", descricao: "Imposto Territorial", vencimento: "Amanhã", vencimentoTag: "amanha", valor: 4678.38, categoria: "Boleto", centroCusto: "CENTRAL", status: "pendente", comprovante: false },
  { id: 3, fornecedor: "TACC Iluminação", descricao: "Líquido de Haze 5L (4x)", vencimento: "09/03", vencimentoTag: "futuro", valor: 1180.0, categoria: "Pix", centroCusto: "LOUVOR", status: "liberado", pix: "tacc@iluminacao.com.br", banco: "Itaú Ag 4567 / CC 12345-6", comprovante: false },
  { id: 4, fornecedor: "Casa do Café", descricao: "Kit Café Completo", vencimento: "05/03", vencimentoTag: "passado", valor: 389.61, categoria: "Pix", centroCusto: "CENTRAL", status: "pago", pix: "(11)933333333", comprovante: true, nf: "NF #4580" },
  { id: 5, fornecedor: "Fazenda Pura Fé", descricao: "Retiro Março — Sinal", vencimento: "15/03", vencimentoTag: "futuro", valor: 3000.0, categoria: "Transferência", centroCusto: "EVENTOS", status: "liberado", pix: "56789012000105", banco: "Caixa Ag 2345 / CC 67890-1", comprovante: false },
  { id: 6, fornecedor: "Print Express", descricao: "Banners Páscoa 3x2m (2x)", vencimento: "12/03", vencimentoTag: "futuro", valor: 680.0, categoria: "Pix", centroCusto: "CRIATIVO", status: "pendente", pix: "grafica@printexpress.com", comprovante: false },
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-warning/15 text-warning" },
  liberado: { label: "Liberado", color: "bg-success/15 text-success" },
  pago: { label: "Pago", color: "bg-muted text-muted-foreground" },
  atrasado: { label: "Atrasado", color: "bg-destructive/15 text-destructive" },
  parcial: { label: "Parcial", color: "bg-warning/15 text-warning" },
};

export default function FinanceiroScreen() {
  const [filtroVenc, setFiltroVenc] = useState("todos");
  const [filtroCc, setFiltroCc] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const filtered = pagamentos.filter(c => {
    if (filtroVenc !== "todos" && c.vencimentoTag !== filtroVenc) return false;
    if (filtroCc !== "todos" && c.centroCusto !== filtroCc) return false;
    if (filtroStatus !== "todos" && c.status !== filtroStatus) return false;
    return true;
  });

  const totalPendente = pagamentos.filter(c => c.status === "pendente").reduce((s, c) => s + c.valor, 0);
  const totalLiberado = pagamentos.filter(c => c.status === "liberado").reduce((s, c) => s + c.valor, 0);
  const totalPago = pagamentos.filter(c => c.status === "pago").reduce((s, c) => s + c.valor, 0);
  const vencHoje = pagamentos.filter(c => c.vencimentoTag === "hoje").length;

  const handleCopyPix = (pix: string) => {
    navigator.clipboard.writeText(pix);
    toast({ title: "📋 Pix Copiado", description: pix });
  };

  const handleUpload = (fornecedor: string) => {
    toast({ title: "📎 Comprovante Enviado", description: `Comprovante de ${fornecedor} registrado com sucesso.` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Pendente</p>
              <p className="text-base font-bold">{fmt(totalPendente)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Liberado</p>
              <p className="text-base font-bold">{fmt(totalLiberado)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Pago</p>
              <p className="text-base font-bold">{fmt(totalPago)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Vence Hoje</p>
              <p className="text-base font-bold">{vencHoje}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="liberado">Liberado</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroVenc} onValueChange={setFiltroVenc}>
          <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue placeholder="Vencimento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="amanha">Amanhã</SelectItem>
            <SelectItem value="futuro">Futuro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCc} onValueChange={setFiltroCc}>
          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Centro Custo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="SEDE">SEDE</SelectItem>
            <SelectItem value="CENTRAL">CENTRAL</SelectItem>
            <SelectItem value="LOUVOR">LOUVOR</SelectItem>
            <SelectItem value="EVENTOS">EVENTOS</SelectItem>
            <SelectItem value="CRIATIVO">CRIATIVO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                <TableHead className="text-[11px] font-semibold">Descrição</TableHead>
                <TableHead className="text-[11px] font-semibold">Vencimento</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor</TableHead>
                <TableHead className="text-[11px] font-semibold">Tipo</TableHead>
                <TableHead className="text-[11px] font-semibold">Centro</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
                <TableHead className="text-[11px] font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => {
                const st = statusConfig[c.status];
                return (
                  <TableRow key={c.id} className="hover:bg-muted/20">
                    <TableCell className="text-xs font-medium">{c.fornecedor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.descricao}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${c.vencimentoTag === 'hoje' ? 'text-destructive' : c.vencimentoTag === 'amanha' ? 'text-warning' : ''}`}>
                        {c.vencimento}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-right font-semibold">{fmt(c.valor)}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{c.categoria}</Badge></TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{c.centroCusto}</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] border-0 ${st.color}`}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {c.pix && (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Copiar Pix" onClick={() => handleCopyPix(c.pix!)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        {!c.comprovante && c.status !== "pago" && (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" title="Upload Comprovante" onClick={() => handleUpload(c.fornecedor)}>
                            <Upload className="h-3 w-3" />
                          </Button>
                        )}
                        {c.nf && (
                          <Badge variant="outline" className="text-[9px] h-6">{c.nf}</Badge>
                        )}
                        {c.comprovante && (
                          <Badge className="text-[9px] bg-success/15 text-success border-0 h-6">✓ Comprovante</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">Nenhum pagamento encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
