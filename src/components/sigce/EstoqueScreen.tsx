import { useState } from "react";
import { Package, AlertTriangle, CheckCircle2, ShoppingCart, ArrowDown, ArrowUp, Plus, Search, Filter, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Item {
  id: number;
  nome: string;
  categoria: string;
  qtd: number;
  estoqueMinimo: number;
  pontoReposicao: number;
  unidade: string;
  local: string;
  status: "adequado" | "alerta" | "comprar";
}

interface Movimentacao {
  id: number;
  tipo: "entrada" | "saida";
  itemId: number;
  itemNome: string;
  qtd: number;
  data: string;
  responsavel: string;
  destino: string;
  nf: string;
}

const initialItens: Item[] = [
  { id: 1, nome: "Camisetas de Batismo", categoria: "Vestuário", qtd: 70, estoqueMinimo: 20, pontoReposicao: 40, unidade: "un", local: "SEDE — Almoxarifado A", status: "adequado" },
  { id: 2, nome: "Pilhas p/ Microfone (AA)", categoria: "Eletrônicos", qtd: 15, estoqueMinimo: 20, pontoReposicao: 48, unidade: "un", local: "SEDE — Sala Técnica", status: "comprar" },
  { id: 3, nome: "Copos Papel Biodegradável 60ml", categoria: "Descartáveis", qtd: 50, estoqueMinimo: 100, pontoReposicao: 500, unidade: "un", local: "SEDE — Copa", status: "alerta" },
  { id: 4, nome: "Livros Pastorais", categoria: "Materiais", qtd: 120, estoqueMinimo: 30, pontoReposicao: 50, unidade: "un", local: "SEDE — Secretaria", status: "adequado" },
  { id: 5, nome: "Líquido Haze 5L", categoria: "Consumíveis", qtd: 1, estoqueMinimo: 2, pontoReposicao: 4, unidade: "galão", local: "SEDE — Sala Técnica", status: "comprar" },
  { id: 6, nome: "Desinfetante 5L", categoria: "Limpeza", qtd: 8, estoqueMinimo: 3, pontoReposicao: 6, unidade: "un", local: "SEDE — Almoxarifado B", status: "adequado" },
  { id: 7, nome: "Café Melitta 500g", categoria: "Copa & Cozinha", qtd: 4, estoqueMinimo: 6, pontoReposicao: 12, unidade: "pct", local: "SEDE — Copa", status: "alerta" },
  { id: 8, nome: "Bíblias (Doação)", categoria: "Materiais", qtd: 200, estoqueMinimo: 50, pontoReposicao: 100, unidade: "un", local: "SEDE — Secretaria", status: "adequado" },
];

const initialMovs: Movimentacao[] = [
  { id: 1, tipo: "entrada", itemId: 1, itemNome: "Camisetas de Batismo", qtd: 70, data: "10/03/2025", responsavel: "Print Express", destino: "Almoxarifado A", nf: "NF-4521" },
  { id: 2, tipo: "saida", itemId: 1, itemNome: "Camisetas de Batismo", qtd: 12, data: "08/03/2025", responsavel: "Ministério Batismo", destino: "Culto Batismo", nf: "" },
  { id: 3, tipo: "entrada", itemId: 6, itemNome: "Desinfetante 5L", qtd: 12, data: "08/03/2025", responsavel: "Dousystem", destino: "Almoxarifado B", nf: "NF-3210" },
  { id: 4, tipo: "saida", itemId: 2, itemNome: "Pilhas p/ Microfone (AA)", qtd: 8, data: "07/03/2025", responsavel: "Sound Team", destino: "Culto Dominical", nf: "" },
  { id: 5, tipo: "entrada", itemId: 3, itemNome: "Copos Papel 60ml", qtd: 500, data: "01/03/2025", responsavel: "Dousystem", destino: "Copa", nf: "NF-3198" },
  { id: 6, tipo: "saida", itemId: 7, itemNome: "Café Melitta 500g", qtd: 2, data: "09/03/2025", responsavel: "Copa Central", destino: "Consumo semanal", nf: "" },
];

const categorias = ["Vestuário", "Eletrônicos", "Descartáveis", "Materiais", "Consumíveis", "Limpeza", "Copa & Cozinha"];
const locais = ["SEDE — Almoxarifado A", "SEDE — Almoxarifado B", "SEDE — Copa", "SEDE — Sala Técnica", "SEDE — Secretaria", "Instituto Pura Fé", "Central de Atendimento"];

const statusColor: Record<string, string> = {
  adequado: "bg-success/15 text-success",
  alerta: "bg-warning/15 text-warning",
  comprar: "bg-destructive/15 text-destructive",
};
const statusLabel: Record<string, string> = { adequado: "Adequado", alerta: "Alerta", comprar: "Comprar" };

function calcStatus(qtd: number, minimo: number, reposicao: number): "adequado" | "alerta" | "comprar" {
  if (qtd <= minimo) return "comprar";
  if (qtd <= reposicao) return "alerta";
  return "adequado";
}

export default function EstoqueScreen() {
  const [itens, setItens] = useState(initialItens);
  const [movs, setMovs] = useState(initialMovs);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [entradaOpen, setEntradaOpen] = useState(false);
  const [saidaOpen, setSaidaOpen] = useState(false);

  const [novoItem, setNovoItem] = useState({ nome: "", categoria: "", local: "", estoqueMinimo: "", pontoReposicao: "", unidade: "un" });
  const [entradaForm, setEntradaForm] = useState({ itemId: "", qtd: "", fornecedor: "", nf: "" });
  const [saidaForm, setSaidaForm] = useState({ itemId: "", qtd: "", destino: "", responsavel: "" });

  const filtered = itens.filter(i => {
    const matchBusca = !busca || i.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === "todas" || i.categoria === filtroCategoria;
    const matchStatus = filtroStatus === "todos" || i.status === filtroStatus;
    return matchBusca && matchCat && matchStatus;
  });

  const adequados = itens.filter(i => i.status === "adequado").length;
  const alertas = itens.filter(i => i.status === "alerta").length;
  const comprar = itens.filter(i => i.status === "comprar").length;

  const handleCadastrarItem = () => {
    if (!novoItem.nome || !novoItem.categoria || !novoItem.local) return;
    const novo: Item = {
      id: itens.length + 1,
      nome: novoItem.nome,
      categoria: novoItem.categoria,
      qtd: 0,
      estoqueMinimo: parseInt(novoItem.estoqueMinimo) || 0,
      pontoReposicao: parseInt(novoItem.pontoReposicao) || 0,
      unidade: novoItem.unidade,
      local: novoItem.local,
      status: "comprar",
    };
    setItens(prev => [...prev, novo]);
    setNovoItem({ nome: "", categoria: "", local: "", estoqueMinimo: "", pontoReposicao: "", unidade: "un" });
    setCadastroOpen(false);
    toast({ title: "✅ Item cadastrado", description: `${novo.nome} adicionado ao controle de estoque.` });
  };

  const handleRegistrarEntrada = () => {
    const itemId = parseInt(entradaForm.itemId);
    const qtd = parseInt(entradaForm.qtd);
    if (!itemId || !qtd) return;
    const item = itens.find(i => i.id === itemId);
    if (!item) return;

    const newQtd = item.qtd + qtd;
    setItens(prev => prev.map(i => i.id === itemId ? { ...i, qtd: newQtd, status: calcStatus(newQtd, i.estoqueMinimo, i.pontoReposicao) } : i));
    const mov: Movimentacao = {
      id: movs.length + 1, tipo: "entrada", itemId, itemNome: item.nome,
      qtd, data: new Date().toLocaleDateString("pt-BR"), responsavel: entradaForm.fornecedor,
      destino: item.local, nf: entradaForm.nf,
    };
    setMovs(prev => [mov, ...prev]);
    setEntradaForm({ itemId: "", qtd: "", fornecedor: "", nf: "" });
    setEntradaOpen(false);
    toast({ title: "📦 Entrada registrada", description: `+${qtd} ${item.unidade} de ${item.nome}. Estoque: ${newQtd}.` });
  };

  const handleRegistrarSaida = () => {
    const itemId = parseInt(saidaForm.itemId);
    const qtd = parseInt(saidaForm.qtd);
    if (!itemId || !qtd) return;
    const item = itens.find(i => i.id === itemId);
    if (!item || qtd > item.qtd) {
      toast({ title: "⚠ Erro", description: "Quantidade superior ao estoque disponível.", variant: "destructive" });
      return;
    }

    const newQtd = item.qtd - qtd;
    setItens(prev => prev.map(i => i.id === itemId ? { ...i, qtd: newQtd, status: calcStatus(newQtd, i.estoqueMinimo, i.pontoReposicao) } : i));
    const mov: Movimentacao = {
      id: movs.length + 1, tipo: "saida", itemId, itemNome: item.nome,
      qtd, data: new Date().toLocaleDateString("pt-BR"), responsavel: saidaForm.responsavel,
      destino: saidaForm.destino, nf: "",
    };
    setMovs(prev => [mov, ...prev]);
    setSaidaForm({ itemId: "", qtd: "", destino: "", responsavel: "" });
    setSaidaOpen(false);
    toast({ title: "📤 Saída registrada", description: `-${qtd} ${item.unidade} de ${item.nome}. Estoque: ${newQtd}.` });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">{movs.length}</p>
          <p className="text-[10px] text-muted-foreground">Movimentações</p>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <ClipboardCheck className="h-3.5 w-3.5" />
        <span>Último inventário: 01/03/2025</span>
        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => toast({ title: "📋 Inventário", description: "Contagem de inventário registrada para hoje." })}>
          Registrar Contagem
        </Button>
      </div>

      <Tabs defaultValue="itens" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="itens" className="text-xs">Itens ({itens.length})</TabsTrigger>
          <TabsTrigger value="movimentacoes" className="text-xs">Movimentações ({movs.length})</TabsTrigger>
          <TabsTrigger value="alertas" className="text-xs">Alertas ({alertas + comprar})</TabsTrigger>
        </TabsList>

        <TabsContent value="itens" className="space-y-3 mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Buscar item..." className="pl-9 h-8 text-xs" value={busca} onChange={e => setBusca(e.target.value)} />
            </div>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas" className="text-xs">Todas categorias</SelectItem>
                {categorias.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-xs">Todos</SelectItem>
                <SelectItem value="adequado" className="text-xs">Adequado</SelectItem>
                <SelectItem value="alerta" className="text-xs">Alerta</SelectItem>
                <SelectItem value="comprar" className="text-xs">Comprar</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" className="h-8 text-xs" onClick={() => setCadastroOpen(true)}>
                <Plus className="h-3 w-3 mr-1" /> Novo Item
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setEntradaOpen(true)}>
                <ArrowDown className="h-3 w-3 mr-1" /> Entrada
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSaidaOpen(true)}>
                <ArrowUp className="h-3 w-3 mr-1" /> Saída
              </Button>
            </div>
          </div>

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
                  {filtered.map(item => {
                    const pct = Math.min((item.qtd / item.pontoReposicao) * 100, 100);
                    const barColor = item.status === "adequado" ? "bg-success" : item.status === "alerta" ? "bg-warning" : "bg-destructive";
                    return (
                      <TableRow key={item.id} className={`hover:bg-muted/20 ${item.status === 'comprar' ? 'bg-destructive/5' : ''}`}>
                        <TableCell>
                          <p className="text-xs font-medium">{item.nome}</p>
                          <p className="text-[9px] text-muted-foreground">{item.unidade}</p>
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
        </TabsContent>

        <TabsContent value="movimentacoes" className="space-y-3 mt-3">
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-[11px] font-semibold">Tipo</TableHead>
                    <TableHead className="text-[11px] font-semibold">Item</TableHead>
                    <TableHead className="text-[11px] font-semibold text-center">Qtd</TableHead>
                    <TableHead className="text-[11px] font-semibold">Responsável / Fornecedor</TableHead>
                    <TableHead className="text-[11px] font-semibold">Destino / Local</TableHead>
                    <TableHead className="text-[11px] font-semibold">NF</TableHead>
                    <TableHead className="text-[11px] font-semibold">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movs.map(m => (
                    <TableRow key={m.id} className="hover:bg-muted/20">
                      <TableCell>
                        <Badge className={`text-[10px] border-0 ${m.tipo === 'entrada' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                          {m.tipo === 'entrada' ? '↓ Entrada' : '↑ Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{m.itemNome}</TableCell>
                      <TableCell className="text-center text-xs font-bold">{m.tipo === 'entrada' ? '+' : '-'}{m.qtd}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.responsavel}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.destino}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground font-mono">{m.nf || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-3 mt-3">
          <div className="space-y-2">
            {itens.filter(i => i.status !== "adequado").map(item => (
              <Card key={item.id} className={`border-0 shadow-sm ${item.status === 'comprar' ? 'ring-1 ring-destructive/20' : 'ring-1 ring-warning/20'}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.status === "comprar" ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                    <div>
                      <p className="text-xs font-semibold">{item.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{item.local} • Estoque: {item.qtd} {item.unidade} (Mínimo: {item.estoqueMinimo})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] border-0 ${statusColor[item.status]}`}>{statusLabel[item.status]}</Badge>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => {
                      toast({ title: "🛒 Solicitação criada", description: `Compra de ${item.nome} adicionada ao fluxo de solicitações.` });
                    }}>
                      <ShoppingCart className="h-3 w-3 mr-1" /> Solicitar Compra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cadastro Item Sheet */}
      <Sheet open={cadastroOpen} onOpenChange={setCadastroOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Novo Item de Estoque</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome do Item *</label>
              <Input className="h-9 text-xs" placeholder="Ex: Papel A4 500fls" value={novoItem.nome} onChange={e => setNovoItem(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Categoria *</label>
              <Select value={novoItem.categoria} onValueChange={v => setNovoItem(p => ({ ...p, categoria: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{categorias.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Local de Armazenamento *</label>
              <Select value={novoItem.local} onValueChange={v => setNovoItem(p => ({ ...p, local: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{locais.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Unidade de Medida</label>
              <Select value={novoItem.unidade} onValueChange={v => setNovoItem(p => ({ ...p, unidade: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["un", "pct", "cx", "galão", "kg", "litro", "metro"].map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Estoque Mínimo</label>
                <Input className="h-9 text-xs" type="number" placeholder="0" value={novoItem.estoqueMinimo} onChange={e => setNovoItem(p => ({ ...p, estoqueMinimo: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ponto de Reposição</label>
                <Input className="h-9 text-xs" type="number" placeholder="0" value={novoItem.pontoReposicao} onChange={e => setNovoItem(p => ({ ...p, pontoReposicao: e.target.value }))} />
              </div>
            </div>
            <Button className="w-full h-10 text-xs" onClick={handleCadastrarItem} disabled={!novoItem.nome || !novoItem.categoria || !novoItem.local}>
              Cadastrar Item
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Entrada Sheet */}
      <Sheet open={entradaOpen} onOpenChange={setEntradaOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Registrar Entrada</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Item *</label>
              <Select value={entradaForm.itemId} onValueChange={v => setEntradaForm(p => ({ ...p, itemId: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione o item" /></SelectTrigger>
                <SelectContent>{itens.map(i => <SelectItem key={i.id} value={String(i.id)} className="text-xs">{i.nome} (Estoque: {i.qtd})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quantidade *</label>
              <Input className="h-9 text-xs" type="number" placeholder="0" value={entradaForm.qtd} onChange={e => setEntradaForm(p => ({ ...p, qtd: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fornecedor</label>
              <Input className="h-9 text-xs" placeholder="Nome do fornecedor" value={entradaForm.fornecedor} onChange={e => setEntradaForm(p => ({ ...p, fornecedor: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nota Fiscal</label>
              <Input className="h-9 text-xs" placeholder="NF-0000" value={entradaForm.nf} onChange={e => setEntradaForm(p => ({ ...p, nf: e.target.value }))} />
            </div>
            <Button className="w-full h-10 text-xs bg-success hover:bg-success/90 text-success-foreground" onClick={handleRegistrarEntrada} disabled={!entradaForm.itemId || !entradaForm.qtd}>
              <ArrowDown className="h-3.5 w-3.5 mr-1.5" /> Registrar Entrada
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Saida Sheet */}
      <Sheet open={saidaOpen} onOpenChange={setSaidaOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle className="text-sm">Registrar Saída</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Item *</label>
              <Select value={saidaForm.itemId} onValueChange={v => setSaidaForm(p => ({ ...p, itemId: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione o item" /></SelectTrigger>
                <SelectContent>{itens.map(i => <SelectItem key={i.id} value={String(i.id)} className="text-xs">{i.nome} (Estoque: {i.qtd})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quantidade *</label>
              <Input className="h-9 text-xs" type="number" placeholder="0" value={saidaForm.qtd} onChange={e => setSaidaForm(p => ({ ...p, qtd: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Destino / Ministério</label>
              <Input className="h-9 text-xs" placeholder="Ex: Culto Dominical, Ministério Kids" value={saidaForm.destino} onChange={e => setSaidaForm(p => ({ ...p, destino: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Responsável</label>
              <Input className="h-9 text-xs" placeholder="Nome do responsável" value={saidaForm.responsavel} onChange={e => setSaidaForm(p => ({ ...p, responsavel: e.target.value }))} />
            </div>
            <Button className="w-full h-10 text-xs bg-warning hover:bg-warning/90 text-warning-foreground" onClick={handleRegistrarSaida} disabled={!saidaForm.itemId || !saidaForm.qtd}>
              <ArrowUp className="h-3.5 w-3.5 mr-1.5" /> Registrar Saída
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
