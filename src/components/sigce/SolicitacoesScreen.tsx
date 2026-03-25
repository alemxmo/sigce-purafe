import { useState } from "react";
import { Search, Plus, Eye, Clock, AlertCircle, Filter, ChevronRight, User, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  onNavigate: (screen: string) => void;
}

interface Solicitacao {
  id: number;
  solicitante: string;
  telefone: string;
  area: string;
  centroCusto: string;
  item: string;
  categoria: string;
  qtd: number;
  dataLimite: string;
  urgencia: "normal" | "alta" | "critica";
  justificativa: string;
  status: "nova" | "em_cotacao" | "aguardando_aprovacao" | "devolvida" | "aprovada";
  responsavel: string;
  criadoEm: string;
  timeline: { data: string; acao: string; por: string }[];
}

const solicitacoes: Solicitacao[] = [
  {
    id: 1, solicitante: "Caslu", telefone: "(11) 99999-1234", area: "Iluminação", centroCusto: "LOUVOR",
    item: "Líquido p/ Máquina de Haze (Galão 05L)", categoria: "Consumíveis", qtd: 2,
    dataLimite: "Próximo domingo", urgencia: "critica", justificativa: "Sem líquido, haze não funciona no culto.",
    status: "nova", responsavel: "Rafael", criadoEm: "Há 2h",
    timeline: [{ data: "10/03 09:15", acao: "Solicitação criada", por: "Caslu" }],
  },
  {
    id: 2, solicitante: "Pr. Rafael Diniz", telefone: "(11) 98888-5678", area: "Central de Atendimento", centroCusto: "CENTRAL",
    item: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)", categoria: "Copa & Cozinha", qtd: 1,
    dataLimite: "15/03", urgencia: "alta", justificativa: "Estoque de café acabou, atendemos 200+ pessoas/semana.",
    status: "em_cotacao", responsavel: "Rafael", criadoEm: "Há 1 dia",
    timeline: [
      { data: "09/03 14:30", acao: "Solicitação criada", por: "Pr. Rafael Diniz" },
      { data: "09/03 16:00", acao: "Aceita por Rafael", por: "Rafael" },
      { data: "10/03 08:00", acao: "3 cotações solicitadas", por: "Rafael" },
    ],
  },
  {
    id: 3, solicitante: "Michele", telefone: "(11) 97777-9012", area: "Administrativo", centroCusto: "SEDE",
    item: "Material de Limpeza (Desinfetante, Detergente, Pano, Luvas)", categoria: "Limpeza", qtd: 1,
    dataLimite: "12/03", urgencia: "normal", justificativa: "Reposição mensal regular.",
    status: "aguardando_aprovacao", responsavel: "Rafael", criadoEm: "Há 3 dias",
    timeline: [
      { data: "07/03 10:00", acao: "Solicitação criada", por: "Michele" },
      { data: "07/03 15:00", acao: "Cotações recebidas (3)", por: "Rafael" },
      { data: "08/03 09:00", acao: "Melhor cotação: Dousystem R$ 780,00", por: "Rafael" },
      { data: "08/03 09:30", acao: "Enviada para aprovação", por: "Rafael" },
    ],
  },
  {
    id: 4, solicitante: "Marcos (Kids)", telefone: "(11) 96666-3456", area: "Kids", centroCusto: "KIDS",
    item: "Kit Lanche Infantil (Suco, Biscoito, Guardanapo)", categoria: "Alimentação", qtd: 100,
    dataLimite: "Sábado", urgencia: "alta", justificativa: "Evento Kids especial com 100 crianças.",
    status: "nova", responsavel: "—", criadoEm: "Há 30min",
    timeline: [{ data: "10/03 11:45", acao: "Solicitação criada", por: "Marcos (Kids)" }],
  },
  {
    id: 5, solicitante: "Dani Criativo", telefone: "(11) 95555-7890", area: "Criativo", centroCusto: "CRIATIVO",
    item: "Banner Lona 3x2m — Campanha Páscoa", categoria: "Comunicação Visual", qtd: 2,
    dataLimite: "20/03", urgencia: "normal", justificativa: "Campanha de Páscoa inicia dia 25/03.",
    status: "em_cotacao", responsavel: "Rafael", criadoEm: "Há 2 dias",
    timeline: [
      { data: "08/03 14:00", acao: "Solicitação criada", por: "Dani Criativo" },
      { data: "08/03 17:00", acao: "Aceita por Rafael", por: "Rafael" },
      { data: "09/03 10:00", acao: "Cotação solicitada a 2 fornecedores", por: "Rafael" },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  nova: { label: "Nova", color: "bg-primary/15 text-primary" },
  em_cotacao: { label: "Em Cotação", color: "bg-warning/15 text-warning" },
  aguardando_aprovacao: { label: "Aguard. Aprovação", color: "bg-success/15 text-success" },
  devolvida: { label: "Devolvida", color: "bg-destructive/15 text-destructive" },
  aprovada: { label: "Aprovada", color: "bg-success/15 text-success" },
};

const urgenciaConfig: Record<string, { label: string; color: string }> = {
  normal: { label: "Normal", color: "bg-muted text-muted-foreground" },
  alta: { label: "Alta", color: "bg-warning/15 text-warning" },
  critica: { label: "Crítica", color: "bg-destructive/15 text-destructive" },
};

export default function SolicitacoesScreen({ onNavigate }: Props) {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCc, setFiltroCc] = useState("todos");
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<Solicitacao | null>(null);

  const filtered = solicitacoes.filter(s => {
    if (filtroStatus !== "todos" && s.status !== filtroStatus) return false;
    if (filtroCc !== "todos" && s.centroCusto !== filtroCc) return false;
    if (busca && !s.item.toLowerCase().includes(busca.toLowerCase()) && !s.solicitante.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const countByStatus = (st: string) => solicitacoes.filter(s => s.status === st).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Novas", count: countByStatus("nova"), color: "text-primary" },
          { label: "Em Cotação", count: countByStatus("em_cotacao"), color: "text-warning" },
          { label: "Aguard. Aprovação", count: countByStatus("aguardando_aprovacao"), color: "text-success" },
          { label: "Total Abertas", count: solicitacoes.length, color: "text-foreground" },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por item ou solicitante..." className="pl-9 h-9 text-sm" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="nova">Novas</SelectItem>
            <SelectItem value="em_cotacao">Em Cotação</SelectItem>
            <SelectItem value="aguardando_aprovacao">Aguard. Aprovação</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCc} onValueChange={setFiltroCc}>
          <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Centro Custo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="SEDE">SEDE</SelectItem>
            <SelectItem value="CENTRAL">CENTRAL</SelectItem>
            <SelectItem value="LOUVOR">LOUVOR</SelectItem>
            <SelectItem value="KIDS">KIDS</SelectItem>
            <SelectItem value="CRIATIVO">CRIATIVO</SelectItem>
            <SelectItem value="EVENTOS">EVENTOS</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="h-9 text-xs" onClick={() => onNavigate("nova_solicitacao")}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Nova
        </Button>
      </div>

      {/* Table-like cards */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Solicitante</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Centro</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prazo</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Urgência</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const st = statusConfig[s.status];
                const urg = urgenciaConfig[s.urgencia];
                return (
                  <tr key={s.id} className="border-b border-border/40 hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => setSelected(s)}>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">#{String(s.id).padStart(3, '0')}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs truncate max-w-[250px]">{s.item}</p>
                      <p className="text-[10px] text-muted-foreground">{s.categoria} • Qtd: {s.qtd}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">{s.solicitante}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{s.centroCusto}</Badge></td>
                    <td className="px-4 py-3 text-xs">{s.dataLimite}</td>
                    <td className="px-4 py-3"><Badge className={`text-[10px] border-0 ${urg.color}`}>{urg.label}</Badge></td>
                    <td className="px-4 py-3"><Badge className={`text-[10px] border-0 ${st.color}`}>{st.label}</Badge></td>
                    <td className="px-4 py-3"><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base">Solicitação #{String(selected.id).padStart(3, '0')}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="font-semibold text-sm">{selected.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">Quantidade: {selected.qtd} • {selected.categoria}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground">Solicitante</p>
                    <p className="text-xs font-medium mt-0.5">{selected.solicitante}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground">Área / Centro</p>
                    <p className="text-xs font-medium mt-0.5">{selected.area} • {selected.centroCusto}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground">Prazo</p>
                    <p className="text-xs font-medium mt-0.5">{selected.dataLimite}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <p className="text-[10px] text-muted-foreground">Urgência</p>
                    <Badge className={`text-[10px] border-0 mt-0.5 ${urgenciaConfig[selected.urgencia].color}`}>{urgenciaConfig[selected.urgencia].label}</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-[10px] text-muted-foreground">Justificativa</p>
                  <p className="text-xs mt-1">{selected.justificativa}</p>
                </div>
                {/* Timeline */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico</p>
                  <div className="space-y-3">
                    {selected.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                          {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-xs font-medium">{t.acao}</p>
                          <p className="text-[10px] text-muted-foreground">{t.data} • {t.por}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={`text-[10px] border-0 ${statusConfig[selected.status].color}`}>{statusConfig[selected.status].label}</Badge>
                  <Badge variant="secondary" className="text-[10px]">Responsável: {selected.responsavel}</Badge>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
