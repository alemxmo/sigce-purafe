

# Plano: Registro Rápido de Despesas com Cartão de Crédito + Extrato Detalhado

## Problema

Hoje o Rafael compra itens com o cartão de crédito da igreja (já aprovados verbalmente pela Bispa) e precisa guardar pilhas de papéis para controle manual. Não existe um caminho rápido no sistema para registrar essas despesas sem passar pelo fluxo completo de cotação/aprovação/pagamento. O mesmo vale para despesas rotineiras (abastecimento, estacionamento) que não precisam de aprovação prévia.

As imagens enviadas mostram o **Extrato Detalhado** mensal que o Rafael monta manualmente em planilha — com data, produto/serviço, valor, motivo, quem autorizou, quem comprou e link do comprovante.

## Solução

### 1. Nova tela: "Registro Rápido" (atalho no sidebar)

Um formulário simples e direto para registrar despesas já realizadas, sem passar pelo fluxo de compras:

**Campos do formulário:**
- Produto / Serviço (texto)
- Valor (R$)
- Motivo / Descrição
- Forma de Pagamento: **Cartão de Crédito** | Pix | Dinheiro | Outro
- Autorizado por (select: Bispa Vanessa, Bispo Bruno, Pr. Rafael Diniz, Rafael Cardoso)
- Comprado por (select: Rafael Cardoso, Cleiton Ramos, Pr. Rafael Diniz, Henriqueta Barra)
- Centro de Custo (Sede / Instituto / Central)
- Data da compra
- Anexar comprovante (foto/arquivo simulado)

**Ao salvar:** o registro vai direto para o Extrato Detalhado, sem passar por cotação, aprovação ou financeiro. Toast: "Despesa registrada no extrato."

### 2. Nova seção na mesma tela: "Extrato Detalhado do Mês"

Tabela inspirada na planilha que o Rafael já usa, com as mesmas colunas:
- Data | Produto/Serviço | Valor | Motivo | Autorizado por | Comprado por | Comprovante

**Funcionalidades:**
- Filtro por mês (seletor de mês/ano)
- Filtro por forma de pagamento (mostrar só "Cartão de Crédito")
- Filtro por quem comprou
- Agrupamento por dia (como na planilha original)
- Badge de comprovante: "Anexado" (verde) ou "Pendente" (amarelo)
- Dados mockados iniciais baseados nas imagens enviadas (agosto 2025)
- Totalizador no rodapé: total geral + total por forma de pagamento

### 3. Tipo de solicitação "Sem Aprovação" na Central de Compras

Para casos como abastecimento do carro (Cleito), adicionar ao fluxo existente:
- Na `MesaRafaelScreen`, quando um pedido é do tipo rotineiro (ex: abastecimento), permitir um botão **"Registrar Direto"** que pula cotação e aprovação, indo direto para anexar comprovante e registrar no extrato.
- No drawer do pedido com status `nova`, adicionar opção: **"Já foi comprado — registrar direto"** que abre o mini-form de comprovante e salva no extrato.

### 4. Integração com Financeiro e Controladoria

- Os registros rápidos ficam visíveis no `FinanceiroScreen` com badge **"Cartão"** (roxo) para despesas de cartão de crédito
- A Controladoria pode visualizar o extrato completo na aba de Lançamentos Diretos

## Arquivos

| Arquivo | Mudança |
|---------|---------|
| `RegistroRapidoScreen.tsx` | **Novo** — formulário + extrato detalhado mensal |
| `Index.tsx` | Adicionar rota/item no sidebar para "Registro Rápido" |
| `MesaRafaelScreen.tsx` | Botão "Já foi comprado — registrar direto" no drawer de pedidos novos |
| `FinanceiroScreen.tsx` | Badge "Cartão" para despesas vindas do registro rápido |

## O que NÃO muda
- Fluxo completo de compras (cotação → aprovação → pagamento)
- Controladoria, Configurações, Dashboard, Estoque
- Layout geral e identidade visual

