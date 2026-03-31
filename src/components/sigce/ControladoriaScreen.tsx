import { useState } from "react";
import {
  TrendingDown, DollarSign, Calendar, CreditCard, FileText, Paperclip,
  Upload, Plus, X, RotateCcw, Zap, Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// ── Types ──
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

interface DespesaRecorrente {
  item: string;
  valor: string;
  frequencia: string;
  prox: string;
  centroCusto: string;
  categoria: string;
  anexos: Anexo[];
}

interface LancamentoDireto {
  id: number;
  descricao: string;
  beneficiario: string;
  valor: string;
  vencimento: string;
  centroCusto: string;
  categoria: string;
  formaPagamento: string;
  pixDados: string;
  anexos: Anexo[];
}

// ── Initial Data ──
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

const initialRecorrentes: DespesaRecorrente[] = [
  { item: "Kit Café Mensal", valor: "R$ 389,61", frequencia: "Mensal", prox: "01/04", centroCusto: "CENTRAL", categoria: "Utilidades", anexos: [] },
  { item: "Material de Limpeza", valor: "R$ 780,00", frequencia: "Mensal", prox: "01/04", centroCusto: "SEDE", categoria: "Utilidades", anexos: [{ tipo: "boleto", nome: "Boleto_Limpeza_Abr.pdf", data: "25/03/2025" }] },
  { item: "IPTU (parcela 3/10)", valor: "R$ 4.678,38", frequencia: "Mensal", prox: "10/04", centroCusto: "CENTRAL", categoria: "IPTU", anexos: [{ tipo: "boleto", nome: "IPTU_Parcela3.pdf", data: "01/03/2025" }] },
  { item: "Internet + Telefonia", valor: "R$ 1.250,00", frequencia: "Mensal", prox: "05/04", centroCusto: "SEDE", categoria: "Serviços", anexos: [] },
];

const initialLancamentos: LancamentoDireto[] = [
  { id: 1, descricao: "Taxa Cartorial — Escritura Anexo", beneficiario: "2º Cartório SP", valor: "R$ 1.230,00", vencimento: "18/03", centroCusto: "CENTRAL", categoria: "Taxas", formaPagamento: "Boleto", pixDados: "", anexos: [{ tipo: "boleto", nome: "Boleto_Cartorio_Mar.pdf", data: "10/03/2025" }] },
  { id: 2, descricao: "Reparo Emergencial — Telhado", beneficiario: "JR Manutenções", valor: "R$ 2.800,00", vencimento: "20/03", centroCusto: "SEDE", categoria: "Manutenção", formaPagamento: "Pix", pixDados: "jr.manutencoes@pix.com", anexos: [] },
  { id: 3, descricao: "Seguro Anual — Equipamentos de Som", beneficiario: "Porto Seguro", valor: "R$ 3.450,00", vencimento: "01/04", centroCusto: "EVENTOS", categoria: "Seguros", formaPagamento: "Boleto", pixDados: "", anexos: [{ tipo: "nf", nome: "NF_PortoSeguro_2025.pdf", data: "15/02/2025" }, { tipo: "boleto", nome: "Boleto_Seguro_Abr.pdf", data: "15/03/2025" }] },
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

// ── Shared inline doc attachment mini-form ──
function AnexoForm({ onAnexar }: { onAnexar: (tipo: Anexo["tipo"], nome: string) => void }) {
  const [tipo, setTipo] = useState("");
  const [nome, setNome] = useState("");
  const [open, setOpen] = useState(false);

  if (!open) return (
    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-2" onClick={() => setOpen(true)}>
      <Plus className="h-3.5 w-3.5" /> Anexar Documento
    </Button>
  );

  return (
    <div className="rounded-lg border border-border p-3 space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">Novo Documento</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>
      <Select value={tipo} onValueChange={setTipo}>
        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="nf">Nota Fiscal</SelectItem>
          <SelectItem value="boleto">Boleto</SelectItem>
          <SelectItem value="comprovante">Comprovante</SelectItem>
          <SelectItem value="outro">Outro</SelectItem>
        </SelectContent>
      </Select>
      <Input className="h-8 text-xs" placeholder="Nome do arquivo" value={nome} onChange={e => setNome(e.target.value)} />
      <Button size="sm" className="w-full text-xs h-8" disabled={!tipo || !nome} onClick={() => {
        onAnexar(tipo as Anexo["tipo"], nome);
        setTipo(""); setNome(""); setOpen(false);
      }}>
        <Upload className="h-3 w-3 mr-1" /> Anexar
      </Button>
    </div>
  );
}

function AnexoList({ anexos }: { anexos: Anexo[] }) {
  if (anexos.length === 0) return <p className="text-[10px] text-muted-foreground italic text-center py-2">Nenhum documento</p>;
  return (
    <div className="space-y-1.5">
      {anexos.map((a, i) => {
        const cfg = tipoConfig[a.tipo];
        const Icon = cfg.icon;
        return (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors">
            <div className={`h-7 w-7 rounded flex items-center justify-center ${cfg.color}`}><Icon className="h-3.5 w-3.5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium truncate">{a.nome}</p>
              <p className="text-[9px] text-muted-foreground">{cfg.label} • {a.data}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──
export default function ControladoriaScreen() {
  const [savingData, setSavingData] = useState<SavingItem[]>(initialSavingData);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [novoTipo, setNovoTipo] = useState("");
  const [novoNome, setNovoNome] = useState("");

  // Recorrentes
  const [recorrentes, setRecorrentes] = useState<DespesaRecorrente[]>(initialRecorrentes);
  const [showRecForm, setShowRecForm] = useState(false);
  const [recForm, setRecForm] = useState({ item: "", valor: "", frequencia: "Mensal", prox: "", centroCusto: "SEDE", categoria: "Utilidades" });
  const [recDrawerIdx, setRecDrawerIdx] = useState<number | null>(null);

  // Lançamentos Diretos
  const [lancamentos, setLancamentos] = useState<LancamentoDireto[]>(initialLancamentos);
  const [showLancSheet, setShowLancSheet] = useState(false);
  const [lancForm, setLancForm] = useState({ descricao: "", beneficiario: "", valor: "", vencimento: "", centroCusto: "SEDE", categoria: "Taxas", formaPagamento: "Pix", pixDados: "" });
  const [lancDrawerIdx, setLancDrawerIdx] = useState<number | null>(null);

  // Saving KPIs
  const totalOriginal = savingData.reduce((s, d) => s + d.original, 0);
  const totalFechado = savingData.reduce((s, d) => s + d.fechado, 0);
  const totalSaving = savingData.reduce((s, d) => s + d.economia, 0);
  const pctSaving = ((totalSaving / totalOriginal) * 100).toFixed(1);
  const selected = selectedIdx !== null ? savingData[selectedIdx] : null;

  const handleAnexar = () => {
    if (!novoTipo || !novoNome || selectedIdx === null) return;
    const hoje = new Date().toLocaleDateString("pt-BR");
    setSavingData(prev => prev.map((item, i) =>
      i === selectedIdx ? { ...item, anexos: [...item.anexos, { tipo: novoTipo as Anexo["tipo"], nome: novoNome, data: hoje }] } : item
    ));
    toast({ title: "📎 Documento anexado", description: `${tipoConfig[novoTipo]?.label}: ${novoNome}` });
    setNovoTipo(""); setNovoNome(""); setShowForm(false);
  };

  const handleAddRecorrente = () => {
    if (!recForm.item || !recForm.valor) return;
    setRecorrentes(prev => [...prev, { ...recForm, anexos: [] }]);
    toast({ title: "✅ Despesa recorrente cadastrada", description: recForm.item });
    setRecForm({ item: "", valor: "", frequencia: "Mensal", prox: "", centroCusto: "SEDE", categoria: "Utilidades" });
    setShowRecForm(false);
  };

  const handleAddLancamento = () => {
    if (!lancForm.descricao || !lancForm.valor || !lancForm.beneficiario) return;
    const novo: LancamentoDireto = { ...lancForm, id: Date.now(), anexos: [] };
    setLancamentos(prev => [...prev, novo]);
    toast({ title: "✅ Lançamento cadastrado", description: `${lancForm.descricao} — ${lancForm.valor}` });
    setLancForm({ descricao: "", beneficiario: "", valor: "", vencimento: "", centroCusto: "SEDE", categoria: "Taxas", formaPagamento: "Pix", pixDados: "" });
    setShowLancSheet(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><DollarSign className="h-4 w-4 text-foreground" /></div>
            </div>
            <p className="text-lg font-bold">{fmt(totalOriginal)}</p>
            <p className="text-[10px] text-muted-foreground">Valor Original Total</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><CreditCard className="h-4 w-4 text-primary" /></div>
            </div>
            <p className="text-lg font-bold">{fmt(totalFechado)}</p>
            <p className="text-[10px] text-muted-foreground">Valor Fechado</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center"><TrendingDown className="h-4 w-4 text-success" /></div>
            </div>
            <p className="text-lg font-bold text-success">{fmt(totalSaving)}</p>
            <p className="text-[10px] text-muted-foreground">Saving Acumulado ({pctSaving}%)</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center"><Calendar className="h-4 w-4 text-warning" /></div>
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
                      {d.anexos.length > 0 && <Badge variant="secondary" className="text-[9px] h-4 min-w-[16px] px-1">{d.anexos.length}</Badge>}
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

      {/* Saving Document Drawer */}
      <Sheet open={selectedIdx !== null} onOpenChange={(open) => { if (!open) { setSelectedIdx(null); setShowForm(false); } }}>
        <SheetContent className="w-[400px] sm:w-[460px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-base">Documentos do Pedido</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-4 space-y-5">
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
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documentos Anexados</h4>
                  <Badge variant="secondary" className="text-[10px]">{selected.anexos.length}</Badge>
                </div>
                <AnexoList anexos={selected.anexos} />
              </div>
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

      {/* ═══ DESPESAS RECORRENTES ═══ */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5" /> Despesas Recorrentes
          </CardTitle>
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setShowRecForm(!showRecForm)}>
            <Plus className="h-3 w-3" /> Nova Recorrente
          </Button>
        </CardHeader>
        <CardContent className="px-5 pb-4 space-y-3">
          {/* Form inline */}
          {showRecForm && (
            <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Cadastrar Despesa Recorrente</span>
                <button onClick={() => setShowRecForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input className="h-8 text-xs col-span-2" placeholder="Descrição (ex: IPTU parcela 4/10)" value={recForm.item} onChange={e => setRecForm(p => ({ ...p, item: e.target.value }))} />
                <Input className="h-8 text-xs" placeholder="Valor (R$ 0,00)" value={recForm.valor} onChange={e => setRecForm(p => ({ ...p, valor: e.target.value }))} />
                <Select value={recForm.frequencia} onValueChange={v => setRecForm(p => ({ ...p, frequencia: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Bimestral">Bimestral</SelectItem>
                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-8 text-xs" placeholder="Próx. vencimento (dd/mm)" value={recForm.prox} onChange={e => setRecForm(p => ({ ...p, prox: e.target.value }))} />
                <Select value={recForm.categoria} onValueChange={v => setRecForm(p => ({ ...p, categoria: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IPTU">IPTU</SelectItem>
                    <SelectItem value="Utilidades">Utilidades</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Seguros">Seguros</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={recForm.centroCusto} onValueChange={v => setRecForm(p => ({ ...p, centroCusto: v }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEDE">SEDE</SelectItem>
                    <SelectItem value="CENTRAL">CENTRAL</SelectItem>
                    <SelectItem value="EVENTOS">EVENTOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" className="w-full text-xs h-8" disabled={!recForm.item || !recForm.valor} onClick={handleAddRecorrente}>
                Cadastrar Despesa
              </Button>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {recorrentes.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 border border-border/40 rounded-lg hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => setRecDrawerIdx(i)}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">{d.item}</p>
                    <p className="text-[10px] text-muted-foreground">{d.frequencia} • Próx: {d.prox} • {d.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {d.anexos.length > 0 && <Badge variant="secondary" className="text-[9px]"><Paperclip className="h-2.5 w-2.5 mr-0.5" />{d.anexos.length}</Badge>}
                  <span className="text-xs font-semibold">{d.valor}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recorrente Drawer */}
      <Sheet open={recDrawerIdx !== null} onOpenChange={open => { if (!open) setRecDrawerIdx(null); }}>
        <SheetContent className="w-[400px] sm:w-[460px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-base">Despesa Recorrente</SheetTitle></SheetHeader>
          {recDrawerIdx !== null && recorrentes[recDrawerIdx] && (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg bg-muted/30 p-4 space-y-1">
                <p className="text-sm font-semibold">{recorrentes[recDrawerIdx].item}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{recorrentes[recDrawerIdx].frequencia} • {recorrentes[recDrawerIdx].categoria}</span>
                  <span className="font-semibold text-foreground">{recorrentes[recDrawerIdx].valor}</span>
                </div>
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  <Badge variant="secondary" className="text-[9px]">{recorrentes[recDrawerIdx].centroCusto}</Badge>
                  <span>Próx: {recorrentes[recDrawerIdx].prox}</span>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Documentos</h4>
                <AnexoList anexos={recorrentes[recDrawerIdx].anexos} />
                <AnexoForm onAnexar={(tipo, nome) => {
                  const hoje = new Date().toLocaleDateString("pt-BR");
                  setRecorrentes(prev => prev.map((r, i) => i === recDrawerIdx ? { ...r, anexos: [...r.anexos, { tipo, nome, data: hoje }] } : r));
                  toast({ title: "📎 Documento anexado", description: nome });
                }} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ═══ LANÇAMENTOS DIRETOS ═══ */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-3.5 w-3.5" /> Lançamentos Diretos (Despesas Avulsas)
          </CardTitle>
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setShowLancSheet(true)}>
            <Plus className="h-3 w-3" /> Novo Lançamento
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Descrição</TableHead>
                <TableHead className="text-[11px] font-semibold">Beneficiário</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor</TableHead>
                <TableHead className="text-[11px] font-semibold">Vencimento</TableHead>
                <TableHead className="text-[11px] font-semibold">Categoria</TableHead>
                <TableHead className="text-[11px] font-semibold">Forma</TableHead>
                <TableHead className="text-[11px] font-semibold text-center">Docs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentos.map((l, i) => (
                <TableRow key={l.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setLancDrawerIdx(i)}>
                  <TableCell className="text-xs font-medium">{l.descricao}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.beneficiario}</TableCell>
                  <TableCell className="text-xs text-right font-semibold">{l.valor}</TableCell>
                  <TableCell className="text-xs">{l.vencimento}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[9px]">{l.categoria}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.formaPagamento}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      {l.anexos.length > 0 && <Badge variant="secondary" className="text-[9px] h-4 min-w-[16px] px-1">{l.anexos.length}</Badge>}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Lançamento Drawer (details) */}
      <Sheet open={lancDrawerIdx !== null} onOpenChange={open => { if (!open) setLancDrawerIdx(null); }}>
        <SheetContent className="w-[400px] sm:w-[460px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-base">Lançamento Direto</SheetTitle></SheetHeader>
          {lancDrawerIdx !== null && lancamentos[lancDrawerIdx] && (() => {
            const l = lancamentos[lancDrawerIdx];
            return (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                  <p className="text-sm font-semibold">{l.descricao}</p>
                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Beneficiário</span><span className="font-medium">{l.beneficiario}</span>
                    <span className="text-muted-foreground">Valor</span><span className="font-semibold">{l.valor}</span>
                    <span className="text-muted-foreground">Vencimento</span><span>{l.vencimento}</span>
                    <span className="text-muted-foreground">Centro de Custo</span><Badge variant="secondary" className="text-[9px] w-fit">{l.centroCusto}</Badge>
                    <span className="text-muted-foreground">Categoria</span><span>{l.categoria}</span>
                    <span className="text-muted-foreground">Pagamento</span><span>{l.formaPagamento}</span>
                    {l.pixDados && <><span className="text-muted-foreground">Pix/Dados</span><span className="truncate">{l.pixDados}</span></>}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Documentos</h4>
                  <AnexoList anexos={l.anexos} />
                  <AnexoForm onAnexar={(tipo, nome) => {
                    const hoje = new Date().toLocaleDateString("pt-BR");
                    setLancamentos(prev => prev.map((item, i) => i === lancDrawerIdx ? { ...item, anexos: [...item.anexos, { tipo, nome, data: hoje }] } : item));
                    toast({ title: "📎 Documento anexado", description: nome });
                  }} />
                </div>
                <Badge className="text-[10px] bg-muted text-muted-foreground border-0 gap-1">
                  <Building2 className="h-3 w-3" /> Origem: Controladoria (Direto)
                </Badge>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Novo Lançamento Sheet */}
      <Sheet open={showLancSheet} onOpenChange={setShowLancSheet}>
        <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-base">Novo Lançamento Direto</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-3">
            <Input className="h-9 text-xs" placeholder="Descrição (ex: Taxa Cartorial)" value={lancForm.descricao} onChange={e => setLancForm(p => ({ ...p, descricao: e.target.value }))} />
            <Input className="h-9 text-xs" placeholder="Beneficiário / Fornecedor" value={lancForm.beneficiario} onChange={e => setLancForm(p => ({ ...p, beneficiario: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input className="h-9 text-xs" placeholder="Valor (R$ 0,00)" value={lancForm.valor} onChange={e => setLancForm(p => ({ ...p, valor: e.target.value }))} />
              <Input className="h-9 text-xs" placeholder="Vencimento (dd/mm)" value={lancForm.vencimento} onChange={e => setLancForm(p => ({ ...p, vencimento: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={lancForm.centroCusto} onValueChange={v => setLancForm(p => ({ ...p, centroCusto: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Centro de Custo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEDE">SEDE</SelectItem>
                  <SelectItem value="CENTRAL">CENTRAL</SelectItem>
                  <SelectItem value="EVENTOS">EVENTOS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={lancForm.categoria} onValueChange={v => setLancForm(p => ({ ...p, categoria: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Taxas">Taxas</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Seguros">Seguros</SelectItem>
                  <SelectItem value="IPTU">IPTU</SelectItem>
                  <SelectItem value="Utilidades">Utilidades</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={lancForm.formaPagamento} onValueChange={v => setLancForm(p => ({ ...p, formaPagamento: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pix">Pix</SelectItem>
                  <SelectItem value="Boleto">Boleto</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
              <Input className="h-9 text-xs" placeholder="Chave Pix / Dados bancários" value={lancForm.pixDados} onChange={e => setLancForm(p => ({ ...p, pixDados: e.target.value }))} />
            </div>
            <Button className="w-full text-xs h-9 mt-2" disabled={!lancForm.descricao || !lancForm.valor || !lancForm.beneficiario} onClick={handleAddLancamento}>
              Cadastrar Lançamento
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Previsão de Caixa */}
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
  );
}
