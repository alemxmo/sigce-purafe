import { useState } from "react";
import { CheckCircle2, XCircle, MessageSquare, TrendingDown, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function AprovacaoScreen() {
  const [aprovado, setAprovado] = useState(false);

  const handleAprovar = () => {
    setAprovado(true);
    toast({
      title: "✅ Compra Aprovada",
      description: "Retiro Fazenda Pura Fé — R$ 6.000,00 encaminhado para pagamento.",
    });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground mb-6">
        Decisões rápidas para manter o fluxo operacional ágil.
      </p>

      <Card className={`border-0 shadow-lg overflow-hidden ${aprovado ? 'ring-2 ring-success/30' : ''}`}>
        {/* Status bar */}
        <div className={`h-1.5 w-full ${aprovado ? 'bg-success' : 'bg-warning'}`} />

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Retiro Fazenda Pura Fé</h2>
              <p className="text-sm text-muted-foreground mt-1">Solicitado por Rafael • Eventos</p>
            </div>
            <Badge className={aprovado
              ? "bg-success text-success-foreground"
              : "bg-warning/15 text-warning border-0"
            }>
              {aprovado ? "Aprovado" : "Pendente"}
            </Badge>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Valor Original</p>
              <p className="text-lg font-semibold line-through decoration-muted-foreground/40">R$ 6.250,00</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Valor Negociado</p>
              <p className="text-lg font-bold">R$ 6.000,00</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Saving</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="h-4 w-4 text-success" />
                <p className="text-lg font-bold text-success">R$ 250,00</p>
              </div>
            </div>
          </div>

          {/* Info extras */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground">Fornecedor</p>
              <p className="font-medium mt-0.5">Fazenda Pura Fé Eventos</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground">Centro de Custo</p>
              <p className="font-medium mt-0.5">SEDE — Eventos</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground">Negociado por</p>
              <p className="font-medium mt-0.5">Janete</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30">
              <p className="text-xs text-muted-foreground">Prazo</p>
              <p className="font-medium mt-0.5">Pagamento até 15/03</p>
            </div>
          </div>

          {/* Botões */}
          {aprovado ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-success/5">
              <ShieldCheck className="h-6 w-6 text-success" />
              <div>
                <p className="font-semibold text-success">Aprovado com sucesso</p>
                <p className="text-xs text-muted-foreground">Encaminhado para o financeiro</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAprovar}
                className="flex-1 h-12 text-base font-semibold bg-success hover:bg-success/90 text-success-foreground rounded-xl"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" /> Aprovar
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-destructive text-destructive hover:bg-destructive/5 rounded-xl"
              >
                <XCircle className="h-5 w-5 mr-2" /> Recusar
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base font-semibold rounded-xl"
              >
                <MessageSquare className="h-5 w-5 mr-2" /> Pedir Detalhes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
