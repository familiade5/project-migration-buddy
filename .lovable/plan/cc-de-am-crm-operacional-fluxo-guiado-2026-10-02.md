# CC de AM — CRM operacional (fluxo guiado)

Objetivo: transformar o CC de AM de "informativo" em uma ferramenta de trabalho, onde o analista começa no Painel, cadastra o cliente (anexando documento) e segue o fluxo até "Concluído", sem precisar pular entre abas.

## 1. Painel = mesa de trabalho do analista
- No topo, um bloco grande **"Novo atendimento"** com duas opções:
  - **Anexar documento** (RG/CNH/comprovante): os dados são lidos automaticamente (nome, CPF, nascimento, endereço etc.) e preenchem o cadastro.
  - **Preencher manualmente**.
- Tela de **conferência**: o analista revisa os dados extraídos, completa telefone, e-mail e origem do lead e confirma. O cliente entra no funil em "Cadastro do cliente".
- Logo abaixo, **"Minhas próximas ações"**: lista de casos que precisam de algo agora (ex.: "Definir tipo de compra", "Registrar resultado da análise", "Vincular imóvel", "Pendência vencida"), cada um com o botão da ação direto na linha.
- Os números (casos ativos, aprovados etc.) continuam, mas menores, abaixo das ações.

## 2. Fluxo guiado no caso (passo a passo)
- Ao confirmar o cadastro, abre a **janela do caso em modo assistente**, com uma barra de progresso mostrando as etapas do organograma (À vista ou Financiada, conforme a escolha).
- Cada etapa mostra só o que precisa ser feito ali:
  - **Tipo de compra:** dois botões grandes — À vista / Financiada.
  - **Análise de crédito:** anexar documentos de renda (usa a análise de extratos/narrativas que já existe), informar banco, valor, rating; botões "Crédito aprovado" / "Crédito não aprovado" (este pede o motivo e a data de reavaliação).
  - **Pendência/Acompanhamento:** descrição da pendência, prazo e botão "Pendência resolvida → Nova análise".
  - **Vincular imóvel:** escolher ou cadastrar o imóvel do cliente.
  - **Contrato, ITBI/Registro, Entrega das chaves:** checklist simples da etapa + data + anexo; botão "Concluir etapa".
  - **Concluído:** resumo do caso.
- As regras do organograma continuam valendo (à vista não passa por análise; financiada só vincula imóvel com crédito aprovado).

## 3. Monitoramento = fila de pendências
- Vira uma lista prática de **quem está parado**: clientes em Pendência/Acompanhamento, reavaliações vencidas ou para os próximos 7 dias e casos sem movimento há X dias.
- Filtros: Pendências, Vencidos, Parados, Todos. Cada linha com "Abrir caso" e "Nova análise".

## 4. Kanban (Funil)
- Continua igual, abrindo a mesma janela de caso guiada ao clicar no cartão.
- Cartão mostra a **próxima ação** do caso (ex.: "Aguardando tipo de compra").

## 5. Clientes e Narrativas
- Continuam disponíveis, mas o caminho principal passa a ser Painel → caso.
- Na ficha do cliente, botão "Abrir caso no funil".

## Fora do escopo
- CC VDH, site e criadores de post não são alterados.

## Detalhes técnicos
- Reaproveitar `extract-client-document` para extração no cadastro; criar `cx_clients` + documento em `cx_documents` e o deal em `cadastro`.
- Novo componente `CxNewIntakeWizard` (painel) e `CxDealGuidedFlow` (substitui o conteúdo principal de `CxDealDetailModal`, mantendo a aba de dados de financiamento).
- Função `cxNextAction(deal)` em `src/types/cxCrm.ts`, usada no painel, cartões e monitoramento.
- Possível migração: colunas `pending_note`, `pending_due_at` e `stage_checklist jsonb` em `cx_deals` (se ainda não existirem).
- `CxMonitoringList` reescrito com filtros; `CxCrmDashboard` reorganizado.
