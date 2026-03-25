import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, Briefcase, Users, Scale,
  CheckSquare, TrendingDown, Landmark, Truck, Package, BarChart3,
  Menu, X, ChevronRight, Plus
} from "lucide-react";
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

type Screen =
  | "dashboard" | "solicitacoes" | "nova_solicitacao" | "mesa_rafael"
  | "fornecedores" | "cotacoes" | "aprovacao" | "controladoria"
  | "financeiro" | "logistica" | "estoque";

const menuItems: { id: Screen; label: string; icon: typeof LayoutDashboard; group?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "solicitacoes", label: "Solicitações", icon: ClipboardList, group: "Operação" },
  { id: "mesa_rafael", label: "Mesa do Rafael", icon: Briefcase, group: "Operação" },
  { id: "fornecedores", label: "Fornecedores", icon: Users, group: "Compras" },
  { id: "cotacoes", label: "Cotações", icon: Scale, group: "Compras" },
  { id: "aprovacao", label: "Aprovação", icon: CheckSquare, group: "Decisão" },
  { id: "controladoria", label: "Controladoria", icon: TrendingDown, group: "Financeiro" },
  { id: "financeiro", label: "Pagamentos", icon: Landmark, group: "Financeiro" },
  { id: "logistica", label: "Logística", icon: Truck, group: "Entrega" },
  { id: "estoque", label: "Estoque", icon: Package, group: "Entrega" },
];

const screenTitles: Record<Screen, string> = {
  dashboard: "Dashboard Executivo",
  solicitacoes: "Central de Solicitações",
  nova_solicitacao: "Nova Solicitação",
  mesa_rafael: "Mesa Operacional — Rafael",
  fornecedores: "Base de Fornecedores",
  cotacoes: "Comparador de Cotações",
  aprovacao: "Aprovação Executiva",
  controladoria: "Controladoria & Saving",
  financeiro: "Financeiro & Pagamentos",
  logistica: "Logística & Recebimento",
  estoque: "Gestão de Estoque",
};

const Index = () => {
  const [active, setActive] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (screen: Screen) => {
    setActive(screen);
    setSidebarOpen(false);
  };

  const renderScreen = () => {
    switch (active) {
      case "dashboard": return <DashboardScreen onNavigate={navigate} />;
      case "solicitacoes": return <SolicitacoesScreen onNavigate={navigate} />;
      case "nova_solicitacao": return <NovaSolicitacaoScreen onNavigate={navigate} />;
      case "mesa_rafael": return <MesaRafaelScreen />;
      case "fornecedores": return <FornecedoresScreen />;
      case "cotacoes": return <CotacoesScreen />;
      case "aprovacao": return <AprovacaoScreen />;
      case "controladoria": return <ControladoriaScreen />;
      case "financeiro": return <FinanceiroScreen />;
      case "logistica": return <LogisticaScreen />;
      case "estoque": return <EstoqueScreen />;
    }
  };

  // Group menu items
  const groups = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    const g = item.group || "";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between border-b border-sidebar-border">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SIGCE</h1>
            <p className="text-[9px] text-sidebar-foreground/50 leading-tight mt-0.5">Gestão de Compras e Estoque</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-white h-8 w-8" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              {group && <p className="text-[9px] uppercase tracking-widest text-sidebar-foreground/30 font-semibold px-3 pt-3 pb-1">{group}</p>}
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-[13px] ${
                    active === item.id
                      ? 'bg-sidebar-accent text-white font-semibold'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {active === item.id && <ChevronRight className="h-3 w-3 shrink-0 text-white/40 ml-auto" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <p className="text-[9px] text-sidebar-foreground/30 text-center">Igreja Pura Fé • SIGCE v2.0</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-card/90 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{screenTitles[active]}</h2>
          </div>
          {active === "solicitacoes" && (
            <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90" onClick={() => navigate("nova_solicitacao")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Nova Solicitação
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
              RC
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default Index;
