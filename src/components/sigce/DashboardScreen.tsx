import {
  ShoppingCart, CheckCircle2, TrendingUp, CreditCard, AlertTriangle,
  ArrowRight, Clock, Package, FileText, Bell, DollarSign, Truck, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  onNavigate: (screen: string) => void;
}

const kpis = [
  { label: "Comprado no Mês", value: "R$ 38.420", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  { label: "Saving Acumulado", value: "R$ 4.870", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
  { label: "Aprovações Pendentes", value: "5", icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  { label: "Contas a Pagar Hoje", value: "R$ 6.790", icon: CreditCard, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Pedidos Atrasados", value: "2", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Estoque Crítico", value: "3", icon: Package, color: "text-warning", bg: "bg-warning/10" },
];

const pipeline = [
  { etapa: "Nova Solicitação", qtd: 4, cor: "bg-muted-foreground" },
  { etapa: "Em Cotação", qtd: 3, cor: "bg-primary" },
  { etapa: "Aguard. Aprovação", qtd: 5, cor: "bg-warning" },
  { etapa: "Negociação Final", qtd: 2, cor: "bg-accent-foreground" },
  { etapa: "Aguard. Pagamento", qtd: 3, cor: "bg-destructive" },
  { etapa: "Em Trânsito", qtd: 2, cor: "bg-primary" },
  { etapa: "Entregue", qtd: 8, cor: "bg-success" },
];

const comprasPorMinisterio = [
  { nome: "Louvor", valor: 12400, pct: 32 },
  { nome: "Eventos", valor: 9800, pct: 25 },
  { nome: "Kids", valor: 6200, pct: 16 },
  { nome: "Central Atendimento", valor: 4800, pct: 12 },
  { nome: "Criativo", valor: 3200, pct: 8 },
  { nome: "Administrativo", valor: 2020, pct: 5 },
];

const aprovacoesPendentes = [
  { titulo: "Retiro Fazenda Pura Fé", area: "Eventos", valor: "R$ 6.000,00", saving: "R$ 250,00" },
  { titulo: "Kit Café — Central", area: "Central Atendimento", valor: "R$ 389,61", saving: "R$ 42,00" },
  { titulo: "Material de Limpeza SEDE", area: "Administrativo", valor: "R$ 780,00", saving: "R$ 95,00" },
  { titulo: "Pilhas Microfone AA", area: "Louvor", valor: "R$ 234,00", saving: "—" },
  { titulo: "Copos Biodegradáveis", area: "Central Atendimento", valor: "R$ 520,00", saving: "R$ 60,00" },
];

const atividades = [
  { text: "Caslu solicitou Líquido p/ Máquina de Haze", tempo: "Há 2h", cor: "bg-primary" },
  { text: "Rafael enviou 3 cotações para Kit Café", tempo: "Há 4h", cor: "bg-primary" },
  { text: "Bispa aprovou Retiro Fazenda Pura Fé", tempo: "Há 6h", cor: "bg-success" },
  { text: "Janete registrou saving de R$ 250,00", tempo: "Há 8h", cor: "bg-success" },
  { text: "Michele pagou TACC Iluminação via Pix", tempo: "Há 1 dia", cor: "bg-muted-foreground" },
  { text: "Cleiton registrou entrada de 70 camisetas", tempo: "Há 1 dia", cor: "bg-warning" },
  { text: "Mary confirmou recebimento — NF #4521", tempo: "Há 2 dias", cor: "bg-muted-foreground" },
];

const alertas = [
  { text: "Boleto Dousystem vence HOJE — R$ 2.112,00", tipo: "critico" },
  { text: "Pilhas p/ Microfone: estoque para compra imediata (15 un.)", tipo: "critico" },
  { text: "IPTU 2/10 vence amanhã — R$ 4.678,38", tipo: "alerta" },
  { text: "Copos Biodegradáveis em nível de alerta (50 un.)", tipo: "alerta" },
  { text: "2 pedidos com prazo de entrega expirado", tipo: "critico" },
];

const transitoResumo = [
  { pedido: "Camisetas Batismo — Print Express", prev: "Hoje", status: "Em rota" },
  { pedido: "Líquido Haze — TACC", prev: "Amanhã", status: "Despachado" },
];

export default function DashboardScreen({ onNavigate }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <Card key={k.label} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`h-4 w-4 ${k.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold tracking-tight">{k.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline + Compras por Ministério */}
      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pipeline Operacional</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2">
              {pipeline.map(p => (
                <div key={p.etapa} className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground w-32 truncate">{p.etapa}</span>
                  <div className="flex-1 h-5 bg-muted rounded-md overflow-hidden">
                    <div className={`h-full ${p.cor} rounded-md flex items-center justify-end pr-2 transition-all`} style={{ width: `${Math.max(p.qtd * 8, 15)}%` }}>
                      <span className="text-[10px] font-bold text-white">{p.qtd}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" /> Compras por Ministério
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-2.5">
              {comprasPorMinisterio.map(m => (
                <div key={m.nome}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{m.nome}</span>
                    <span className="font-semibold">R$ {m.valor.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saving + Aprovações Pendentes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-success/5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate("controladoria")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Economia Gerada — Março 2025</p>
                <p className="text-3xl font-bold text-success">R$ 4.870,00</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">12 negociações concluídas • Média de 6.2% de saving</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate("aprovacao")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Compras Aguardando Aprovação</p>
                <p className="text-2xl font-bold">{aprovacoesPendentes.length}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {aprovacoesPendentes.slice(0, 3).map((a, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground truncate mr-2">{a.titulo}</span>
                  <span className="font-semibold whitespace-nowrap">{a.valor}</span>
                </div>
              ))}
              {aprovacoesPendentes.length > 3 && (
                <p className="text-[10px] text-primary font-medium">+{aprovacoesPendentes.length - 3} mais →</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Em Trânsito */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Truck className="h-3.5 w-3.5" /> Pedidos em Trânsito
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {transitoResumo.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{t.pedido}</p>
                  <p className="text-[10px] text-muted-foreground">Previsão: {t.prev}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{t.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividades + Alertas */}
      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="space-y-0">
              {atividades.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
                  <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${a.cor}`} />
                  <span className="text-xs flex-1">{a.text}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{a.tempo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-3.5 w-3.5" /> Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="space-y-2">
              {alertas.map((a, i) => (
                <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${a.tipo === 'critico' ? 'bg-destructive/5' : 'bg-warning/5'}`}>
                  <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${a.tipo === 'critico' ? 'text-destructive' : 'text-warning'}`} />
                  <span className="text-[11px] leading-relaxed">{a.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
