import {
  ShoppingCart, CheckCircle2, TrendingUp, CreditCard, AlertTriangle,
  ArrowRight, Clock, Package, FileText, Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const kpis = [
  { label: "Solicitações Abertas", value: "12", icon: ShoppingCart, color: "text-primary" },
  { label: "Aprovações Pendentes", value: "3", icon: Clock, color: "text-warning" },
  { label: "Saving Acumulado", value: "R$ 4.870", icon: TrendingUp, color: "text-success" },
  { label: "Contas a Pagar Hoje", value: "R$ 6.790", icon: CreditCard, color: "text-destructive" },
  { label: "Itens Estoque Baixo", value: "2", icon: AlertTriangle, color: "text-warning" },
];

const fluxoEtapas = [
  "Nova Solicitação", "Em Cotação", "Aguardando Aprovação",
  "Negociação Final", "Aguardando Pagamento", "Em Trânsito", "Entregue"
];

const atividades = [
  { text: "Caslu solicitou Líquido p/ Máquina de Haze", tempo: "Há 2h", tipo: "solicitacao" },
  { text: "Pr. Rafael enviou cotação do Kit Café", tempo: "Há 4h", tipo: "cotacao" },
  { text: "Bispa aprovou Retiro Fazenda Pura Fé", tempo: "Há 1 dia", tipo: "aprovacao" },
  { text: "Michele pagou TACC Iluminação via Pix", tempo: "Há 1 dia", tipo: "pagamento" },
  { text: "Cleiton registrou entrada de 70 camisetas", tempo: "Há 2 dias", tipo: "estoque" },
];

const alertas = [
  { text: "Boleto Dousystem vence HOJE — R$ 2.112,00", tipo: "critico" },
  { text: "Pilhas p/ Microfone com estoque para compra imediata", tipo: "alerta" },
  { text: "IPTU 2/10 vence amanhã — R$ 4.678,38", tipo: "atencao" },
];

export default function PainelScreen() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saving Destaque + Aguardando Aprovação */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Economia Gerada em Março</p>
                <p className="text-3xl font-bold text-success">R$ 4.870,00</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Saving acumulado por negociações de Rafael e Janete</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-l-4 border-l-warning">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Compras Aguardando Aprovação</p>
                <p className="text-3xl font-bold">3</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Retiro Fazenda Pura Fé</span>
                <span className="font-semibold">R$ 6.000,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Kit Café — Central</span>
                <span className="font-semibold">R$ 389,61</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Material de Limpeza</span>
                <span className="font-semibold">R$ 780,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fluxo Operacional */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fluxo Operacional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {fluxoEtapas.map((etapa, i) => (
              <div key={etapa} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i <= 2 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {etapa}
                </div>
                {i < fluxoEtapas.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground hidden sm:block" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividades + Alertas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4" /> Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividades.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      a.tipo === 'aprovacao' ? 'bg-success' :
                      a.tipo === 'pagamento' ? 'bg-primary' :
                      a.tipo === 'estoque' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <span className="text-sm">{a.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.tempo}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-4 w-4" /> Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertas.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                    a.tipo === 'critico' ? 'text-destructive' :
                    a.tipo === 'alerta' ? 'text-destructive' : 'text-warning'
                  }`} />
                  <span className="text-xs leading-relaxed">{a.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
