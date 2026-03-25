import { useState } from "react";
import { Search, Star, Phone, MapPin, Clock, ChevronRight, Building2, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Fornecedor {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  categoria: string;
  telefone: string;
  cidade: string;
  leadTime: string;
  status: "ativo" | "inativo";
  score: number;
  ultimoPedido: string;
  precoMedio: string;
  preferencial: boolean;
  banco: string;
  pix: string;
  historico: { data: string; pedido: string; valor: string }[];
}

const fornecedores: Fornecedor[] = [
  {
    id: 1, nomeFantasia: "Dousystem", razaoSocial: "Dousystem Comércio LTDA", cnpj: "12.345.678/0001-01",
    categoria: "Limpeza & Descartáveis", telefone: "(11) 3333-1111", cidade: "São Paulo - SP",
    leadTime: "3 dias", status: "ativo", score: 4.5, ultimoPedido: "08/03/2025", precoMedio: "R$ 780,00",
    preferencial: true, banco: "Banco do Brasil — Ag 1234 / CC 56789-0", pix: "12345678000101",
    historico: [
      { data: "08/03", pedido: "Mat. Limpeza", valor: "R$ 780,00" },
      { data: "15/02", pedido: "Descartáveis Copa", valor: "R$ 520,00" },
      { data: "20/01", pedido: "Produtos Limpeza", valor: "R$ 890,00" },
    ],
  },
  {
    id: 2, nomeFantasia: "TACC Iluminação", razaoSocial: "TACC Prod. Iluminação LTDA", cnpj: "23.456.789/0001-02",
    categoria: "Iluminação & Efeitos", telefone: "(11) 3333-2222", cidade: "Guarulhos - SP",
    leadTime: "5 dias", status: "ativo", score: 4.2, ultimoPedido: "05/03/2025", precoMedio: "R$ 590,00",
    preferencial: false, banco: "Itaú — Ag 4567 / CC 12345-6", pix: "tacc@iluminacao.com.br",
    historico: [
      { data: "05/03", pedido: "Líquido de Haze 5L", valor: "R$ 1.180,00" },
      { data: "10/01", pedido: "Lâmpadas PAR", valor: "R$ 2.400,00" },
    ],
  },
  {
    id: 3, nomeFantasia: "Casa do Café", razaoSocial: "Casa do Café Express EIRELI", cnpj: "34.567.890/0001-03",
    categoria: "Copa & Cozinha", telefone: "(11) 3333-3333", cidade: "São Paulo - SP",
    leadTime: "2 dias", status: "ativo", score: 4.8, ultimoPedido: "09/03/2025", precoMedio: "R$ 389,00",
    preferencial: true, banco: "Bradesco — Ag 7890 / CC 34567-8", pix: "(11)933333333",
    historico: [
      { data: "09/03", pedido: "Kit Café Completo", valor: "R$ 389,61" },
      { data: "10/02", pedido: "Kit Café Mensal", valor: "R$ 412,00" },
      { data: "12/01", pedido: "Kit Café + Chá", valor: "R$ 450,00" },
    ],
  },
  {
    id: 4, nomeFantasia: "Print Express", razaoSocial: "Print Express Gráfica LTDA", cnpj: "45.678.901/0001-04",
    categoria: "Comunicação Visual", telefone: "(11) 3333-4444", cidade: "Osasco - SP",
    leadTime: "7 dias", status: "ativo", score: 3.9, ultimoPedido: "01/03/2025", precoMedio: "R$ 340,00",
    preferencial: false, banco: "Nubank — Ag 0001 / CC 98765-4", pix: "grafica@printexpress.com",
    historico: [
      { data: "01/03", pedido: "Banners Evento", valor: "R$ 680,00" },
    ],
  },
  {
    id: 5, nomeFantasia: "Fazenda Pura Fé Eventos", razaoSocial: "Pura Fé Retiros e Eventos LTDA", cnpj: "56.789.012/0001-05",
    categoria: "Eventos & Locação", telefone: "(11) 3333-5555", cidade: "Mairiporã - SP",
    leadTime: "Agendamento", status: "ativo", score: 4.7, ultimoPedido: "25/02/2025", precoMedio: "R$ 6.000,00",
    preferencial: true, banco: "Caixa — Ag 2345 / CC 67890-1", pix: "56789012000105",
    historico: [
      { data: "25/02", pedido: "Retiro Março", valor: "R$ 6.000,00" },
      { data: "15/11", pedido: "Retiro Novembro", valor: "R$ 5.800,00" },
    ],
  },
  {
    id: 6, nomeFantasia: "SomPro Audio", razaoSocial: "SomPro Equip. Áudio LTDA", cnpj: "67.890.123/0001-06",
    categoria: "Áudio & Eletrônicos", telefone: "(11) 3333-6666", cidade: "São Paulo - SP",
    leadTime: "4 dias", status: "ativo", score: 4.3, ultimoPedido: "20/02/2025", precoMedio: "R$ 234,00",
    preferencial: false, banco: "Santander — Ag 3456 / CC 78901-2", pix: "sompro@audio.com",
    historico: [
      { data: "20/02", pedido: "Pilhas AA cx/48", valor: "R$ 234,00" },
      { data: "05/01", pedido: "Cabo XLR 10m (5x)", valor: "R$ 380,00" },
    ],
  },
];

export default function FornecedoresScreen() {
  const [busca, setBusca] = useState("");
  const [selected, setSelected] = useState<Fornecedor | null>(null);

  const filtered = fornecedores.filter(f =>
    !busca || f.nomeFantasia.toLowerCase().includes(busca.toLowerCase()) || f.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">{fornecedores.length}</p>
          <p className="text-[10px] text-muted-foreground">Fornecedores Cadastrados</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold text-success">{fornecedores.filter(f => f.preferencial).length}</p>
          <p className="text-[10px] text-muted-foreground">Preferenciais</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">{fornecedores.filter(f => f.status === "ativo").length}</p>
          <p className="text-[10px] text-muted-foreground">Ativos</p>
        </CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4">
          <p className="text-2xl font-bold">6</p>
          <p className="text-[10px] text-muted-foreground">Categorias</p>
        </CardContent></Card>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar fornecedor..." className="pl-9 h-9 text-xs" value={busca} onChange={e => setBusca(e.target.value)} />
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
                <TableHead className="text-[11px] font-semibold">Categoria</TableHead>
                <TableHead className="text-[11px] font-semibold">Cidade</TableHead>
                <TableHead className="text-[11px] font-semibold">Lead Time</TableHead>
                <TableHead className="text-[11px] font-semibold">Score</TableHead>
                <TableHead className="text-[11px] font-semibold">Último Pedido</TableHead>
                <TableHead className="text-[11px] font-semibold text-right">Preço Médio</TableHead>
                <TableHead className="text-[11px] font-semibold">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(f => (
                <TableRow key={f.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => setSelected(f)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{f.nomeFantasia}</span>
                      {f.preferencial && <Star className="h-3 w-3 text-warning fill-warning" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.categoria}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.cidade}</TableCell>
                  <TableCell className="text-xs">{f.leadTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />
                      <span className="text-xs font-medium">{f.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.ultimoPedido}</TableCell>
                  <TableCell className="text-xs font-medium text-right">{f.precoMedio}</TableCell>
                  <TableCell><Badge className={`text-[10px] border-0 ${f.status === 'ativo' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>{f.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm flex items-center gap-2">
                  {selected.nomeFantasia}
                  {selected.preferencial && <Badge className="text-[9px] bg-warning/15 text-warning border-0">Preferencial</Badge>}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Razão Social", value: selected.razaoSocial },
                    { label: "CNPJ", value: selected.cnpj },
                    { label: "Telefone", value: selected.telefone },
                    { label: "Cidade", value: selected.cidade },
                    { label: "Categoria", value: selected.categoria },
                    { label: "Lead Time", value: selected.leadTime },
                    { label: "Score", value: `${selected.score}/5.0` },
                    { label: "Status", value: selected.status === 'ativo' ? 'Ativo' : 'Inativo' },
                  ].map(f => (
                    <div key={f.label} className="p-2.5 rounded-lg bg-muted/40">
                      <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      <p className="text-xs font-medium mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><CreditCard className="h-3 w-3" /> Dados Bancários</p>
                  <p className="text-xs font-medium mt-1">{selected.banco}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Pix: {selected.pix}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Histórico de Compras</p>
                  <div className="space-y-1.5">
                    {selected.historico.map((h, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                        <div>
                          <p className="text-xs font-medium">{h.pedido}</p>
                          <p className="text-[10px] text-muted-foreground">{h.data}</p>
                        </div>
                        <span className="text-xs font-semibold">{h.valor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
