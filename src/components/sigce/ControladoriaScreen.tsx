import { useState } from "react";
import { TrendingDown, DollarSign, Calendar, CreditCard, FileText, Paperclip, Upload, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Anexo {
  tipo: "boleto" | "nf" | "comprovante" | "outro";
  nome: string;
  data: string;
}

interface SavingItem {
  pedido: string;
  original: number;
  fechado: number;
  economia: number;
  negociador: string;
  anexos: Anexo[];
}

const initialSavingData: SavingItem[] = [
  { pedido: "Retiro Fazenda Pura Fé", original: 6250, fechado: 6000, economia: 250, negociador: "Controladoria", anexos: [
    { tipo: "nf", nome: "NF_003421.pdf", data: "08/03/2025" },
    { tipo: "boleto", nome: "Boleto_FazendaPF_Mar.pdf", data: "08/03/2025" },
  ]},
  { pedido: "Material de Limpeza SEDE", original: 850, fechado: 780, economia: 70, negociador: "Controladoria", anexos: [
    { tipo: "nf", nome: "NF_001198.pdf", data: "05/03/2025" },
  ]},
  { pedido: "Camisetas de Batismo (100un)", original: 3200, fechado: 2800, economia: 400, negociador: "Compras", anexos: [] },
  { pedido: "Kit Café — Central", original: 415, fechado: 389.61, economia: 25.39, negociador: "Compras", anexos: [
    { tipo: "comprovante", nome: "Comprovante_Pix_Cafe.pdf", data: "11/03/2025" },
  ]},
  { pedido: "Líquido Haze 5L (4x)", original: 1320, fechado: 1180, economia: 140, negociador: "Controladoria", anexos: [] },
  { pedido: "Copos Biodegradáveis 60ml", original: 580, fechado: 520, economia: 60, negociador: "Compras", anexos: [] },
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

const tipoConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  nf: { label: "Nota Fiscal", icon: FileText, color: "bg-primary/15 text-primary" },
  boleto: { label: "Boleto", icon: CreditCard, color: "bg-warning/15 text-warning" },
  comprovante: { label: "Comprovante", icon: Upload, color: "bg-success/15 text-success" },
  outro: { label: "Outro", icon: Paperclip, color: "bg-muted text-muted-foreground" },
};

export default function ControladoriaScreen() {
  const [savingData, setSavingData] = useState<SavingItem[]>(initialSavingData);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [novoTipo, setNovoTipo] = useState<string>("");
  const [novoNome, setNovoNome] = useState("");

  const totalOriginal = savingData.reduce((s, d) => s + d.original, 0);
  const totalFechado = savingData.reduce((s, d) => s + d.fechado, 0);
  const totalSaving = savingData.reduce((s, d) => s + d.economia, 0);
  const pctSaving = ((totalSaving / totalOriginal) * 100).toFixed(1);

  const selected = selectedIdx !== null ? savingData[selectedIdx] : null;

  const handleAnexar = () => {
    if (!novoTipo || !novoNome || selectedIdx === null) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    setSavingData(prev => prev.map((item, i) =>
      i === selectedIdx
        ? { ...item, anexos: [...item.anexos, { tipo: novoTipo as Anexo["tipo"], nome: novoNome, data: hoje }] }
        : item
    ));
    toast({ title: "📎 Documento anexado", description: `${tipoConfig[novoTipo]?.label}: ${novoNome}` });
    setNovoTipo("");
    setNovoNome("");
    setShowForm(false);
  };

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
                <TableHead className="text-[11px] font-semibold">Negociado por</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Docs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savingData.map((d, i) => (
                <TableRow key={i} className="hover:bg-muted/20 cursor-pointer" onClick={() => setSelectedIdx(i)}>
                  <TableCell className="text-xs font-medium">{d.pedido}</TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground line-through">{fmt(d.original)}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">{fmt(d.fechado)}</TableCell>
                  <TableCell className="text-xs text-right font-bold text-success">{fmt(d.economia)}</TableCell>
                  <TableCell><Badge className="text-[10px] bg-success/15 text-success border-0">{((d.economia / d.original) * 100).toFixed(1)}%</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.negociador}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Paperclip className="h-3.5 w-3.5" />
                      {d.anexos.length > 0 && (
                        <Badge variant="secondary" className="text-[9px] h-4 min-w-[16px] px-1">{d.anexos.length}</Badge>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell className="text-xs">TOTAL</TableCell>
                <TableCell className="text-xs text-right">{fmt(totalOriginal)}</TableCell>
                <TableCell className="text-xs text-right">{fmt(totalFechado)}</TableCell>
                <TableCell className="text-xs text-right text-success">{fmt(totalSaving)}</TableCell>
                <TableCell><Badge className="text-[10px] bg-success/15 text-success border-0">{pctSaving}%</Badge></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Document Drawer */}
      <Sheet open={selectedIdx !== null} onOpenChange={(open) => { if (!open) { setSelectedIdx(null); setShowForm(false); } }}>
        <SheetContent className="w-[400px] sm:w-[460px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">Documentos do Pedido</SheetTitle>
          </SheetHeader>

          {selected && (
            <div className="mt-4 space-y-5">
              {/* Resumo */}
              <div className="rounded-lg bg-muted/30 p-4 space-y-1">
                <p className="text-sm font-semibold">{selected.pedido}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Original: <span className="line-through">{fmt(selected.original)}</span></span>
                  <span>Fechado: <span className="font-semibold text-foreground">{fmt(selected.fechado)}</span></span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-success font-semibold">Saving: {fmt(selected.economia)}</span>
                  <span className="text-muted-foreground">{selected.negociador}</span>
                </div>
              </div>

              {/* Anexos existentes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documentos Anexados</h4>
                  <Badge variant="secondary" className="text-[10px]">{selected.anexos.length}</Badge>
                </div>

                {selected.anexos.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center">Nenhum documento anexado</p>
                ) : (
                  <div className="space-y-2">
                    {selected.anexos.map((a, idx) => {
                      const cfg = tipoConfig[a.tipo];
                      const Icon = cfg.icon;
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{a.nome}</p>
                            <p className="text-[10px] text-muted-foreground">{cfg.label} • {a.data}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form de anexo */}
              {!showForm ? (
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={() => setShowForm(true)}>
                  <Plus className="h-3.5 w-3.5" /> Anexar Documento
                </Button>
              ) : (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold">Novo Documento</h4>
                    <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <Select value={novoTipo} onValueChange={setNovoTipo}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Tipo do documento" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nf">Nota Fiscal</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="comprovante">Comprovante de Pagamento</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="h-9 text-xs" placeholder="Nome do arquivo (ex: NF_001234.pdf)" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
                  <Button size="sm" className="w-full text-xs gap-1.5" onClick={handleAnexar} disabled={!novoTipo || !novoNome}>
                    <Upload className="h-3.5 w-3.5" /> Anexar
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

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
