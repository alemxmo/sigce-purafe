

# Plano: Ajustes no Formulário de Solicitação + Fluxo Pós-Aprovação

## 4 mudanças solicitadas

### 1. Centro de Custo — reduzir para 3 opções + cadastro em Configurações

**`NovaSolicitacaoScreen.tsx`**: Reduzir o select de Centro de Custo para apenas:
- Sede
- Instituto Pura Fé
- Central de Atendimento

**`ConfiguracoesScreen.tsx`**: Adicionar aba **"Centros de Custo"** (ou seção dentro da aba Sistema) com tabela listando os centros cadastrados e botão "+ Novo Centro de Custo" para adicionar novos via formulário inline. Dados iniciais: os 3 acima.

### 2. Melhorar label "Data Limite"

**`NovaSolicitacaoScreen.tsx`**: Alterar de `Data Limite *` para `Prazo de Entrega *` com hint text abaixo: "Data limite para recebimento do item".

### 3. Remover campo Urgência

**`NovaSolicitacaoScreen.tsx`**: Remover o bloco do select de Urgência e o `SelectItem` correspondente. Ajustar o grid para manter alinhamento.

### 4. Fluxo pós-aprovação: retorno para Compras antes da Controladoria

Após a aprovação executiva, a solicitação não vai direto para pagamento — ela volta para Compras para que o comprador possa:
- Anexar NF do fornecedor
- Registrar observações de entrega negociadas
- Só então encaminhar para a Controladoria

**`AprovacaoScreen.tsx`**: Após aprovar, o texto muda de "Encaminhado para pagamento" para **"Devolvido para Compras — aguardando NF e dados de entrega"**.

**`MesaRafaelScreen.tsx`**:
- Adicionar novo status ao pipeline: `aprovada_retorno` (entre "Aguardando Aprovação" e "Aguardando Pagamento")
- Nova coluna no CRM: **"Aprovado — Complementar Docs"** com cor verde clara
- Ao abrir o drawer de um pedido nesse status, exibir:
  - Badge "Aprovado pela liderança" em verde
  - Fornecedor selecionado na aprovação
  - Mini-form para anexar NF (input file simulado + nome do arquivo)
  - Textarea para "Observações de entrega"
  - Botão **"Encaminhar para Controladoria"** que move o pedido para `aguardando_pagamento`

---

## Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `NovaSolicitacaoScreen.tsx` | Centro de Custo com 3 opções, label "Prazo de Entrega", remover Urgência |
| `ConfiguracoesScreen.tsx` | Aba/seção de Centros de Custo com CRUD simples |
| `AprovacaoScreen.tsx` | Texto pós-aprovação atualizado para "Devolvido para Compras" |
| `MesaRafaelScreen.tsx` | Novo status `aprovada_retorno`, nova coluna no CRM, drawer com form de NF + obs |

