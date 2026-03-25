import { useState } from "react";
import { CheckCircle2, XCircle, MessageSquare, TrendingDown, ShieldCheck, User, Building2, Calendar, Paperclip, AlertCircle, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Aprovacao {
  id: number;
  titulo: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  justificativa: string;
  fornecedor: string;
  valorOriginal: string;
  valorNegociado: string;
  saving: string;
  prazo: string;
  urgencia: string;
  negociadoPor: string;
  aprovado: boolean;
  timeline: string[];
}

const pendentes: Aprovacao[] = [
  {
    id: 1, titulo: "Retiro Fazenda Pura Fé", solicitante: "Pr. Rafael Diniz", area: "Eventos",
    centroCusto: "EVENTOS", justificativa: "Retiro anual de liderança, 80 participantes. Local já reservado.",
    fornecedor: "Fazenda Pura Fé Eventos", valorOriginal: "R$ 6.250,00", valorNegociado: "R$ 6.000,00",
    saving: "R$ 250,00", prazo: "Pagamento até 15/03", urgencia: "Alta",
    negociadoPor: "Janete", aprovado: false,
    timeline: ["Solicitação criada por Pr. Rafael", "3 cotações recebidas", "Fornecedor selecionado: Fazenda Pura Fé", "Negociação final por Janete — saving R$ 250"],
  },
  {
    id: 2, titulo: "Kit Café — Central de Atendimento", solicitante: "Pr. Rafael Diniz", area: "Central de Atendimento",
    centroCusto: "CENTRAL", justificativa: "Reposição de estoque de café e descartáveis. Atendemos 200+ pessoas/semana.",
    fornecedor: "Casa do Café", valorOriginal: "R$ 415,00", valorNegociado: "R$ 389,61",
    saving: "R$ 25,39", prazo: "Entrega em 2 dias", urgencia: "Alta",
    negociadoPor: "Rafael", aprovado: false,
    timeline: ["Solicitação criada", "3 cotações comparadas", "Melhor preço: Casa do Café", "Enviado para aprovação"],
  },
  {
    id: 3, titulo: "Material de Limpeza SEDE", solicitante: "Michele", area: "Administrativo",
    centroCusto: "SEDE", justificativa: "Reposição mensal regular de materiais de limpeza.",
    fornecedor: "Dousystem", valorOriginal: "R$ 850,00", valorNegociado: "R$ 780,00",
    saving: "R$ 70,00", prazo: "Entrega em 3 dias", urgencia: "Normal",
    negociadoPor: "Janete", aprovado: false,
    timeline: ["Solicitação mensal automática", "Cotação com fornecedor preferencial", "Saving negociado: R$ 70"],
  },
];

export default function AprovacaoScreen() {
  const [items, setItems] = useState(pendentes);

  const handleAprovar = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, aprovado: true } : i));
    const item = items.find(i => i.id === id);
    toast({ title: "✅ Compra Aprovada", description: `${item?.titulo} — ${item?.valorNegociado} encaminhado para pagamento.` });
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Decisões rápidas para manter o fluxo operacional ágil.</p>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Smartphone className="h-3.5 w-3.5" />
          <span>Em breve: aprovação via WhatsApp</span>
        </div>
      </div>

      {items.map(item => (
        <Card key={item.id} className={`border-0 shadow-lg overflow-hidden ${item.aprovado ? 'ring-2 ring-success/30' : ''}`}>
          <div className={`h-1 w-full ${item.aprovado ? 'bg-success' : 'bg-warning'}`} />
          <CardContent className="p-5 md:p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold">{item.titulo}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{item.solicitante} • {item.area} • {item.centroCusto}</p>
              </div>
              <Badge className={item.aprovado ? "bg-success text-success-foreground border-0" : "bg-warning/15 text-warning border-0"}>
                {item.aprovado ? "Aprovado" : "Pendente"}
              </Badge>
            </div>

            {/* Justificativa */}
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Justificativa</p>
              <p className="text-xs">{item.justificativa}</p>
            </div>

            {/* Valores */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Valor Original</p>
                <p className="text-base font-semibold line-through decoration-muted-foreground/40">{item.valorOriginal}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Valor Negociado</p>
                <p className="text-base font-bold">{item.valorNegociado}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Saving</p>
                <div className="flex items-center justify-center gap-1">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <p className="text-base font-bold text-success">{item.saving}</p>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Fornecedor</p>
                <p className="font-medium mt-0.5">{item.fornecedor}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Prazo</p>
                <p className="font-medium mt-0.5">{item.prazo}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Negociado por</p>
                <p className="font-medium mt-0.5">{item.negociadoPor}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-[10px] text-muted-foreground">Urgência</p>
                <Badge className={`text-[10px] border-0 mt-0.5 ${item.urgencia === 'Alta' ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}>{item.urgencia}</Badge>
              </div>
            </div>

            {/* Mini timeline */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Histórico resumido</p>
              {item.timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {t}
                </div>
              ))}
            </div>

            {/* Actions */}
            {item.aprovado ? (
              <div className="flex items-center justify-center gap-3 py-3 px-5 rounded-xl bg-success/5">
                <ShieldCheck className="h-5 w-5 text-success" />
                <div>
                  <p className="font-semibold text-success text-sm">Aprovado com sucesso</p>
                  <p className="text-[10px] text-muted-foreground">Encaminhado para controladoria e pagamento</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button onClick={() => handleAprovar(item.id)} className="h-11 text-xs font-semibold bg-success hover:bg-success/90 text-success-foreground rounded-xl col-span-2 sm:col-span-1">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Aprovar
                </Button>
                <Button variant="outline" className="h-11 text-xs font-semibold border-destructive text-destructive hover:bg-destructive/5 rounded-xl">
                  <XCircle className="h-4 w-4 mr-1.5" /> Recusar
                </Button>
                <Button variant="outline" className="h-11 text-xs font-semibold rounded-xl">
                  <MessageSquare className="h-4 w-4 mr-1.5" /> Pedir Ajuste
                </Button>
                <Button variant="outline" className="h-11 text-xs font-semibold rounded-xl text-warning">
                  <AlertCircle className="h-4 w-4 mr-1.5" /> Aprovar c/ Ressalva
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
