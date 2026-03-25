import { ArrowLeft, Save, Send, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Props {
  onNavigate: (screen: string) => void;
}

export default function NovaSolicitacaoScreen({ onNavigate }: Props) {
  const handleEnviar = () => {
    toast({ title: "✅ Solicitação Enviada", description: "Sua solicitação foi registrada e encaminhada para o setor de compras." });
    onNavigate("solicitacoes");
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4 text-xs text-muted-foreground" onClick={() => onNavigate("solicitacoes")}>
        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Voltar para Solicitações
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-sm font-semibold mb-4">Dados do Solicitante</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome do Solicitante *</Label>
                    <Input placeholder="Ex: Marcos da Silva" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Telefone / WhatsApp</Label>
                    <Input placeholder="(11) 99999-0000" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Ministério / Área *</Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="louvor">Louvor</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                        <SelectItem value="eventos">Eventos</SelectItem>
                        <SelectItem value="central">Central de Atendimento</SelectItem>
                        <SelectItem value="criativo">Criativo</SelectItem>
                        <SelectItem value="admin">Administrativo</SelectItem>
                        <SelectItem value="iluminacao">Iluminação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Centro de Custo *</Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEDE">SEDE</SelectItem>
                        <SelectItem value="CENTRAL">CENTRAL</SelectItem>
                        <SelectItem value="EVENTOS">EVENTOS</SelectItem>
                        <SelectItem value="KIDS">KIDS</SelectItem>
                        <SelectItem value="LOUVOR">LOUVOR</SelectItem>
                        <SelectItem value="CRIATIVO">CRIATIVO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-5">
                <p className="text-sm font-semibold mb-4">Detalhes do Pedido</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Item Solicitado *</Label>
                    <Input placeholder="Ex: Kit Café completo (Melitta, Açúcar, Mexedor, Copos)" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Categoria</Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumiveis">Consumíveis</SelectItem>
                        <SelectItem value="copa">Copa & Cozinha</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="comunicacao">Comunicação Visual</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="escritorio">Escritório</SelectItem>
                        <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                        <SelectItem value="eventos">Eventos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Quantidade *</Label>
                    <Input type="number" placeholder="1" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Data Limite *</Label>
                    <Input type="date" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Urgência *</Label>
                    <Select>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-5">
                <p className="text-sm font-semibold mb-4">Informações Complementares</p>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Justificativa *</Label>
                    <Textarea placeholder="Explique por que este item é necessário..." className="text-sm min-h-[80px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Observações</Label>
                    <Textarea placeholder="Informações adicionais, especificações, marcas preferidas..." className="text-sm min-h-[60px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Anexo (opcional)</Label>
                    <Input type="file" className="h-9 text-sm" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" className="flex-1 h-11 text-sm">
                  <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
                </Button>
                <Button className="flex-1 h-11 text-sm bg-primary hover:bg-primary/90" onClick={handleEnviar}>
                  <Send className="h-4 w-4 mr-2" /> Enviar Solicitação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-primary">Regras do Pedido</p>
              </div>
              <ul className="space-y-2 text-[11px] text-muted-foreground">
                <li>• Preencha todos os campos obrigatórios (*)</li>
                <li>• Solicitações com urgência <strong>Crítica</strong> são priorizadas automaticamente</li>
                <li>• Itens acima de R$ 500 precisam de aprovação executiva</li>
                <li>• Anexe referências de produto quando possível</li>
                <li>• A data limite deve ter pelo menos 3 dias úteis para compras normais</li>
                <li>• Compras recorrentes podem ser automatizadas — converse com Rafael</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold mb-3">Fluxo após envio</p>
              <div className="space-y-2.5">
                {[
                  "1. Rafael recebe e analisa",
                  "2. Cotação com fornecedores",
                  "3. Comparação de propostas",
                  "4. Aprovação da liderança",
                  "5. Negociação final (Janete)",
                  "6. Pagamento (Michele)",
                  "7. Entrega e conferência",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    <span className="text-[11px] text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
