# SIGCE — Sistema Integrado de Gestão de Compras e Estoque

### Protótipo Funcional para Igreja Pura Fé

## Visão Geral

Um mini-ERP operacional com navegação por sidebar, dados mockados realistas em português, microinterações funcionais e visual premium de SaaS financeiro. Cor base: **#000F9F** (azul institucional), com verde esmeralda para CTAs/aprovações, amarelo para alertas e vermelho para urgências.

---

## Estrutura e Layout

- **Sidebar fixa** com logo SIGCE, navegação entre 5 telas (Painel, Solicitações, Aprovação, Financeiro, Estoque), ícones Lucide, item ativo destacado, colapsável
- **Header contextual** com título da tela ativa e contexto do usuário
- **Área principal dinâmica** controlada por `useState`
- Layout responsivo com atenção especial à tela de Aprovação (mobile-first)

---

## Telas

### 1. Painel (Dashboard Executivo)

- KPI cards: Solicitações abertas, Aprovações pendentes, Saving acumulado, Contas a pagar hoje, Itens estoque baixo
- Card destaque "Economia Gerada" em verde
- Mini fluxo operacional visual (solicitação → estoque)
- Lista de atividades recentes
- Alertas importantes

### 2. Solicitações (Visão Rafael)

- Kanban board com 3 colunas: Aguardando Cotação, Em Negociação, Aguardando Aprovação
- Card 1: Líquido Haze (Caslu, Iluminação, urgente) em "Aguardando Cotação"
- Card 2: Kit Café (Pr. Rafael Diniz, Central de Atendimento, R$ 389,61) em "Em Negociação"
- Contadores por coluna, badges de urgência, busca mockada, botão "Ver detalhes"

### 3. Aprovação (Visão Bispa) — Mobile-first

- Card de aprovação: Retiro Fazenda Pura Fé, R$ 6.250 → R$ 6.000, saving R$ 250 em destaque verde
- Botões grandes: Aprovar (verde), Recusar (vermelho), Pedir Detalhes
- Ao clicar "Aprovar": card muda para estado aprovado, toast de sucesso, botões desabilitados
- Hierarquia de leitura ultra-clara, experiência de 1 clique

### 4. Financeiro (Visão Janete)

- Tabela enterprise "Contas a Pagar" com 3 linhas mockadas (Dousystem, IPTU, TACC)
- Filtros funcionais por Vencimento e Centro de Custo via `useState`
- Cards resumo: Total pendente, Total liberado, Vencimentos críticos
- Badges de status, destaque visual para vencimentos "Hoje"

### 5. Estoque (WMS)

- Tabela/lista com 4 itens mockados (Camisetas, Pilhas, Copos, Livros)
- Status visual: Adequado (verde), Alerta (amarelo), Comprar (vermelho)
- Barras visuais de nível de estoque
- Cards resumo: Total SKUs, itens adequados, em alerta, para compra

---

## Design System

