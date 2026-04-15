import { useState } from "react";
import { LayoutDashboard, ShoppingCart, CheckSquare, Landmark, Package, Menu, X, ChevronRight, ShoppingBag, Users, BarChart3, Truck, ClipboardList, FileSpreadsheet, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardScreen from "@/components/sigce/DashboardScreen";
import SolicitacoesScreen from "@/components/sigce/SolicitacoesScreen";
import NovaSolicitacaoScreen from "@/components/sigce/NovaSolicitacaoScreen";
import MesaRafaelScreen from "@/components/sigce/MesaRafaelScreen";
import FornecedoresScreen from "@/components/sigce/FornecedoresScreen";
import CotacoesScreen from "@/components/sigce/CotacoesScreen";
import AprovacaoScreen from "@/components/sigce/AprovacaoScreen";
import ControladoriaScreen from "@/components/sigce/ControladoriaScreen";
import FinanceiroScreen from "@/components/sigce/FinanceiroScreen";
import LogisticaScreen from "@/components/sigce/LogisticaScreen";
import EstoqueScreen from "@/components/sigce/EstoqueScreen";
import ConfiguracoesScreen from "@/components/sigce/ConfiguracoesScreen";
import RegistroRapidoScreen from "@/components/sigce/RegistroRapidoScreen";

type Screen = "dashboard" | "solicitacoes" | "nova_solicitacao" | "central_compras" | "fornecedores" | "cotacoes" | "aprovacao" | "controladoria" | "financeiro" | "logistica" | "estoque" | "registro_rapido" | "configuracoes";

interface MenuItem {
  id: Screen;
  label: string;
  sublabel: string;
  icon: typeof LayoutDashboard;
  group?: string;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", sublabel: "Resumo executivo", icon: LayoutDashboard, group: "Visão Geral" },
  { id: "solicitacoes", label: "Solicitações", sublabel: "Entrada de pedidos", icon: ClipboardList, group: "Operação" },
  { id: "central_compras", label: "Central de Compras", sublabel: "Workspace operacional", icon: ShoppingBag, group: "Operação" },
  { id: "fornecedores", label: "Fornecedores", sublabel: "Base cadastral", icon: Users, group: "Compras" },
  { id: "cotacoes", label: "Cotações", sublabel: "Comparador de preços", icon: BarChart3, group: "Compras" },
  { id: "aprovacao", label: "Aprovação", sublabel: "Aprovação executiva", icon: CheckSquare, group: "Decisão" },
  { id: "controladoria", label: "Controladoria", sublabel: "Saving e negociação", icon: FileSpreadsheet, group: "Financeiro" },
  { id: "financeiro", label: "Pagamentos", sublabel: "Contas a pagar", icon: Landmark, group: "Financeiro" },
  { id: "logistica", label: "Logística", sublabel: "Entregas e recebimento", icon: Truck, group: "Entrega" },
  { id: "estoque", label: "Estoque", sublabel: "Controle de itens", icon: Package, group: "Entrega" },
  { id: "registro_rapido", label: "Registro Rápido", sublabel: "Despesas diretas", icon: CreditCard, group: "Financeiro" },
  { id: "configuracoes", label: "Configurações", sublabel: "Usuários e sistema", icon: Settings, group: "Sistema" },
];

const screenTitles: Record<Screen, string> = {
  dashboard: "Dashboard Executivo",
  solicitacoes: "Central de Solicitações",
  nova_solicitacao: "Nova Solicitação",
  central_compras: "Central de Compras",
  fornecedores: "Base de Fornecedores",
  cotacoes: "Comparador de Cotações",
  aprovacao: "Aprovação Executiva",
  controladoria: "Controladoria e Saving",
  financeiro: "Pagamentos e Financeiro",
  logistica: "Logística e Recebimento",
  estoque: "Gestão de Estoque",
  registro_rapido: "Registro Rápido — Extrato Detalhado",
  configuracoes: "Configurações do Sistema",
};

const Index = () => {
  const [active, setActive] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (screen: string) => setActive(screen as Screen);

  const renderScreen = () => {
    switch (active) {
      case "dashboard": return <DashboardScreen onNavigate={navigate} />;
      case "solicitacoes": return <SolicitacoesScreen onNavigate={navigate} />;
      case "nova_solicitacao": return <NovaSolicitacaoScreen onNavigate={navigate} />;
      case "central_compras": return <MesaRafaelScreen />;
      case "fornecedores": return <FornecedoresScreen />;
      case "cotacoes": return <CotacoesScreen />;
      case "aprovacao": return <AprovacaoScreen />;
      case "controladoria": return <ControladoriaScreen />;
      case "financeiro": return <FinanceiroScreen />;
      case "logistica": return <LogisticaScreen />;
      case "estoque": return <EstoqueScreen />;
      case "configuracoes": return <ConfiguracoesScreen />;
    }
  };

  const groups = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const g = item.group || "Outros";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-5 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SIGCE — PURA FÉ</h1>
            <p className="text-[10px] text-sidebar-foreground/60 leading-tight mt-0.5">
              Sistema Integrado de Gestão
              <br />de Compras e Estoque
            </p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-4 pb-4">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <p className="text-[9px] font-semibold text-sidebar-foreground/40 uppercase tracking-widest px-3 mb-1.5">{group}</p>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm ${
                      active === item.id
                        ? "bg-sidebar-accent text-white font-semibold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[13px]">{item.label}</p>
                    </div>
                    {active === item.id && <ChevronRight className="h-3 w-3 shrink-0 text-white/50" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">Pura Fé • SIGCE v2.0</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold truncate">{screenTitles[active]}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              PF
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{renderScreen()}</main>
      </div>
    </div>
  );
};

export default Index;
