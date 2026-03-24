import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, CheckSquare, Landmark, Package,
  Menu, X, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PainelScreen from "@/components/sigce/PainelScreen";
import SolicitacoesScreen from "@/components/sigce/SolicitacoesScreen";
import AprovacaoScreen from "@/components/sigce/AprovacaoScreen";
import FinanceiroScreen from "@/components/sigce/FinanceiroScreen";
import EstoqueScreen from "@/components/sigce/EstoqueScreen";

type Screen = "painel" | "solicitacoes" | "aprovacao" | "financeiro" | "estoque";

const menuItems: { id: Screen; label: string; sublabel: string; icon: typeof LayoutDashboard }[] = [
  { id: "painel", label: "Painel", sublabel: "Resumo executivo", icon: LayoutDashboard },
  { id: "solicitacoes", label: "Solicitações", sublabel: "Visão do Rafael", icon: ShoppingCart },
  { id: "aprovacao", label: "Aprovação", sublabel: "Visão da Bispa", icon: CheckSquare },
  { id: "financeiro", label: "Financeiro", sublabel: "Visão da Janete", icon: Landmark },
  { id: "estoque", label: "Estoque", sublabel: "WMS", icon: Package },
];

const screenTitles: Record<Screen, string> = {
  painel: "Painel Executivo",
  solicitacoes: "Solicitações e Cotações",
  aprovacao: "Aprovação Executiva",
  financeiro: "Controladoria Financeira",
  estoque: "Gestão de Estoque",
};

const Index = () => {
  const [active, setActive] = useState<Screen>("painel");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (active) {
      case "painel": return <PainelScreen />;
      case "solicitacoes": return <SolicitacoesScreen />;
      case "aprovacao": return <AprovacaoScreen />;
      case "financeiro": return <FinanceiroScreen />;
      case "estoque": return <EstoqueScreen />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SIGCE</h1>
            <p className="text-[10px] text-sidebar-foreground/60 leading-tight mt-0.5">Sistema Integrado de Gestão<br/>de Compras e Estoque</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm ${
                active === item.id
                  ? 'bg-sidebar-accent text-white font-semibold'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.label}</p>
                <p className={`text-[10px] truncate ${active === item.id ? 'text-white/60' : 'text-sidebar-foreground/40'}`}>{item.sublabel}</p>
              </div>
              {active === item.id && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/50" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">Igreja Pura Fé • v1.0</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold truncate">{screenTitles[active]}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              RF
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default Index;
