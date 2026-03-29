

# Plano de Evolução — SIGCE Pura Fé

## Resumo das 6 mudanças solicitadas

1. **Formulário de cadastro de fornecedores** na tela Base de Fornecedores
2. **Fluxo de "Solicitar Complemento"** nas Novas Solicitações (devolver ao solicitante)
3. **Central de Compras como CRM horizontal** com colunas e scroll lateral
4. **Cotações redesenhadas** — enviar TODOS os orçamentos para aprovação (sem pré-seleção) + reformular tela de Aprovação para mostrar cotações detalhadas
5. **Menu de Configurações** com controle de usuários e permissões
6. **Renomear para "SIGCE — PURA FÉ"** na sidebar e header

---

## 1. Formulário de Cadastro de Fornecedores (`FornecedoresScreen.tsx`)

- Adicionar botão "+ Novo Fornecedor" ao lado da busca
- Ao clicar, abrir um `Sheet` (drawer lateral) com formulário completo:
  - Nome Fantasia, Razão Social, CNPJ, Categoria (select), Telefone, WhatsApp, Cidade, Lead Time, Banco, Pix, Score inicial
  - Toggle "Fornecedor Preferencial"
  - Botão "Salvar Fornecedor" que adiciona ao estado local e exibe toast de confirmação
- O novo fornecedor aparece imediatamente na tabela

## 2. Fluxo de Complemento (`SolicitacoesScreen.tsx`)

- Na tabela de solicitações, ao abrir o detalhe (Sheet) de uma solicitação com status `nova`:
  - Adicionar seção "Ações" com botão **"Solicitar Complemento"**
  - Ao clicar, exibir textarea inline para descrever quais informações faltam
  - Botão "Enviar Solicitação de Complemento" muda o status para `devolvida` e registra na timeline
  - O card na tabela mostra badge "Devolvida" em vermelho
- Solicitações com status `devolvida` mostram ação "Registrar Complemento Recebido" que retorna para `nova`
- Transformar dados de `solicitacoes` em `useState` para permitir mutação local

## 3. Central de Compras — Layout CRM Horizontal (`MesaRafaelScreen.tsx`)

- Substituir o grid responsivo (`grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6`) por um container `flex` com `overflow-x-auto` e scroll horizontal
- Cada coluna tem largura fixa (`min-w-[280px] w-[280px]`) para garantir visibilidade consistente
- Todas as 6 colunas visíveis com rolagem horizontal suave, estilo pipeline/CRM
- Cards dentro de cada coluna continuam com scroll vertical (`max-h-[calc(100vh-280px)] overflow-y-auto`)
- Adicionar barra de resumo no topo mostrando contagem por coluna em badges horizontais

## 4. Cotações e Aprovação — Redesenho do fluxo

### `CotacoesScreen.tsx` — Remover pré-seleção
- Remover o botão "Selecionar" de cada linha da tabela
- Remover lógica de `selecionado` state
- Manter tabela comparativa com destaque do melhor preço (badge "Melhor Preço")
- Botão principal: **"Enviar Todas as Cotações para Aprovação"** — envia o pacote completo
- Toast confirma: "Cotações enviadas para aprovação executiva"

### `AprovacaoScreen.tsx` — Reformular com visão de cotações
- Cada card de aprovação agora inclui seção **"Cotações Recebidas"** com tabela comparativa inline:
  - Fornecedor, Valor Total, Frete, Prazo, Pagamento, Obs
  - Badge "Melhor Preço" no mais barato
  - Badge "Mais Rápido" no menor prazo
- Adicionar campo de seleção: ao aprovar, o aprovador **seleciona qual fornecedor** via radio buttons dentro da tabela de cotações
- Botão "Aprovar" só fica habilitado após selecionar um fornecedor
- Saving calculado automaticamente: diferença entre o fornecedor selecionado e o mais caro

## 5. Menu de Configurações (`ConfiguracoesScreen.tsx` — novo arquivo)

- Adicionar item "Configurações" no final da sidebar (grupo "Sistema"), com ícone `Settings`
- Tela com 2 abas (Tabs):
  - **Usuários**: tabela mockada com colunas Nome, E-mail, Perfil (Admin/Comprador/Solicitante/Aprovador/Financeiro), Status (Ativo/Inativo), Último Acesso
  - **Sistema**: cards de configuração mockados (Notificações, Centros de Custo, Categorias, Regras de Aprovação)
- Botão "+ Novo Usuário" com drawer de cadastro simulado

## 6. Renomear para "SIGCE — PURA FÉ" (`Index.tsx`)

- Sidebar: `SIGCE` → `SIGCE — PURA FÉ`
- Subtítulo mantém "Sistema Integrado de Gestão de Compras e Estoque"
- Footer da sidebar: "Pura Fé • SIGCE v2.0"

---

## Arquivos modificados

| Arquivo | Tipo de mudança |
|---------|----------------|
| `Index.tsx` | Renomear título, adicionar rota `configuracoes`, adicionar menu item |
| `FornecedoresScreen.tsx` | Adicionar formulário de cadastro via Sheet |
| `SolicitacoesScreen.tsx` | Estado mutável, ações de complemento no drawer |
| `MesaRafaelScreen.tsx` | Layout flex horizontal com scroll |
| `CotacoesScreen.tsx` | Remover seleção individual, enviar todas |
| `AprovacaoScreen.tsx` | Tabela de cotações inline, seleção do fornecedor pelo aprovador |
| `ConfiguracoesScreen.tsx` | Novo arquivo — Usuários e configurações do sistema |