- Paleta: fundo claro (#F8FAFC), sidebar azul escuro (#000F9F), verde esmeralda CTAs, amarelo alertas, vermelho urgências
- Cards com sombra suave, bordas 2xl
- Tipografia forte com hierarquia clara
- Badges bem resolvidas, ícones Lucide usados com parcimônia
- Hover states, transições suaves, toast notifications
- Todo conteúdo em português BR  
  
.....  
Atue como um Engenheiro Frontend Sênior + UI/UX Designer Especialista em Lovable, com padrão premium de produto SaaS, obsessão por clareza visual, hierarquia de informação, experiência do usuário, responsividade e acabamento impecável.
  Sua missão é criar um protótipo funcional de alto impacto visual para o sistema:
  SIGCE — Sistema Integrado de Gestão de Compras e Estoque
  Projeto para a Igreja Pura Fé
  IMPORTANTE:
  - Quero um frontend renderizável de primeira.
  - Não quero wireframe simplificado.
  - Não quero backend real.
  - Não quero textos genéricos ou lorem ipsum.
  - Não quero uma tela “bonita porém vazia”.
  - Quero um protótipo funcional, convincente, navegável, com sensação real de produto pronto para apresentação executiva.
  - Gere a aplicação já com dados mockados diretamente no código.
  - Entregue uma UI que pareça um mini-ERP moderno e confiável.
  - O protótipo deve comunicar governança, organização, agilidade e inteligência operacional.
  ==================================================
  1. CONTEXTO ESTRATÉGICO DO PRODUTO
  ==================================================
  O SIGCE nasce para resolver um fluxo de compras e estoque hoje totalmente manual, disperso entre WhatsApp, planilhas e comunicação verbal.
  Problemas centrais que a interface precisa transmitir e resolver:
  - Solicitações chegam incompletas
  - Rafael centraliza a operação de compras
  - Aprovação acontece sem contexto
  - Financeiro trabalha com pouca rastreabilidade
  - Saving de negociação não fica claro
  - Estoque é pouco previsível
  - Falta visão consolidada por centro de custo/ministério
  - Falta um fluxo linear e auditável
  O produto precisa representar de forma clara este novo fluxo operacional:
  1. Nova Solicitação
  2. Em Cotação
  3. Aguardando Aprovação
  4. Negociação Final
  5. Aguardando Pagamento
  6. Em Trânsito
  7. Entregue e Estoque Atualizado
  Personas do sistema:
  - Rafael: comprador, gestor das solicitações e cotações
  - Bispa: aprovadora executiva, precisa de experiência rápida e clara
  - Janete: controladoria/negociação/saving/contas a pagar
  - Michele: execução financeira/pagamentos
  - Cleiton: recebimento e atualização de estoque
  O design deve comunicar:
  - 1-clique approval
  - rastreabilidade
  - saving visível
  - operação organizada
  - visão executiva
  - sensação de produto que reduz caos e aumenta controle
  ==================================================
  2. STACK E PADRÃO TÉCNICO
  ==================================================
  Use:
  - React
  - Vite
  - Tailwind CSS
  - Lucide Icons
  - componentes no estilo Shadcn UI
  - Cards
  - Tables
  - Badges
  - Tabs
  - Dialogs
  - Selects
  - Inputs
  - Buttons
  - Toast notifications
  Se necessário, componha tudo em um único arquivo principal bem organizado, mas com estrutura limpa e escalável.
  Pode criar pequenos componentes internos reutilizáveis.
  Use estado local com useState para navegação e interações.
  Não criar integração externa.
  Tudo mockado.
  ==================================================
  3. DIRETRIZ VISUAL
  ==================================================
  Quero um visual de SaaS financeiro / ERP moderno:
  - clean
  - elegante
  - alta legibilidade
  - excelente densidade informacional
  - layout profissional
  - sensação de produto confiável e institucional
  Paleta:
  - base clara com branco, cinzas suaves e cinzas médios
  - destaques e CTAs em Verde Esmeralda
  - verde deve representar aprovação, saving, avanço e crescimento
  - amarelo para atenção
  - vermelho para pendência crítica ou compra urgente
  Estética:
  - sidebar elegante
  - topo com título da área e contexto
  - cards com sombra suave
  - bordas arredondadas 2xl
  - boa separação entre blocos
  - badges muito bem resolvidas
  - tipografia forte e hierarquia clara
  - ícones Lucide usados com inteligência, sem exagero
  - componentes com cara de sistema enterprise moderno
  Quero uma experiência muito superior ao básico.
  Pense como alguém que domina:
  - product design
  - dashboard design
  - workflow systems
  - ERP UX
  - mobile-first nas telas críticas
  - apresentação executiva para tomada de decisão
  ==================================================
  4. LAYOUT PRINCIPAL
  ==================================================
  Crie um Dashboard App com:
  - Sidebar lateral fixa
  - Header superior contextual
  - Área principal dinâmica conforme menu
  - Navegação simulada por state ao clicar no menu
  Itens da Sidebar:
  - Painel
  - Solicitações (Rafael)
  - Aprovação (Bispa)
  - Financeiro (Janete)
  - Estoque
  Cada item deve ter ícone coerente.
  O item ativo precisa ficar visualmente destacado.
  ==================================================
  5. TELA 0 — PAINEL (RESUMO EXECUTIVO)
  ==================================================
  Além das telas solicitadas, crie uma tela inicial “Painel” para dar força de apresentação ao protótipo.
  Ela deve conter cards executivos com indicadores mockados, coerentes com o contexto do projeto.
  Sugestão de KPIs:
  - Solicitações abertas
  - Aprovações pendentes
  - Saving acumulado no mês
  - Contas a pagar hoje
  - Itens com estoque baixo
  Também inclua:
  - uma pequena visão do fluxo operacional
  - uma lista de atividades recentes
  - uma área com alertas importantes
  - um card destacando “Economia gerada” ou “Saving”
  - um card com “Compras aguardando aprovação”
  Essa tela precisa causar impacto visual logo na primeira impressão.
  ==================================================
  6. TELA 1 — SOLICITAÇÕES E COTAÇÕES (VISÃO DO RAFAEL)
  ==================================================
  Crie uma experiência rica para o comprador.
  Pode ser um Kanban Board sofisticado ou uma tabela premium.
  Priorize algo visualmente impressionante e muito claro.
  Injete estes dados exatamente:
  Card/Pedido 1
  - Status: Aguardando Cotação
  - Solicitante: Caslu
  - Área: Iluminação
  - Pedido: Líquido p/ Máquina de Haze (Galão 05L)
  - Urgência: Para o próximo domingo
  Card/Pedido 2
  - Status: Em Negociação
  - Solicitante: Pr. Rafael Diniz
  - Área: Central de Atendimento
  - Pedido: Kit Café (4x Melitta, 2x Açúcar, 3000x Mexedor, 500x Copos, 2x Jarras)
  - Valor Atual: R$ 389,61
  Requisitos desejados para essa tela:
  - cards com status visual
  - prioridade/urgência destacada
  - nome do solicitante e área muito legíveis
  - indicação clara da etapa do fluxo
  - botão ou ação visual tipo “Ver detalhes”
  - campo de busca mockado
  - filtros visuais opcionais
  - contador de cards por coluna/status
  - microinterações suaves
  Se optar por Kanban:
  - crie colunas com pelo menos: Aguardando Cotação, Em Negociação, Aguardando Aprovação
  - os dois cards devem estar nas colunas corretas
  ==================================================
  7. TELA 2 — APROVAÇÃO EXECUTIVA (VISÃO DA BISPA)
  ==================================================
  Essa tela precisa ser mobile-first e impecável.
  Pense em uma experiência de decisão rápida, extremamente limpa e objetiva.
  Criar card de aprovação pendente com estes dados exatos:
  - Título: Retiro Fazenda Pura Fé
  - Valor Original: R$ 6.250,00
  - Valor Negociado: R$ 6.000,00
  - Saving: R$ 250,00
  Destaque o saving em verde de forma elegante e muito visível.
  Botões grandes:
  - Aprovar
  - Recusar
  - Pedir Detalhes
  Requisitos:
  - interface com foco em leitura rápida
  - card com ótima hierarquia
  - resumo objetivo
  - visual de aprovação premium
  - botões grandes e fáceis de tocar
  - sensação de “1 clique resolve”
  Interação obrigatória:
  - ao clicar em “Aprovar”, alterar o status do card para aprovado
  - exibir toast notification de sucesso
  - refletir visualmente o novo estado do card
  - idealmente desabilitar os botões após aprovação ou transformar o card em “Aprovado com sucesso”
  Opcional:
  - criar preview mobile dentro da própria tela, com container simulando smartphone
  - sem perder sofisticação
  ==================================================
  8. TELA 3 — CONTROLADORIA FINANCEIRA (VISÃO DA JANETE)
  ==================================================
  Crie uma tela de “Contas a Pagar” com aparência de planilha inteligente enterprise.
  Essa tela deve parecer robusta, clara e profissional.
  Crie filtros visuais funcionais por state:
  - filtro de Vencimento
  - filtro de Centro de Custo
  Insira estas linhas exatas na tabela:
  1.
  - Fornecedor: Dousystem
  - Descrição: Mat Descartável e Limpeza
  - Vencimento: Hoje
  - Valor: R$ 2.112,00
  - Categoria: Boleto
  - Centro de Custo: SEDE
  - Status: Pendente
  2.
  - Fornecedor: IPTU 2/10
  - Descrição: Imposto Territorial
  - Vencimento: Amanhã
  - Valor: R$ 4.678,38
  - Categoria: Boleto
  - Centro de Custo: CENTRAL
  - Status: Pendente
  3.
  - Fornecedor: TACC Iluminação
  - Descrição: Líquido de Haze
  - Vencimento: 09/03
  - Valor: R$ 1.180,00
  - Categoria: Pix
  - Centro de Custo: SEDE
  - Status: Liberado p/ Pagamento
  Requisitos:
  - tabela bem desenhada
  - cabeçalho forte
  - linhas elegantes
  - badges de status
  - filtros funcionando de forma local
  - visual de controladoria moderna
  - destaque de vencimentos críticos
  - destaque de pagamentos já liberados
  - sensação de previsibilidade financeira
  Inclua também:
  - card ou mini-resumo com total pendente
  - card com total liberado para pagamento
  - card com vencimentos críticos
  ==================================================
  9. TELA 4 — WMS / ESTOQUE
  ==================================================
  Crie uma tela de estoque limpa, visual e operacional.
  Injetar exatamente estes itens:
  1.
  - Item: Camisetas de Batismo
  - Qtd: 70
  - Status: Adequado
  2.
  - Item: Pilhas p/ Microfone (AA)
  - Qtd: 15
  - Status: Comprar
  3.
  - Item: Copos Papel Biodegradável 60ml
  - Qtd: 50
  - Status: Alerta
  4.
  - Item: Livros Pastorais
  - Qtd: 120
  - Status: Adequado
  Regras visuais:
  - Adequado = verde
  - Comprar = vermelho
  - Alerta = amarelo
  Quero uma lista ou tabela muito bem resolvida, com:
  - status badges
  - leitura fácil
  - percepção clara do risco de ruptura
  - talvez barra visual de nível de estoque
  - sensação de WMS básico, porém elegante
  Inclua também:
  - um pequeno resumo superior com total de SKUs monitorados
  - itens em alerta
  - itens adequados
  - itens para compra
  ==================================================
  10. COMPORTAMENTO E MICROINTERAÇÕES
  ==================================================
  Requisitos funcionais mínimos:
  - navegação entre telas usando useState
  - sidebar interativa
  - hover states elegantes
  - badges de status coerentes
  - toast notification na aprovação
  - filtros funcionando na tela financeira
  - atualização visual do card aprovado
  Caprichar em:
  - spacing
  - grid
  - responsividade
  - consistência entre telas
  - transições leves
  - acabamento final
  ==================================================
  11. TOM DE PRODUTO E CONTEÚDO
  ==================================================
  Todo o conteúdo visual deve estar em português do Brasil.
  O sistema precisa soar como:
  - organizado
  - confiável
  - objetivo
  - institucional
  - moderno
  - executivo
  Evite:
  - tom infantil
  - excesso de cores
  - excesso de decoração
  - visual genérico de template
  - excesso de texto desnecessário
  ==================================================
  12. ENTREGÁVEL
  ==================================================
  Entregue o código completo, pronto para renderização.
  Objetivo final:
  criar um protótipo funcional do SIGCE que impressione visualmente, comunique valor de negócio e demonstre claramente como o sistema organiza:
  solicitação → cotação → aprovação → financeiro → estoque
  Antes de finalizar o código, valide internamente:
  - se todas as telas existem
  - se todos os dados mockados pedidos foram inseridos corretamente
  - se o layout ficou premium
  - se a visão da Bispa está mobile-first
  - se a tabela da Janete está sofisticada
  - se a navegação funciona
  - se o toast funciona
  - se o resultado parece apresentável para stakeholders e liderança
  Quero uma entrega com padrão de produto real.