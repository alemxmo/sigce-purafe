import { useState } from "react";
import {
  CreditCard, Plus, Search, Calendar, Filter, Receipt,
  Paperclip, CheckCircle2, AlertCircle, DollarSign
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

interface DespesaRapida {
  id: number;
  data: string;
  produto: string;
  valor: string;
  motivo: string;
  formaPagamento: "cartao_credito" | "pix" | "dinheiro" | "outro";
  autorizadoPor: string;
  compradoPor: string;
  centroCusto: string;
  comprovante: boolean;
  comprovanteNome?: string;
}

const formasPagamento = [
  { value: "cartao_credito", label: "Cartão de Crédito" },
  { value: "pix", label: "Pix" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "outro", label: "Outro" },
];

const autorizadores = ["Bispa Vanessa", "Bispo Bruno", "Pr. Rafael Diniz", "Rafael Cardoso"];
const compradores = ["Rafael Cardoso", "Cleiton Ramos", "Pr. Rafael Diniz", "Henriqueta Barra"];
const centrosCusto = ["Sede", "Instituto Pura Fé", "Central de Atendimento"];

const formaLabel: Record<string, string> = {
  cartao_credito: "Cartão de Crédito",
  pix: "Pix",
  dinheiro: "Dinheiro",
  outro: "Outro",
};

const initialDespesas: DespesaRapida[] = [
  { id: 1, data: "01/08/2025", produto: "Combustível — Abastecimento HB20", valor: "R$ 250,00", motivo: "Visitas pastorais", formaPagamento: "cartao_credito", autorizadoPor: "Bispa Vanessa", compradoPor: "Cleiton Ramos", centroCusto: "Sede", comprovante: true, comprovanteNome: "Cupom_Posto_01ago.jpg" },
  { id: 2, data: "03/08/2025", produto: "Estacionamento — Shopping Aricanduva", valor: "R$ 18,00", motivo: "Compra de materiais", formaPagamento: "cartao_credito", autorizadoPor: "Rafael Cardoso", compradoPor: "Rafael Cardoso", centroCusto: "Sede", comprovante: true, comprovanteNome: "Ticket_Estacion_03ago.jpg" },
  { id: 3, data: "05/08/2025", produto: "Papelaria — Kalunga (Tonner, Papel A4)", valor: "R$ 389,90", motivo: "Reposição escritório", formaPagamento: "cartao_credito", autorizadoPor: "Bispa Vanessa", compradoPor: "Rafael Cardoso", centroCusto: "Sede", comprovante: true, comprovanteNome: "NF_Kalunga_05ago.pdf" },
  { id: 4, data: "05/08/2025", produto: "Combustível — Abastecimento Spin", valor: "R$ 310,00", motivo: "Logística de eventos", formaPagamento: "cartao_credito", autorizadoPor: "Bispa Vanessa", compradoPor: "Cleiton Ramos", centroCusto: "Sede", comprovante: false },
  { id: 5, data: "08/08/2025", produto: "Lanche — Equipe de obra", valor: "R$ 85,00", motivo: "Alimentação obra estacionamento", formaPagamento: "dinheiro", autorizadoPor: "Pr. Rafael Diniz", compradoPor: "Rafael Cardoso", centroCusto: "Sede", comprovante: true, comprovanteNome: "Cupom_Lanche_08ago.jpg" },
  { id: 6, data: "10/08/2025", produto: "Uber — Transporte equipamentos", valor: "R$ 42,50", motivo: "Transporte urgente de som", formaPagamento: "cartao_credito", autorizadoPor: "Rafael Cardoso", compradoPor: "Rafael Cardoso", centroCusto: "Central de Atendimento", comprovante: true, comprovanteNome: "Recibo_Uber_10ago.png" },
  { id: 7, data: "12/08/2025", produto: "Material Elétrico — Leroy Merlin", valor: "R$ 276,40", motivo: "Manutenção elétrica templo", formaPagamento: "cartao_credito", autorizadoPor: "Bispa Vanessa", compradoPor: "Rafael Cardoso", centroCusto: "Sede", comprovante: true, comprovanteNome: "NF_Leroy_12ago.pdf" },
  { id: 8, data: "15/08/2025", produto: "Combustível — Abastecimento HB20", valor: "R$ 230,00", motivo: "Visitas pastorais", formaPagamento: "cartao_credito", autorizadoPor: "Bispa Vanessa", compradoPor: "Cleiton Ramos", centroCusto: "Sede", comprovante: false },
];

export default function RegistroRapidoScreen() {
  const [despesas, setDespesas] = useState<DespesaRapida[]>(initialDespesas);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filtroMes, setFiltroMes] = useState("08/2025");
  const [filtroForma, setFiltroForma] = useState("todos");
  const [filtroComprador, setFiltroComprador] = useState("todos");
  const [busca, setBusca] = useState("");

  // Form state
  const [form, setForm] = useState({
    produto: "",
    valor: "",
    motivo: "",
    formaPagamento: "cartao_credito",
    autorizadoPor: "",
    compradoPor: "",
    centroCusto: "",
    data: new Date().toLocaleDateString("pt-BR"),
    comprovanteNome: "",
  });

  const filtered = despesas.filter(d => {
    if (filtroForma !== "todos" && d.formaPagamento !== filtroForma) return false;
    if (filtroComprador !== "todos" && d.compradoPor !== filtroComprador) return false;
    if (busca && !d.produto.toLowerCase().includes(busca.toLowerCase()) && !d.motivo.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, DespesaRapida[]>>((acc, d) => {
    if (!acc[d.data]) acc[d.data] = [];
    acc[d.data].push(d);
    return acc;
  }, {});

  const totalGeral = filtered.reduce((s, d) => s + parseFloat(d.valor.replace(/[R$\s.]/g, "").replace(",", ".")), 0);
  const totalCartao = filtered.filter(d => d.formaPagamento === "cartao_credito").reduce((s, d) => s + parseFloat(d.valor.replace(/[R$\s.]/g, "").replace(",", ".")), 0);
  const totalPix = filtered.filter(d => d.formaPagamento === "pix").reduce((s, d) => s + parseFloat(d.valor.replace(/[R$\s.]/g, "").replace(",", ".")), 0);
  const totalDinheiro = filtered.filter(d => d.formaPagamento === "dinheiro").reduce((s, d) => s + parseFloat(d.valor.replace(/[R$\s.]/g, "").replace(",", ".")), 0);
  const pendentes = filtered.filter(d => !d.comprovante).length;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleSalvar = () => {
    if (!form.produto || !form.valor || !form.compradoPor) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    const nova: DespesaRapida = {
      id: Date.now(),
      data: form.data,
      produto: form.produto,
      valor: form.valor.startsWith("R$") ? form.valor : `R$ ${form.valor}`,
      motivo: form.motivo,
      formaPagamento: form.formaPagamento as DespesaRapida["formaPagamento"],
      autorizadoPor: form.autorizadoPor,
      compradoPor: form.compradoPor,
      centroCusto: form.centroCusto,
      comprovante: !!form.comprovanteNome,
      comprovanteNome: form.comprovanteNome || undefined,
    };
    setDespesas(prev => [nova, ...prev]);
    setForm({ produto: "", valor: "", motivo: "", formaPagamento: "cartao_credito", autorizadoPor: "", compradoPor: "", centroCusto: "", data: new Date().toLocaleDateString("pt-BR"), comprovanteNome: "" });
    setSheetOpen(false);
    toast({ title: "✅ Despesa registrada no extrato", description: `${nova.produto} • ${nova.valor}` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-foreground">{fmt(totalGeral)}</p>
          <p className="text-[10px] text-muted-foreground">Total do Mês</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-purple-500" />
            <p className="text-xl font-bold text-purple-600">{fmt(totalCartao)}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Cartão de Crédito</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-primary">{fmt(totalPix)}</p>
          <p className="text-[10px] text-muted-foreground">Pix</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-xl font-bold text-success">{fmt(totalDinheiro)}</p>
          <p className="text-[10px] text-muted-foreground">Dinheiro</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <div className="flex items-center gap-1.5">
            {pendentes > 0 ? <AlertCircle className="h-4 w-4 text-warning" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
            <p className={`text-xl font-bold ${pendentes > 0 ? 'text-warning' : 'text-success'}`}>{pendentes}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Sem Comprovante</p>
        </CardContent></Card>
      </div>

      {/* Actions + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={filtroMes} onValueChange={setFiltroMes}>
            <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="08/2025">Agosto 2025</SelectItem>
              <SelectItem value="07/2025">Julho 2025</SelectItem>
              <SelectItem value="03/2026">Março 2026</SelectItem>
              <SelectItem value="04/2026">Abril 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroForma} onValueChange={setFiltroForma}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Forma Pagamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Formas</SelectItem>
              <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
              <SelectItem value="pix">Pix</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroComprador} onValueChange={setFiltroComprador}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Comprado por" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {compradores.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="pl-8 h-9 w-[180px] text-xs" placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
        </div>
        <Button size="sm" className="h-9 text-xs gap-1.5" onClick={() => setSheetOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Registrar Despesa
        </Button>
      </div>

      {/* Extrato Table grouped by date */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Data</TableHead>
                <TableHead className="text-[11px] font-semibold">Produto / Serviço</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Valor</TableHead>
                <TableHead className="text-[11px] font-semibold">Motivo</TableHead>
                <TableHead className="text-[11px] font-semibold">Forma</TableHead>
                <TableHead className="text-[11px] font-semibold">Autorizado por</TableHead>
                <TableHead className="text-[11px] font-semibold">Comprado por</TableHead>
                <TableHead className="text-[11px] font-semibold">Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(grouped).sort(([a], [b]) => {
                const [da, ma, ya] = a.split("/").map(Number);
                const [db, mb, yb] = b.split("/").map(Number);
                return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
              }).map(([data, items]) => (
                items.map((d, i) => (
                  <TableRow key={d.id} className={i === 0 && items.length > 1 ? "border-t-2 border-border/30" : ""}>
                    <TableCell className="text-xs font-medium text-muted-foreground">{i === 0 ? data : ""}</TableCell>
                    <TableCell>
                      <p className="text-xs font-medium">{d.produto}</p>
                      <p className="text-[10px] text-muted-foreground">{d.centroCusto}</p>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-right">{d.valor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{d.motivo}</TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] border-0 ${
                        d.formaPagamento === "cartao_credito" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                        d.formaPagamento === "pix" ? "bg-primary/15 text-primary" :
                        "bg-success/15 text-success"
                      }`}>
                        {formaLabel[d.formaPagamento]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{d.autorizadoPor}</TableCell>
                    <TableCell className="text-xs">{d.compradoPor}</TableCell>
                    <TableCell>
                      {d.comprovante ? (
                        <Badge className="text-[9px] border-0 bg-success/15 text-success gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Anexado
                        </Badge>
                      ) : (
                        <Badge className="text-[9px] border-0 bg-warning/15 text-warning gap-1">
                          <AlertCircle className="h-2.5 w-2.5" /> Pendente
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer totals */}
        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="font-semibold">Total: <span className="text-foreground">{fmt(totalGeral)}</span></span>
            <span className="text-purple-600">Cartão: {fmt(totalCartao)}</span>
            <span className="text-primary">Pix: {fmt(totalPix)}</span>
            <span className="text-success">Dinheiro: {fmt(totalDinheiro)}</span>
            <span className="text-muted-foreground">{filtered.length} lançamentos</span>
          </div>
        </div>
      </Card>

      {/* Sheet — Novo Registro */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Registrar Despesa Rápida
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Registre despesas já realizadas (cartão de crédito, compras diretas, abastecimento). O lançamento vai direto para o extrato detalhado.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Produto / Serviço *</label>
                <Input className="h-9 text-xs mt-1" placeholder="Ex: Combustível, Material de limpeza..." value={form.produto} onChange={e => setForm(p => ({ ...p, produto: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Valor (R$) *</label>
                  <Input className="h-9 text-xs mt-1" placeholder="R$ 0,00" value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium">Data da compra</label>
                  <Input className="h-9 text-xs mt-1" placeholder="dd/mm/aaaa" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Motivo / Descrição</label>
                <Textarea className="text-xs mt-1 min-h-[60px]" placeholder="Para que foi a compra..." value={form.motivo} onChange={e => setForm(p => ({ ...p, motivo: e.target.value }))} />
              </div>

              <div>
                <label className="text-xs font-medium">Forma de Pagamento *</label>
                <Select value={form.formaPagamento} onValueChange={v => setForm(p => ({ ...p, formaPagamento: v }))}>
                  <SelectTrigger className="h-9 text-xs mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium">Autorizado por</label>
                <Select value={form.autorizadoPor} onValueChange={v => setForm(p => ({ ...p, autorizadoPor: v }))}>
                  <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Quem autorizou?" /></SelectTrigger>
                  <SelectContent>
                    {autorizadores.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium">Comprado por *</label>
                <Select value={form.compradoPor} onValueChange={v => setForm(p => ({ ...p, compradoPor: v }))}>
                  <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Quem comprou?" /></SelectTrigger>
                  <SelectContent>
                    {compradores.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium">Centro de Custo</label>
                <Select value={form.centroCusto} onValueChange={v => setForm(p => ({ ...p, centroCusto: v }))}>
                  <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                  <SelectContent>
                    {centrosCusto.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium">Comprovante (nome do arquivo)</label>
                <Input className="h-9 text-xs mt-1" placeholder="Ex: Cupom_Posto_15abr.jpg" value={form.comprovanteNome} onChange={e => setForm(p => ({ ...p, comprovanteNome: e.target.value }))} />
                <p className="text-[9px] text-muted-foreground mt-1">Simule o anexo informando o nome do arquivo.</p>
              </div>
            </div>

            <Button className="w-full h-10 text-xs gap-1.5" onClick={handleSalvar}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Salvar no Extrato
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
