import { useState } from "react";
import {
  Search, Send, FileText, RotateCcw, MessageSquare,
  Clock, Paperclip, CheckCircle2, User, Copy, ExternalLink, Truck, CreditCard,
  Plus, ChevronRight, Package, DollarSign, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

type PedidoStatus = "nova" | "em_cotacao" | "aguardando_complemento" | "aguardando_aprovacao" | "aprovada_retorno" | "aguardando_pagamento" | "em_logistica";

interface Cotacao {
  fornecedor: string;
  valor: string;
  prazo: string;
  frete: string;
  obs: string;
}

interface Pedido {
  id: number;
  item: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  prazo: string;
  urgencia: "normal" | "alta" | "critica";
  qtd: number;
  status: PedidoStatus;
  cotacoes: Cotacao[];
  melhorPreco?: string;
  fornecedor?: string;
  fornecedoresVinculados: string[];
  comentarios: { texto: string; por: string; data: string }[];
}

const fornecedoresBase = [
  "Dousystem", "Casa do Café", "Print Express", "TACC Iluminação",
  "Kalunga", "Atacadão Embalagens", "Fazenda Pura Fé Eventos", "Papelaria Central",
  "Hiperoffice", "Rápido Gráfica"
];

const initialPedidos: Pedido[] = [
  {
    id: 1, item: "Líquido p/ Máquina de Haze (Galão 05L)", solicitante: "Caslu", area: "Iluminação",
    centroCusto: "LOUVOR", prazo: "Próx. domingo", urgencia: "critica", qtd: 2, status: "nova",
    cotacoes: [], fornecedoresVinculados: [],
    comentarios: [{ texto: "Urgente! Sem haze o culto fica sem efeito.", por: "Caslu", data: "10/03 09:15" }],
  },
  {
    id: 2, item: "Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)",
    solicitante: "Pr. Rafael Diniz", area: "Central de Atendimento", centroCusto: "CENTRAL",
    prazo: "15/03", urgencia: "alta", qtd: 1, status: "em_cotacao",
    cotacoes: [
      { fornecedor: "Casa do Café", valor: "R$ 389,61", prazo: "3 dias", frete: "Grátis", obs: "Melhor preço" },
      { fornecedor: "Atacadão Embalagens", valor: "R$ 412,00", prazo: "2 dias", frete: "R$ 25,00", obs: "Entrega mais rápida" },
      { fornecedor: "Kalunga", valor: "R$ 445,90", prazo: "5 dias", frete: "R$ 18,00", obs: "" },
    ],
    melhorPreco: "R$ 389,61", fornecedor: "Casa do Café",
    fornecedoresVinculados: ["Casa do Café", "Atacadão Embalagens", "Kalunga"],
    comentarios: [
      { texto: "Estoque de café acabou completamente.", por: "Pr. Rafael Diniz", data: "09/03 14:30" },
      { texto: "3 cotações recebidas. Casa do Café tem melhor preço.", por: "Compras", data: "10/03 08:00" },
    ],
  },
  {
    id: 4, item: "Kit Lanche Infantil (Suco, Biscoito, Guardanapo)", solicitante: "Marcos (Kids)",
    area: "Kids", centroCusto: "KIDS", prazo: "Sábado", urgencia: "alta", qtd: 100,
    status: "nova", cotacoes: [], fornecedoresVinculados: [],
    comentarios: [{ texto: "Evento Kids especial com 100 crianças.", por: "Marcos", data: "10/03 11:45" }],
  },
  {
    id: 3, item: "Material de Limpeza (Desinfetante, Detergente, Pano, Luvas)", solicitante: "Michele",
    area: "Administrativo", centroCusto: "SEDE", prazo: "12/03", urgencia: "normal", qtd: 1,
    status: "aguardando_aprovacao",
    cotacoes: [
      { fornecedor: "Dousystem", valor: "R$ 780,00", prazo: "2 dias", frete: "Grátis", obs: "Fornecedor recorrente" },
      { fornecedor: "Kalunga", valor: "R$ 820,00", prazo: "3 dias", frete: "R$ 15,00", obs: "" },
    ],
    melhorPreco: "R$ 780,00", fornecedor: "Dousystem",
    fornecedoresVinculados: ["Dousystem", "Kalunga"],
    comentarios: [
      { texto: "Reposição mensal.", por: "Michele", data: "07/03 10:00" },
      { texto: "Enviada para aprovação executiva.", por: "Compras", data: "08/03 09:30" },
    ],
  },
  {
    id: 5, item: "Banner Lona 3x2m — Campanha Páscoa", solicitante: "Dani Criativo",
    area: "Criativo", centroCusto: "CRIATIVO", prazo: "20/03", urgencia: "normal", qtd: 2,
    status: "em_cotacao",
    cotacoes: [
      { fornecedor: "Print Express", valor: "R$ 340,00", prazo: "5 dias", frete: "R$ 30,00", obs: "" },
      { fornecedor: "Rápido Gráfica", valor: "R$ 380,00", prazo: "3 dias", frete: "Grátis", obs: "Acabamento premium" },
    ],
    melhorPreco: "R$ 340,00", fornecedor: "Print Express",
    fornecedoresVinculados: ["Print Express", "Rápido Gráfica"],
    comentarios: [
      { texto: "Preciso de 2 banners iguais, arte já pronta.", por: "Dani", data: "08/03 14:00" },
    ],
  },
  {
    id: 6, item: "Pilhas p/ Microfone AA (caixa c/48)", solicitante: "Sound Team",
    area: "Louvor", centroCusto: "LOUVOR", prazo: "14/03", urgencia: "alta", qtd: 2,
    status: "aguardando_complemento", cotacoes: [],
    fornecedoresVinculados: ["Kalunga"],
    comentarios: [
      { texto: "Precisamos de pilhas AA, não AAA.", por: "Sound Team", data: "09/03 08:00" },
      { texto: "Devolvido: especificar marca preferida e se aceita recarregável.", por: "Compras", data: "09/03 10:00" },
    ],
  },
  {
    id: 7, item: "Retiro Fazenda Pura Fé — Locação + Alimentação", solicitante: "Eventos",
    area: "Eventos", centroCusto: "EVENTOS", prazo: "20/03", urgencia: "normal", qtd: 1,
    status: "aguardando_pagamento",
    cotacoes: [
      { fornecedor: "Fazenda Pura Fé Eventos", valor: "R$ 6.000,00", prazo: "Confirmado", frete: "N/A", obs: "Saving R$ 250" },
    ],
    melhorPreco: "R$ 6.000,00", fornecedor: "Fazenda Pura Fé Eventos",
    fornecedoresVinculados: ["Fazenda Pura Fé Eventos"],
    comentarios: [
      { texto: "Retiro de liderança confirmado para 80 participantes.", por: "Eventos", data: "05/03 10:00" },
      { texto: "Aprovação executiva confirmada.", por: "Aprovação", data: "08/03 14:00" },
    ],
  },
  {
    id: 8, item: "Copos Biodegradáveis 60ml (1000 un)", solicitante: "Central",
    area: "Central de Atendimento", centroCusto: "CENTRAL", prazo: "10/03", urgencia: "normal", qtd: 1,
    status: "em_logistica",
    cotacoes: [
      { fornecedor: "Dousystem", valor: "R$ 520,00", prazo: "2 dias", frete: "Grátis", obs: "" },
    ],
    melhorPreco: "R$ 520,00", fornecedor: "Dousystem",
    fornecedoresVinculados: ["Dousystem"],
    comentarios: [
      { texto: "Pagamento efetuado via Pix.", por: "Financeiro", data: "09/03 11:00" },
      { texto: "Fornecedor informou despacho para hoje.", por: "Compras", data: "10/03 08:00" },
    ],
  },
];

const columns: { status: PedidoStatus; label: string; color: string }[] = [
  { status: "nova", label: "Novas Solicitações", color: "bg-primary" },
  { status: "em_cotacao", label: "Em Cotação", color: "bg-warning" },
  { status: "aguardando_complemento", label: "Aguard. Complemento", color: "bg-destructive" },
  { status: "aguardando_aprovacao", label: "Aguard. Aprovação", color: "bg-success" },
  { status: "aprovada_retorno", label: "Aprovado — Complementar Docs", color: "bg-success" },
  { status: "aguardando_pagamento", label: "Aguard. Pagamento", color: "bg-primary" },
  { status: "em_logistica", label: "Em Logística", color: "bg-warning" },
];

const stepperStages: { key: PedidoStatus | "entregue"; label: string }[] = [
  { key: "nova", label: "Solicitação" },
  { key: "em_cotacao", label: "Cotação" },
  { key: "aguardando_aprovacao", label: "Aprovação" },
  { key: "aguardando_pagamento", label: "Pagamento" },
  { key: "em_logistica", label: "Logística" },
  { key: "entregue", label: "Entregue" },
];

const urgenciaColor: Record<string, string> = {
  normal: "bg-muted text-muted-foreground",
  alta: "bg-warning/15 text-warning",
  critica: "bg-destructive/15 text-destructive",
};

function getStepIndex(status: PedidoStatus): number {
  const map: Record<PedidoStatus, number> = {
    nova: 0, em_cotacao: 1, aguardando_complemento: 1,
    aguardando_aprovacao: 2, aprovada_retorno: 2.5, aguardando_pagamento: 3, em_logistica: 4
  };
  return map[status];
}

export default function MesaRafaelScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  // Form states
  const [novoFornecedor, setNovoFornecedor] = useState("");
  const [cotacaoForm, setCotacaoForm] = useState({ fornecedor: "", valor: "", prazo: "", frete: "", obs: "" });
  const [devolucaoMotivo, setDevolucaoMotivo] = useState("");
  const [aprovacaoObs, setAprovacaoObs] = useState("");
  const [comentario, setComentario] = useState("");
  const [recebConferido, setRecebConferido] = useState(false);
  const [recebDivergencia, setRecebDivergencia] = useState("");

  const selected = pedidos.find(p => p.id === selectedId) || null;

  const getByStatus = (status: string) =>
    pedidos.filter(p => p.status === status && (!busca || p.item.toLowerCase().includes(busca.toLowerCase()) || p.solicitante.toLowerCase().includes(busca.toLowerCase())));

  const updatePedido = (id: number, updates: Partial<Pedido>) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const advanceStatus = (id: number, nextStatus: PedidoStatus, message: string) => {
    updatePedido(id, { status: nextStatus });
    toast({ title: "✅ Ação Realizada", description: message });
    resetForms();
  };

  const resetForms = () => {
    setNovoFornecedor("");
    setCotacaoForm({ fornecedor: "", valor: "", prazo: "", frete: "", obs: "" });
    setDevolucaoMotivo("");
    setAprovacaoObs("");
    setComentario("");
    setRecebConferido(false);
    setRecebDivergencia("");
  };

  const handleCopyWhatsApp = (pedido: Pedido) => {
    const msg = `*SIGCE — Solicitação de Cotação*\n\nOlá! Gostaríamos de solicitar cotação para o seguinte item:\n\n📦 *Item:* ${pedido.item}\n📊 *Quantidade:* ${pedido.qtd}\n📅 *Prazo desejado:* ${pedido.prazo}\n🏢 *Centro de Custo:* ${pedido.centroCusto}\n\nPor favor, envie:\n- Valor unitário e total\n- Prazo de entrega\n- Forma de pagamento\n- Frete (se houver)\n\nAgradecemos o retorno!`;
    navigator.clipboard.writeText(msg);
    toast({ title: "📋 Mensagem Copiada", description: "Cole no WhatsApp para enviar ao fornecedor." });
  };

  const handleOpenWhatsApp = (pedido: Pedido) => {
    const msg = encodeURIComponent(`*SIGCE — Solicitação de Cotação*\n\nItem: ${pedido.item}\nQuantidade: ${pedido.qtd}\nPrazo: ${pedido.prazo}\n\nPor favor, envie cotação com valor, prazo e frete.`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleAddFornecedor = (pedido: Pedido) => {
    if (!novoFornecedor || pedido.fornecedoresVinculados.includes(novoFornecedor)) return;
    updatePedido(pedido.id, { fornecedoresVinculados: [...pedido.fornecedoresVinculados, novoFornecedor] });
    setNovoFornecedor("");
    toast({ title: "Fornecedor vinculado", description: `${novoFornecedor} adicionado ao pedido.` });
  };

  const handleRegistrarCotacao = (pedido: Pedido) => {
    if (!cotacaoForm.fornecedor || !cotacaoForm.valor) return;
    const newCotacao: Cotacao = { ...cotacaoForm };
    const updated = [...pedido.cotacoes, newCotacao];
    updatePedido(pedido.id, { cotacoes: updated, status: "em_cotacao" as PedidoStatus });
    setCotacaoForm({ fornecedor: "", valor: "", prazo: "", frete: "", obs: "" });
    toast({ title: "Cotação registrada", description: `Cotação de ${newCotacao.fornecedor} salva com sucesso.` });
  };

  const handleAddComentario = (pedido: Pedido) => {
    if (!comentario.trim()) return;
    const newCom = { texto: comentario, por: "Compras", data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    updatePedido(pedido.id, { comentarios: [...pedido.comentarios, newCom] });
    setComentario("");
    toast({ title: "Comentário adicionado" });
  };

  const renderStepper = (status: PedidoStatus) => {
    const activeIdx = getStepIndex(status);
    return (
      <div className="flex items-center gap-0 w-full mb-5">
        {stepperStages.map((stage, i) => {
          const isActive = i === activeIdx;
          const isDone = i < activeIdx;
          return (
            <div key={stage.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                  isDone ? 'bg-success border-success text-success-foreground' :
                  isActive ? 'bg-primary border-primary text-primary-foreground' :
                  'bg-muted border-border text-muted-foreground'
                }`}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span className={`text-[8px] mt-1 text-center leading-tight ${isActive ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
              </div>
              {i < stepperStages.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded ${isDone ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderContextualActions = (pedido: Pedido) => {
    switch (pedido.status) {
      case "nova":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" /> Próximo Passo: Iniciar Cotação
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                Selecione fornecedores e envie a solicitação de cotação via WhatsApp.
              </p>
              <div className="space-y-2">
                <Select value={novoFornecedor} onValueChange={setNovoFornecedor}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Selecionar fornecedor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedoresBase.filter(f => !pedido.fornecedoresVinculados.includes(f)).map(f => (
                      <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => handleAddFornecedor(pedido)} disabled={!novoFornecedor}>
                  <Plus className="h-3 w-3 mr-1" /> Vincular Fornecedor
                </Button>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleCopyWhatsApp(pedido)}>
                    <Copy className="h-3 w-3 mr-1" /> Copiar Mensagem
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleOpenWhatsApp(pedido)}>
                    <ExternalLink className="h-3 w-3 mr-1" /> Abrir WhatsApp
                  </Button>
                </div>
                <Button size="sm" className="w-full h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => advanceStatus(pedido.id, "em_cotacao", `"${pedido.item}" movido para Em Cotação`)}>
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Confirmar Início da Cotação
                </Button>
              </div>
            </div>
          </div>
        );

      case "em_cotacao":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-warning/20 bg-warning/5">
              <p className="text-xs font-semibold text-warning mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Registrar Nova Cotação
              </p>
              <div className="space-y-2">
                <Select value={cotacaoForm.fornecedor} onValueChange={v => setCotacaoForm(p => ({ ...p, fornecedor: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Fornecedor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(pedido.fornecedoresVinculados.length > 0 ? pedido.fornecedoresVinculados : fornecedoresBase).map(f => (
                      <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Valor total" className="h-8 text-xs" value={cotacaoForm.valor} onChange={e => setCotacaoForm(p => ({ ...p, valor: e.target.value }))} />
                  <Input placeholder="Prazo entrega" className="h-8 text-xs" value={cotacaoForm.prazo} onChange={e => setCotacaoForm(p => ({ ...p, prazo: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Frete" className="h-8 text-xs" value={cotacaoForm.frete} onChange={e => setCotacaoForm(p => ({ ...p, frete: e.target.value }))} />
                  <Input placeholder="Observação" className="h-8 text-xs" value={cotacaoForm.obs} onChange={e => setCotacaoForm(p => ({ ...p, obs: e.target.value }))} />
                </div>
                <Button size="sm" variant="outline" className="w-full h-8 text-xs"
                  onClick={() => handleRegistrarCotacao(pedido)} disabled={!cotacaoForm.fornecedor || !cotacaoForm.valor}>
                  <Plus className="h-3 w-3 mr-1" /> Salvar Cotação
                </Button>
              </div>
            </div>

            {pedido.cotacoes.length > 0 && (
              <div className="p-3 rounded-lg border border-success/20 bg-success/5">
                <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Comparativo de Cotações ({pedido.cotacoes.length})
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-1.5 font-semibold">Fornecedor</th>
                        <th className="text-right py-1.5 font-semibold">Valor</th>
                        <th className="text-right py-1.5 font-semibold">Frete</th>
                        <th className="text-right py-1.5 font-semibold">Prazo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.cotacoes.map((c, i) => {
                        const isBest = c.valor === pedido.melhorPreco;
                        return (
                          <tr key={i} className={`border-b border-border/50 ${isBest ? 'bg-success/10' : ''}`}>
                            <td className="py-1.5 flex items-center gap-1">
                              {isBest && <Badge className="bg-success text-success-foreground text-[8px] px-1 h-4">Melhor</Badge>}
                              {c.fornecedor}
                            </td>
                            <td className={`text-right py-1.5 font-semibold ${isBest ? 'text-success' : ''}`}>{c.valor}</td>
                            <td className="text-right py-1.5">{c.frete}</td>
                            <td className="text-right py-1.5">{c.prazo}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Button size="sm" className="w-full h-9 text-xs mt-3 bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => advanceStatus(pedido.id, "aguardando_aprovacao", `"${pedido.item}" enviado para aprovação executiva`)}>
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Enviar para Aprovação
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleCopyWhatsApp(pedido)}>
                <Copy className="h-3 w-3 mr-1" /> Copiar Cotação
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleOpenWhatsApp(pedido)}>
                <ExternalLink className="h-3 w-3 mr-1" /> WhatsApp
              </Button>
            </div>
          </div>
        );

      case "aguardando_complemento":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <p className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> Aguardando Complemento do Solicitante
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                O solicitante precisa completar informações. Envie uma notificação ou registre o recebimento do complemento.
              </p>
              <Textarea placeholder="Motivo da devolução / informações necessárias..." className="text-xs min-h-[60px]"
                value={devolucaoMotivo} onChange={e => setDevolucaoMotivo(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => {
                  toast({ title: "Notificação enviada", description: "Solicitante foi notificado sobre o complemento necessário." });
                }}>
                  <MessageSquare className="h-3 w-3 mr-1" /> Notificar Solicitante
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => advanceStatus(pedido.id, "em_cotacao", `"${pedido.item}" complemento recebido, retornando para cotação`)}>
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Complemento Recebido
                </Button>
              </div>
            </div>
          </div>
        );

      case "aguardando_aprovacao":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-success/20 bg-success/5">
              <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Registrar Aprovação
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                A aprovação pode ser feita na plataforma ou registrada a partir de uma decisão recebida por WhatsApp.
              </p>
              <Textarea placeholder="Observação da aprovação..." className="text-xs min-h-[50px]"
                value={aprovacaoObs} onChange={e => setAprovacaoObs(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="flex-1 h-9 text-xs bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => advanceStatus(pedido.id, "aprovada_retorno", `"${pedido.item}" aprovado! Devolvido para Compras — aguardando NF e dados de entrega.`)}>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Aprovado
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 h-9 text-xs"
                  onClick={() => advanceStatus(pedido.id, "aguardando_complemento", `"${pedido.item}" recusado. Devolvido para ajuste.`)}>
                  Recusado
                </Button>
              </div>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs mt-2" onClick={() => {
                toast({ title: "Anexar Print", description: "Função de upload será implementada na versão final." });
              }}>
                <Paperclip className="h-3 w-3 mr-1" /> Anexar Print WhatsApp
              </Button>
            </div>
          </div>
        );

      case "aguardando_pagamento":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Encaminhar para Pagamento
              </p>
              {pedido.fornecedor && (
                <div className="p-2 rounded bg-muted/40 mb-3 space-y-1">
                  <p className="text-[10px] font-semibold">Dados do Fornecedor</p>
                  <p className="text-[10px] text-muted-foreground">Fornecedor: {pedido.fornecedor}</p>
                  <p className="text-[10px] text-muted-foreground">Valor: {pedido.melhorPreco}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-muted-foreground">Pix: 12.345.678/0001-99</span>
                    <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => {
                      navigator.clipboard.writeText("12.345.678/0001-99");
                      toast({ title: "Pix copiado!" });
                    }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              <Button size="sm" className="w-full h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => advanceStatus(pedido.id, "em_logistica", `"${pedido.item}" pagamento confirmado, movido para logística`)}>
                <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Confirmar Pagamento e Avançar
              </Button>
            </div>
          </div>
        );

      case "em_logistica":
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-warning/20 bg-warning/5">
              <p className="text-xs font-semibold text-warning mb-2 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Registrar Recebimento
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                Confirme a conferência dos itens e registre divergências se houver.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox id="conferido" checked={recebConferido} onCheckedChange={v => setRecebConferido(v === true)} />
                <label htmlFor="conferido" className="text-xs">Itens conferidos e em conformidade</label>
              </div>
              <Input placeholder="Divergência (se houver)..." className="h-8 text-xs mb-2"
                value={recebDivergencia} onChange={e => setRecebDivergencia(e.target.value)} />
              <Button size="sm" className="w-full h-9 text-xs bg-success hover:bg-success/90 text-success-foreground"
                disabled={!recebConferido}
                onClick={() => {
                  toast({ title: "✅ Recebimento Finalizado", description: `"${pedido.item}" entregue e estoque atualizado.` });
                  setSelectedId(null);
                  resetForms();
                }}>
                <Package className="h-3.5 w-3.5 mr-1.5" /> Finalizar Recebimento
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Workspace operacional — gerencie todas as solicitações de compra em um só lugar.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Buscar pedido..." className="pl-9 h-8 text-xs" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {columns.map(col => {
          const count = getByStatus(col.status).length;
          return (
            <div key={col.status} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50">
              <div className={`h-2 w-2 rounded-full ${col.color}`} />
              <span className="text-[10px] font-medium">{col.label}</span>
              <Badge variant="secondary" className="text-[9px] h-4 px-1.5 ml-0.5">{count}</Badge>
            </div>
          );
        })}
      </div>

      {/* CRM Horizontal Pipeline */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-6 lg:px-6">
        <div className="flex gap-4" style={{ minWidth: `${columns.length * 296}px` }}>
          {columns.map(col => {
            const items = getByStatus(col.status);
            return (
              <div key={col.status} className="w-[280px] min-w-[280px] space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className={`h-2 w-2 rounded-full ${col.color}`} />
                  <h3 className="text-xs font-semibold">{col.label}</h3>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">{items.length}</Badge>
                </div>
                <div className="space-y-2 p-2 rounded-xl bg-muted/30" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  {items.map(p => (
                    <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => { setSelectedId(p.id); resetForms(); }}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold leading-tight line-clamp-2">{p.item}</p>
                          <span className="text-[9px] text-muted-foreground font-mono shrink-0">#{String(p.id).padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{p.solicitante}</span>
                          <span>•</span>
                          <span>{p.centroCusto}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge className={`text-[9px] border-0 ${urgenciaColor[p.urgencia]}`}>{p.urgencia === "critica" ? "URGENTE" : p.urgencia === "alta" ? "Alta" : "Normal"}</Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {p.prazo}
                          </span>
                        </div>
                        {p.cotacoes.length > 0 && (
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">{p.cotacoes.length} cotações</span>
                            {p.melhorPreco && <span className="font-semibold text-success">{p.melhorPreco}</span>}
                          </div>
                        )}
                        {p.fornecedor && (
                          <p className="text-[10px] text-muted-foreground truncate">Fornecedor: {p.fornecedor}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-6 w-6 mb-1 opacity-20" />
                      <p className="text-[10px]">Nenhum pedido</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm">Pedido #{String(selected.id).padStart(3, '0')}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {renderStepper(selected.status)}

                <div>
                  <p className="font-semibold text-sm">{selected.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selected.solicitante} • {selected.area} • {selected.centroCusto}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Qtd</p>
                    <p className="text-sm font-bold">{selected.qtd}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Prazo</p>
                    <p className="text-sm font-bold">{selected.prazo}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-[10px] text-muted-foreground">Cotações</p>
                    <p className="text-sm font-bold">{selected.cotacoes.length}</p>
                  </div>
                </div>

                {selected.fornecedoresVinculados.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fornecedores Vinculados</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.fornecedoresVinculados.map(f => (
                        <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Próximo Passo</p>
                  {renderContextualActions(selected)}
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Histórico</p>
                  <div className="space-y-2">
                    {selected.comentarios.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-muted/30 border-l-2 border-border">
                        <p className="text-xs">{c.texto}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{c.por} • {c.data}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="Adicionar comentário..." className="h-8 text-xs flex-1"
                      value={comentario} onChange={e => setComentario(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddComentario(selected)} />
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleAddComentario(selected)} disabled={!comentario.trim()}>
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="ghost" className="h-7 text-[10px] text-muted-foreground" onClick={() => {
                    advanceStatus(selected.id, "aguardando_complemento", `"${selected.item}" devolvido para ajuste`);
                  }}>
                    <RotateCcw className="h-3 w-3 mr-1" /> Devolver p/ Ajuste
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
