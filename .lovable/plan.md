

# Plano: Anexos Fiscais na Controladoria (Boleto, NF, Comprovantes)

## Problema

A Controladoria não tem onde cadastrar boletos, notas fiscais e outros documentos vinculados a uma compra. Essa informação também não aparece no Financeiro nem no histórico do pedido.

## Solução

Adicionar um sistema de **anexos por pedido** na tabela de Saving da Controladoria, com drawer lateral para upload simulado de documentos. Os anexos ficam visíveis também no Financeiro.

## Mudanças

### 1. `ControladoriaScreen.tsx` — Drawer de documentos por pedido

- Transformar `savingData` em `useState` para permitir mutação
- Adicionar campo `anexos` ao modelo de dados: array de `{ tipo: "boleto" | "nf" | "comprovante" | "outro", nome: string, data: string }`
- Alguns pedidos já vêm com anexos mockados (ex: "Retiro Fazenda" com NF anexada)
- Na tabela de Saving, adicionar coluna **"Docs"** com ícone de clipe + contador de anexos
- Ao clicar na linha ou no ícone, abrir `Sheet` (drawer lateral) com:
  - Resumo do pedido (item, valor original, valor fechado, saving)
  - Seção **"Documentos Anexados"** listando os anexos existentes com ícone por tipo (FileText para NF, CreditCard para boleto, etc.), nome e data
  - Botão **"+ Anexar Documento"** que expande um mini-form inline:
    - Select de tipo: Boleto, Nota Fiscal, Comprovante de Pagamento, Outro
    - Input de nome do arquivo (simula upload, ex: "NF_001234.pdf")
    - Botão "Anexar" que adiciona ao estado local + toast de confirmação
  - Badge visual na lista: tipo do documento com cor diferenciada

### 2. `FinanceiroScreen.tsx` — Coluna de documentos visível

- Adicionar campo `anexos` ao modelo `Pagamento` (mesmo formato)
- Alguns pagamentos mockados já vêm com anexos (ex: TACC Iluminação com comprovante + NF)
- Na tabela, na coluna "Ações", além dos botões existentes, mostrar badges dos documentos anexados (ex: "NF ✓", "Boleto ✓")
- Ao clicar no botão "Comprovante" (já existente), abrir um mini-form inline ou dialog simples para simular o upload (select tipo + nome)

### 3. Consistência visual

- Usar ícones consistentes: `FileText` para NF, `CreditCard` para Boleto, `Upload` para Comprovante, `Paperclip` para Outro
- Badges com cores: NF em azul, Boleto em amarelo, Comprovante em verde
- O drawer da Controladoria mostra o histórico completo de documentos do pedido

## Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `ControladoriaScreen.tsx` | useState, coluna Docs, Sheet com upload simulado |
| `FinanceiroScreen.tsx` | Campo anexos nos dados, badges de documentos na tabela |

## O que NÃO muda

- Layout geral, KPI cards, sidebar, identidade visual
- Demais telas do sistema

