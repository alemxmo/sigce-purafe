import { useState } from "react";
import { Plus, Shield, Bell, Tag, GitBranch, Users, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  status: "ativo" | "inativo";
  ultimoAcesso: string;
}

const initialUsuarios: Usuario[] = [
  { id: 1, nome: "Rafael Oliveira", email: "rafael@purafe.org", perfil: "Admin", status: "ativo", ultimoAcesso: "Hoje, 09:15" },
  { id: 2, nome: "Janete Souza", email: "janete@purafe.org", perfil: "Financeiro", status: "ativo", ultimoAcesso: "Hoje, 08:30" },
  { id: 3, nome: "Bispa Marta", email: "bispa@purafe.org", perfil: "Aprovador", status: "ativo", ultimoAcesso: "Ontem, 17:00" },
  { id: 4, nome: "Michele Santos", email: "michele@purafe.org", perfil: "Solicitante", status: "ativo", ultimoAcesso: "Hoje, 10:45" },
  { id: 5, nome: "Carlos Lima", email: "carlos@purafe.org", perfil: "Comprador", status: "ativo", ultimoAcesso: "Ontem, 14:20" },
  { id: 6, nome: "Dani Ferreira", email: "dani@purafe.org", perfil: "Solicitante", status: "inativo", ultimoAcesso: "05/03/2025" },
];

const perfilColors: Record<string, string> = {
  Admin: "bg-primary/15 text-primary",
  Comprador: "bg-warning/15 text-warning",
  Solicitante: "bg-muted text-muted-foreground",
  Aprovador: "bg-success/15 text-success",
  Financeiro: "bg-primary/15 text-primary",
};

const initialCentrosCusto = [
  { id: 1, nome: "Sede", codigo: "SEDE", ativo: true },
  { id: 2, nome: "Instituto Pura Fé", codigo: "INSTITUTO", ativo: true },
  { id: 3, nome: "Central de Atendimento", codigo: "CENTRAL", ativo: true },
];

export default function ConfiguracoesScreen() {
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ nome: "", email: "", perfil: "Solicitante" });
  const [centrosCusto, setCentrosCusto] = useState(initialCentrosCusto);
  const [novoCentro, setNovoCentro] = useState({ nome: "", codigo: "" });

  const handleSalvarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email) return;
    const novo: Usuario = {
      id: usuarios.length + 1,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      perfil: novoUsuario.perfil,
      status: "ativo",
      ultimoAcesso: "—",
    };
    setUsuarios(prev => [...prev, novo]);
    setNovoUsuario({ nome: "", email: "", perfil: "Solicitante" });
    setSheetOpen(false);
    toast({ title: "✅ Usuário cadastrado", description: `${novo.nome} adicionado como ${novo.perfil}.` });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <Tabs defaultValue="usuarios">
        <TabsList className="h-9">
          <TabsTrigger value="usuarios" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" /> Usuários</TabsTrigger>
          <TabsTrigger value="centros" className="text-xs gap-1.5"><Tag className="h-3.5 w-3.5" /> Centros de Custo</TabsTrigger>
          <TabsTrigger value="sistema" className="text-xs gap-1.5"><Settings2 className="h-3.5 w-3.5" /> Sistema</TabsTrigger>
        </TabsList>

        {/* Usuarios Tab */}
        <TabsContent value="usuarios" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Gerencie os usuários e seus perfis de acesso ao sistema.</p>
            <Button size="sm" className="h-9 text-xs" onClick={() => setSheetOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Novo Usuário
            </Button>
          </div>

          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-[11px] font-semibold">Nome</TableHead>
                    <TableHead className="text-[11px] font-semibold">E-mail</TableHead>
                    <TableHead className="text-[11px] font-semibold">Perfil</TableHead>
                    <TableHead className="text-[11px] font-semibold">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold">Último Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map(u => (
                    <TableRow key={u.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">{u.nome}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border-0 ${perfilColors[u.perfil] || "bg-muted text-muted-foreground"}`}>
                          {u.perfil}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] border-0 ${u.status === "ativo" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          {u.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.ultimoAcesso}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Centros de Custo Tab */}
        <TabsContent value="centros" className="space-y-4 mt-4">
          <p className="text-xs text-muted-foreground">Gerencie os centros de custo disponíveis no sistema.</p>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-[11px] font-semibold">Nome</TableHead>
                    <TableHead className="text-[11px] font-semibold">Código</TableHead>
                    <TableHead className="text-[11px] font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centrosCusto.map(cc => (
                    <TableRow key={cc.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">{cc.nome}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{cc.codigo}</TableCell>
                      <TableCell>
                        <Badge className="text-[10px] border-0 bg-success/15 text-success">Ativo</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/10">
                    <TableCell>
                      <Input placeholder="Nome do centro" className="h-8 text-xs" value={novoCentro.nome} onChange={e => setNovoCentro(p => ({ ...p, nome: e.target.value }))} />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="CÓDIGO" className="h-8 text-xs font-mono uppercase" value={novoCentro.codigo} onChange={e => setNovoCentro(p => ({ ...p, codigo: e.target.value.toUpperCase() }))} />
                    </TableCell>
                    <TableCell>
                      <Button size="sm" className="h-8 text-xs" disabled={!novoCentro.nome || !novoCentro.codigo} onClick={() => {
                        setCentrosCusto(prev => [...prev, { id: prev.length + 1, nome: novoCentro.nome, codigo: novoCentro.codigo, ativo: true }]);
                        setNovoCentro({ nome: "", codigo: "" });
                        toast({ title: "✅ Centro de Custo adicionado", description: `${novoCentro.nome} cadastrado.` });
                      }}>
                        <Plus className="h-3 w-3 mr-1" /> Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Sistema Tab */}
        <TabsContent value="sistema" className="space-y-4 mt-4">
          <p className="text-xs text-muted-foreground">Configurações gerais do sistema SIGCE.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Bell, title: "Notificações", desc: "Alertas por e-mail e WhatsApp para novos pedidos, aprovações e entregas.", active: true },
              { icon: Tag, title: "Centros de Custo", desc: "SEDE, CENTRAL, LOUVOR, KIDS, CRIATIVO, EVENTOS — editável pelo admin.", active: true },
              { icon: Shield, title: "Regras de Aprovação", desc: "Compras acima de R$ 500 exigem aprovação executiva. Acima de R$ 5.000, dupla aprovação.", active: true },
              { icon: GitBranch, title: "Categorias de Compra", desc: "Limpeza, Copa & Cozinha, Iluminação, Comunicação Visual, Áudio, Eventos.", active: true },
            ].map((cfg, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <cfg.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{cfg.title}</p>
                      </div>
                    </div>
                    <Switch checked={cfg.active} />
                  </div>
                  <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New User Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-sm">Novo Usuário</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome Completo</label>
              <Input className="h-9 text-xs" placeholder="Ex: Maria Silva" value={novoUsuario.nome} onChange={e => setNovoUsuario(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
              <Input className="h-9 text-xs" placeholder="Ex: maria@purafe.org" value={novoUsuario.email} onChange={e => setNovoUsuario(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Perfil de Acesso</label>
              <Select value={novoUsuario.perfil} onValueChange={v => setNovoUsuario(p => ({ ...p, perfil: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Comprador">Comprador</SelectItem>
                  <SelectItem value="Solicitante">Solicitante</SelectItem>
                  <SelectItem value="Aprovador">Aprovador</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full h-10 text-xs" onClick={handleSalvarUsuario} disabled={!novoUsuario.nome || !novoUsuario.email}>
              Salvar Usuário
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
