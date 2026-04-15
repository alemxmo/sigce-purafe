

# Plano: Documento de Caso de Uso Estruturado — SIG3B PURA FÉ

## Objetivo

Gerar um documento DOCX profissional e detalhado, no formato de **Caso de Uso Estruturado para Validação Final do Cliente**, cobrindo todos os módulos do SIG3B — PURA FÉ. O documento será entregue como arquivo `.docx` em `/mnt/documents/`.

## Estrutura do Documento

1. **Capa** — Logo textual, nome do sistema, data, versão, classificação "Documento de Validação Final"
2. **Sumário Executivo** — Visão geral do projeto, público-alvo, objetivo estratégico
3. **Glossário** — Termos-chave (Centro de Custo, NF, Saving, WMS, etc.)
4. **Fluxo Geral do Sistema** — Descrição textual do pipeline linear (7 etapas)
5. **Módulos Detalhados** (um capítulo por módulo, cada um com):
   - Objetivo do módulo
   - Atores envolvidos (perfis de acesso)
   - Casos de uso numerados (UC-XX) com pré-condições, fluxo principal, fluxos alternativos e pós-condições
   - Regras de negócio associadas (RN-XX)
   - Campos e dados relevantes

   **Módulos cobertos:**
   - M1: Dashboard Executivo
   - M2: Central de Solicitações + Nova Solicitação
   - M3: Central de Compras (Mesa do Comprador)
   - M4: Base de Fornecedores (inclui autocadastro via link)
   - M5: Comparador de Cotações
   - M6: Aprovação Executiva (PDF, link seguro, WhatsApp)
   - M7: Complementação de Documentos (pós-aprovação)
   - M8: Controladoria e Saving (despesas recorrentes + lançamentos diretos)
   - M9: Pagamentos e Financeiro
   - M10: Registro Rápido — Extrato Detalhado (cartão de crédito)
   - M11: Logística e Recebimento
   - M12: Gestão de Estoque (WMS)
   - M13: Configurações do Sistema

6. **Integrações e Comunicação** — WhatsApp Bridge, links externos, portal do fornecedor
7. **Perfis de Acesso e Permissões** — Matriz de perfis vs. módulos
8. **Considerações Técnicas** — Stack, arquitetura frontend, dados mockados
9. **Termo de Validação** — Bloco para assinatura do cliente

## Detalhes Técnicos

- Gerado via `docx-js` (npm `docx`)
- Formatação profissional: cabeçalhos, tabelas, numeração, espaçamento
- Idioma: PT-BR
- Saída: `/mnt/documents/SIG3B_PuraFe_CasoDeUso_v1.docx`
- QA: converter para imagens e inspecionar antes de entregar

## Arquivos do projeto

Nenhum arquivo do codebase será modificado. Apenas um script temporário em `/tmp/` para gerar o DOCX.
