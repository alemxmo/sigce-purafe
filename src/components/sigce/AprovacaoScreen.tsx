import { useState } from "react";
import { CheckCircle2, XCircle, MessageSquare, TrendingDown, ShieldCheck, AlertCircle, Smartphone, ExternalLink, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface CotacaoDetalhe {
  fornecedor: string;
  valorTotal: string;
  frete: string;
  prazo: string;
  pagamento: string;
  obs: string;
  melhorPreco: boolean;
  maisRapido: boolean;
}

interface Aprovacao {
  id: number;
  titulo: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  justificativa: string;
  urgencia: string;
  cotacoes: CotacaoDetalhe[];
  aprovado: boolean;
  fornecedorSelecionado: string | null;
  timeline: string[];
}

function parseValue(v: string): number {
  return parseFloat(v.replace(/[R$\s.]/g, '').replace(',', '.'));
}

const pendentes: Aprovacao[] = [
  {
    id: 1, titulo: "Kit Café — Central de Atendimento", solicitante: "Pr. Rafael Diniz", area: "Central de Atendimento",
    centroCusto: "CENTRAL", justificativa: "Reposição de estoque de café e descartáveis. Atendemos 200+ pessoas/semana.",
    urgencia: "Alta", aprovado: false, fornecedorSelecionado: null,
    cotacoes: [
      { fornecedor: "Casa do Café", valorTotal: "R$ 389,61", frete: "Grátis", prazo: "2 dias úteis", pagamento: "Pix à vista", obs: "Fornecedor preferencial. Entrega própria.", melhorPreco: true, maisRapido: true },
      { fornecedor: "Mercado Boa Compra", valorTotal: "R$ 415,00", frete: "R$ 25,00", prazo: "3 dias úteis", pagamento: "Boleto 7 dias", obs: "Jarras térmicas superiores.", melhorPreco: false, maisRapido: false },
      { fornecedor: "Distribuidora Central", valorTotal: "R$ 432,50", frete: "R$ 35,00", prazo: "5 dias úteis", pagamento: "Boleto 14 dias", obs: "Entrega terças e quintas.", melhorPreco: false, maisRapido: false },
    ],
    timeline: ["Solicitação criada", "3 cotações comparadas", "Pacote enviado para aprovação"],
  },
  {
    id: 2, titulo: "Banner Lona 3x2m — Campanha Páscoa", solicitante: "Dani Criativo", area: "Criativo",
    centroCusto: "CRIATIVO", justificativa: "Campanha de Páscoa inicia dia 25/03. Precisamos de 2 banners 3x2m.",
    urgencia: "Normal", aprovado: false, fornecedorSelecionado: null,
    cotacoes: [
      { fornecedor: "Print Express", valorTotal: "R$ 340,00", frete: "R$ 30,00", prazo: "7 dias úteis", pagamento: "Pix à vista", obs: "Arte em alta resolução necessária.", melhorPreco: true, maisRapido: false },
      { fornecedor: "Gráfica Rápida SP", valorTotal: "R$ 390,00", frete: "Grátis", prazo: "5 dias úteis", pagamento: "Boleto 7 dias", obs: "Frete incluso Grande SP.", melhorPreco: false, maisRapido: true },
    ],
    timeline: ["Solicitação criada", "2 cotações comparadas", "Pacote enviado para aprovação"],
  },
  {
    id: 3, titulo: "Material de Limpeza SEDE", solicitante: "Michele", area: "Administrativo",
    centroCusto: "SEDE", justificativa: "Reposição mensal regular de materiais de limpeza.",
    urgencia: "Normal", aprovado: false, fornecedorSelecionado: null,
    cotacoes: [
      { fornecedor: "Dousystem", valorTotal: "R$ 780,00", frete: "Grátis", prazo: "2 dias úteis", pagamento: "Boleto 7 dias", obs: "Fornecedor recorrente, contrato mensal.", melhorPreco: true, maisRapido: true },
      { fornecedor: "Kalunga", valorTotal: "R$ 820,00", frete: "R$ 15,00", prazo: "3 dias úteis", pagamento: "Boleto 14 dias", obs: "", melhorPreco: false, maisRapido: false },
    ],
    timeline: ["Solicitação mensal automática", "2 cotações recebidas", "Pacote enviado para aprovação"],
  },
];

export default function AprovacaoScreen() {
  const [items, setItems] = useState(pendentes);

  const handleSelectFornecedor = (aprovacaoId: number, fornecedor: string) => {
    setItems(prev => prev.map(i => i.id === aprovacaoId ? { ...i, fornecedorSelecionado: fornecedor } : i));
  };

  const handleAprovar = (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item?.fornecedorSelecionado) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, aprovado: true } : i));
    toast({ title: "✅ Compra Aprovada", description: `${item.titulo} — Fornecedor: ${item.fornecedorSelecionado}. Devolvido para Compras — aguardando NF e dados de entrega.` });
  };

  const handleWhatsAppApproval = (item: Aprovacao) => {
    const cotacoesText = item.cotacoes.map((c, i) => `${i + 1}. ${c.fornecedor}: ${c.valorTotal} (${c.frete === "Grátis" ? "frete grátis" : `frete ${c.frete}`}, ${c.prazo})`).join("\n");
    const msg = encodeURIComponent(
      `*SIGCE — Aprovação de Compra*\n\n📋 *${item.titulo}*\n👤 Solicitante: ${item.solicitante}\n🏢 ${item.area} (${item.centroCusto})\n\n📝 ${item.justificativa}\n\n💰 *Cotações Recebidas:*\n${cotacoesText}\n\nPor favor, responda com o número do fornecedor aprovado ou RECUSAR.`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    toast({ title: "📱 WhatsApp Aberto", description: "Envie e registre a resposta quando receber." });
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Visualize todas as cotações recebidas e selecione o fornecedor para aprovar.</p>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Smartphone className="h-3.5 w-3.5" />
          <span>Aprovação via plataforma ou WhatsApp</span>
        </div>
      </div>

      {items.map(item => {
        const valores = item.cotacoes.map(c => parseValue(c.valorTotal));
        const maxValor = Math.max(...valores);
        const selectedCot = item.cotacoes.find(c => c.fornecedor === item.fornecedorSelecionado);
        const savingCalc = selectedCot ? (maxValor - parseValue(selectedCot.valorTotal)).toFixed(2).replace('.', ',') : null;

        return (
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

              {/* Cotações Table with radio selection */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Cotações Recebidas ({item.cotacoes.length})
                </p>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        {!item.aprovado && <TableHead className="w-10"></TableHead>}
                        <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                        <TableHead className="text-[11px] font-semibold text-right">Valor Total</TableHead>
                        <TableHead className="text-[11px] font-semibold">Frete</TableHead>
                        <TableHead className="text-[11px] font-semibold">Prazo</TableHead>
                        <TableHead className="text-[11px] font-semibold">Pagamento</TableHead>
                        <TableHead className="text-[11px] font-semibold">Obs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.cotacoes.map((c, i) => {
                        const isSelected = item.fornecedorSelecionado === c.fornecedor;
                        return (
                          <TableRow key={i} className={`hover:bg-muted/20 ${isSelected ? 'bg-success/5 ring-1 ring-inset ring-success/20' : ''} ${c.melhorPreco ? 'bg-success/5' : ''}`}>
                            {!item.aprovado && (
                              <TableCell className="text-center">
                                <input
                                  type="radio"
                                  name={`aprovacao-${item.id}`}
                                  checked={isSelected}
                                  onChange={() => handleSelectFornecedor(item.id, c.fornecedor)}
                                  className="h-4 w-4 accent-[hsl(var(--success))]"
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-medium">{c.fornecedor}</span>
                                {c.melhorPreco && <Badge className="bg-success text-success-foreground text-[8px] px-1.5 h-4 border-0">Melhor Preço</Badge>}
                                {c.maisRapido && <Badge className="bg-primary/15 text-primary text-[8px] px-1.5 h-4 border-0">Mais Rápido</Badge>}
                                {item.aprovado && isSelected && <Badge className="bg-success text-success-foreground text-[8px] px-1.5 h-4 border-0">Aprovado</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`text-xs font-bold ${c.melhorPreco ? 'text-success' : ''}`}>{c.valorTotal}</span>
                            </TableCell>
                            <TableCell className="text-xs">{c.frete}</TableCell>
                            <TableCell className="text-xs">{c.prazo}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{c.pagamento}</TableCell>
                            <TableCell className="text-[10px] text-muted-foreground max-w-[150px] truncate">{c.obs}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Saving calculation */}
              {item.fornecedorSelecionado && !item.aprovado && savingCalc && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5">
                  <TrendingDown className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Saving vs. cotação mais cara</p>
                    <p className="text-lg font-bold text-success">R$ {savingCalc}</p>
                  </div>
                </div>
              )}

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
                     <p className="font-semibold text-success text-sm">Aprovado — {item.fornecedorSelecionado}</p>
                     <p className="text-[10px] text-muted-foreground">Devolvido para Compras — aguardando NF e dados de entrega</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Aprovar na Plataforma</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button onClick={() => handleAprovar(item.id)}
                      className="h-11 text-xs font-semibold bg-success hover:bg-success/90 text-success-foreground rounded-xl col-span-2 sm:col-span-1"
                      disabled={!item.fornecedorSelecionado}>
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Aprovar
                    </Button>
                    <Button variant="outline" className="h-11 text-xs font-semibold border-destructive text-destructive hover:bg-destructive/5 rounded-xl">
                      <XCircle className="h-4 w-4 mr-1.5" /> Recusar
                    </Button>
                    <Button variant="outline" className="h-11 text-xs font-semibold rounded-xl">
                      <MessageSquare className="h-4 w-4 mr-1.5" /> Pedir Ajuste
                    </Button>
                    <Button variant="outline" className="h-11 text-xs font-semibold rounded-xl text-warning">
                      <AlertCircle className="h-4 w-4 mr-1.5" /> Com Ressalva
                    </Button>
                  </div>
                  {!item.fornecedorSelecionado && (
                    <p className="text-[10px] text-destructive">⚠ Selecione um fornecedor na tabela acima para habilitar a aprovação.</p>
                  )}

                  {/* WhatsApp */}
                  <div className="border-t pt-3">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Aprovação via WhatsApp</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Button variant="outline" className="h-9 text-xs" onClick={() => handleWhatsAppApproval(item)}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Enviar via WhatsApp
                      </Button>
                      <Button variant="outline" className="h-9 text-xs" onClick={() => {
                        if (!item.fornecedorSelecionado) {
                          toast({ title: "⚠ Selecione um fornecedor", description: "Selecione o fornecedor aprovado na tabela antes de registrar." });
                          return;
                        }
                        handleAprovar(item.id);
                      }}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Registrar Aprovação
                      </Button>
                      <Button variant="outline" className="h-9 text-xs">
                        <Image className="h-3.5 w-3.5 mr-1.5" /> Anexar Print
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
