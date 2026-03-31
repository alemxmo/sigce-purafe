

# Cadastro de Despesas Diretas na Controladoria

## Problema

Nem todo pagamento nasce de uma solicitação de compras. Despesas como IPTU, contas de luz, internet, seguros e taxas são lançadas diretamente pela Controladoria. Hoje a seção "Despesas Recorrentes" é apenas uma lista estática sem interação.

## Solução

Transformar a seção de Despesas Recorrentes em uma área gerenciável com formulário de cadastro, e adicionar uma nova seção de **Despesas Avulsas** para lançamentos pontuais que não vêm do fluxo de compras.

## Mudanças em `ControladoriaScreen.tsx`

### 1. Despesas Recorrentes — tornar editável
- Converter `despesasRecorrentes` em `useState`
- Adicionar botão **"+ Nova Despesa Recorrente"** no header da seção
- Ao clicar, abrir mini-form inline com: Descrição, Valor, Frequência (Mensal/Bimestral/Anual), Próximo Vencimento, Centro de Custo, Categoria (IPTU/Utilidades/Serviços/Seguros/Outros)
- Cada item da lista ganha ícone de clique para abrir drawer com detalhes e opção de anexar documentos (boleto, NF)

### 2. Nova seção: Lançamentos Diretos (Despesas Avulsas)
- Tabela abaixo das Despesas Recorrentes para pagamentos pontuais cadastrados pela Controladoria (ex: multa, taxa cartorial, reparo emergencial)
- Dados mockados iniciais: 2-3 lançamentos avulsos
- Botão **"+ Novo Lançamento"** com Sheet lateral contendo:
  - Descrição, Fornecedor/Beneficiário, Valor, Vencimento, Centro de Custo, Categoria, Forma de Pagamento, Chave Pix/Dados Bancários
  - Seção de anexos (mesmo padrão já existente: boleto, NF, comprovante)
- Ao salvar, o lançamento aparece na tabela e também fica visível no Financeiro

### 3. Integração com Financeiro
- Os lançamentos diretos criados na Controladoria devem ter um campo `origem: "controladoria"` para diferenciá-los dos que vêm do fluxo de compras
- No `FinanceiroScreen.tsx`, adicionar badge "Direto" para pagamentos com essa origem, ao lado dos badges de documentos existentes

## Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `ControladoriaScreen.tsx` | useState para recorrentes, form de cadastro, seção Lançamentos Diretos com Sheet |
| `FinanceiroScreen.tsx` | Badge "Direto" para pagamentos de origem controladoria |

## O que NÃO muda
- KPI cards, tabela de Saving, layout geral, demais telas

