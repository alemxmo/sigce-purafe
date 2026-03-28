

# Refatoração: Fluxo Estruturado na Central de Compras

## Problema Identificado

O drawer lateral da Central de Compras tem 9 botões soltos em "Ações Rápidas" — todos disparam apenas um toast genérico. Não há formulários, não há fluxo, não há conexão entre telas. O mockup não demonstra que o sistema guia o operador passo a passo.

## Solução

Substituir o bloco de "Ações Rápidas" por um sistema de **Próximo Passo contextual** baseado no status do pedido + mini-formulários inline para cada ação. Isso transforma o drawer de uma lista de botões numa experiência de workflow real.

## Mudanças no MesaRafaelScreen.tsx

### 1. Ações contextuais por status (em vez de 9 botões sempre visíveis)

Cada status mostra apenas as ações relevantes àquele estágio:

| Status | Ação principal | Formulário inline |
|--------|---------------|-------------------|
| `nova` | "Iniciar Cotação" | Select de fornecedores (da base mockada) + botão copiar msg WhatsApp + botão abrir WhatsApp |
| `em_cotacao` | "Registrar Cotação" | Mini-form: fornecedor (select), valor, prazo, frete, obs + botão salvar |
| `em_cotacao` (com cotações) | "Comparar e Avançar" | Tabela comparativa inline + botão "Enviar p/ Aprovação" |
| `aguardando_complemento` | "Devolver ao Solicitante" | Textarea com motivo + botão enviar |
| `aguardando_aprovacao` | "Registrar Aprovação" | Toggle aprovado/recusado + campo observação |
| `aguardando_pagamento` | "Encaminhar Pagamento" | Dados bancários do fornecedor + Pix copiável + botão confirmar |
| `em_logistica` | "Registrar Recebimento" | Checkbox conferência + campo divergência + botão finalizar |

### 2. Seção "Fornecedores vinculados" no drawer

Abaixo do resumo do pedido, adicionar uma seção que mostra fornecedores já vinculados a esse pedido (com cotação registrada) e um botão "+ Adicionar Fornecedor" que abre um select com a base de fornecedores mockados.

### 3. Stepper visual de progresso

Substituir a barra de checklist por um stepper horizontal no topo do drawer mostrando as etapas do fluxo com o estágio atual destacado:

```text
Solicitação → Cotação → Aprovação → Pagamento → Logística → Entregue
     ●────────●────────○────────○────────○────────○
```

### 4. Estado local para simular fluxo

Usar `useState` para gerenciar a lista de pedidos de forma mutável, permitindo que ações realmente movam cards entre colunas do Kanban durante a apresentação.

### 5. Ação secundária sempre disponível

Manter como ações secundárias (texto pequeno, sem destaque) apenas: "Devolver p/ Ajuste" e "Adicionar Comentário" — disponíveis em qualquer status.

## Arquivos modificados

- **`src/components/sigce/MesaRafaelScreen.tsx`** — Refatoração completa do drawer: stepper, ações contextuais com mini-forms, fornecedores vinculados, estado mutável dos pedidos
- **`src/pages/Index.tsx`** — Sem alteração

## O que NÃO muda

- Kanban board e cards (preservados)
- Layout geral e sidebar
- Visual identity e cores
- Demais telas do sistema

