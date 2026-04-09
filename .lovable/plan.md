

# Plano de Evolução — 6 Melhorias no SIGCE Pura Fé

## 1. Link de Autocadastro para Fornecedores + campos Website/Redes Sociais

**`FornecedoresScreen.tsx`**:
- Adicionar campos `website` e `redesSociais` à interface `Fornecedor` e ao formulário de cadastro
- Adicionar campo `statusCadastro: "ativo" | "pendente"` para diferenciar fornecedores que se autocadastraram
- Botão **"Gerar Link de Cadastro"** que gera um token simulado e exibe um link copiável + botão WhatsApp
- Fornecedores com `statusCadastro: "pendente"` aparecem com badge amarelo "Pendente Aprovação" na tabela
- No drawer de detalhes, exibir website e redes sociais com links clicáveis

## 2. Remover Centro de Custo da mensagem WhatsApp

**`MesaRafaelScreen.tsx`**: Na função que monta a mensagem de WhatsApp para cotação, remover a linha `🏢 *Centro de Custo:*` do template.

## 3. PDF de Aprovação Executiva com resumo + cotações

**`AprovacaoScreen.tsx`**:
- Botão **"Gerar PDF para Aprovação"** em cada card
- Simular a geração criando um preview visual na tela (componente printável) com:
  - Folha de rosto: saudação, solicitante, descrição da obra, área, orçamentos listados com valores, observação do comprador, forma de pagamento
  - Formato inspirado no exemplo dado pelo usuário (texto humanizado, lista de orçamentos, obs sobre fornecedor)
- Usar `window.print()` ou gerar via canvas para simular o PDF no mockup

## 4. Link Seguro de Aprovação Direta

**`AprovacaoScreen.tsx`**:
- Botão **"Gerar Link de Aprovação"** que cria um token único simulado
- Exibir o link em um dialog copiável com instruções: "Compartilhe este link com a liderança para aprovação direta, sem necessidade de login no sistema"
- Botão de copiar + botão de enviar via WhatsApp
- Substituir o bloco atual "Aprovação via WhatsApp" por esta abordagem mais limpa

## 5. Link para Fornecedor Aprovado atualizar cadastro + anexar NF

**`MesaRafaelScreen.tsx`** (coluna `aprovada_retorno`):
- Quando o pedido está no status `aprovada_retorno`, adicionar botão **"Enviar Link ao Fornecedor"**
- O link permite ao fornecedor atualizar dados bancários (Banco/Ag/CC PJ + Chave Pix) e anexar NF
- Observação visual: "Dados bancários (Banco, Ag, CC PJ) e Chave Pix devem constar na NF"
- Opção de **"Encaminhar sem NF"** com tooltip: "Alguns fornecedores encaminham a NF após o pagamento"
- Manter o botão "Encaminhar para Controladoria" funcional em ambos os cenários (com ou sem NF)

## 6. Módulo Completo de Controle de Estoque

**`EstoqueScreen.tsx`** — Reescrever com funcionalidades completas:
- Converter dados para `useState` para permitir CRUD
- **Cadastro de itens**: Sheet com formulário (Nome, Categoria, Local, Estoque Mínimo, Ponto de Reposição, Unidade de Medida)
- **Registro de Entradas**: Formulário para registrar recebimentos (Item, Quantidade, Fornecedor, Data, NF)
- **Registro de Saídas**: Formulário para dar baixa (Item, Quantidade, Destino/Ministério, Responsável)
- **Movimentações recentes**: Tabela unificada de entradas e saídas com filtro por tipo
- **Busca e filtros**: Por categoria, status, local
- **Inventário**: Badge de "Último inventário: dd/mm" e botão para registrar contagem
- Manter KPI cards e visual de nível (barra de progresso)

## Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `FornecedoresScreen.tsx` | Website, redes sociais, link autocadastro, status pendente |
| `MesaRafaelScreen.tsx` | Remover centro de custo do WhatsApp, link para fornecedor aprovado |
| `AprovacaoScreen.tsx` | PDF de aprovação, link seguro de aprovação direta |
| `EstoqueScreen.tsx` | Reescrita com CRUD completo, entradas, saídas, inventário |

## O que NÃO muda
- Sidebar, layout geral, identidade visual
- Controladoria, Financeiro, Configurações, Dashboard
- Fluxo de cotações e Central de Compras (CRM)

