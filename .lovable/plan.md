## Objetivo

Substituir o CRM atual do VDH por um **CRM-Inbox** focado em conversas centralizadas do **Instagram Direct do VDH**, com suporte a múltiplos atendentes, atribuição de conversas, vínculo a leads e tempo real.

WhatsApp e outros canais ficam para uma fase futura — agora é só Insta VDH.

---

## Visão geral do que será entregue

Uma tela tipo "WhatsApp Web" dentro do sistema:

```text
┌─────────────────────────────────────────────────────────┐
│ CRM VDH — Caixa de Entrada                              │
├──────────────┬──────────────────────────────────────────┤
│ Conversas    │  João Silva  •  @joaosilva               │
│ ┌──────────┐ │  ─────────────────────────────────────── │
│ │ João...  │ │  Olá, vi o anúncio do apto Vila Carvalho │
│ │ 14:32 •2 │ │                                          │
│ ├──────────┤ │  [Atribuir] [Criar Lead] [Marcar lida]  │
│ │ Maria... │ │  ─────────────────────────────────────── │
│ │ 12:10    │ │  ▢ Resposta...                  [Enviar]│
│ └──────────┘ │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## Etapas

### Etapa 1 — Configuração do Webhook Meta (você faz na Meta, eu te entrego a URL)

1. Eu crio a Edge Function `vdh-instagram-webhook` que recebe DMs.
2. Te entrego a URL pública e o `verify_token`.
3. Você cola no painel do Meta Developers → seu app → Webhooks → Instagram → assina o evento `messages`.

### Etapa 2 — Banco de dados

Criar 3 tabelas novas:

- **`vdh_conversations`** — uma linha por conversa (cliente Insta)
  - participante (nome, username, avatar, IG ID), última mensagem, não lidas, atribuído_a (user_id), status (aberto/arquivado), lead_id vinculado
- **`vdh_messages`** — todas as mensagens (entrada e saída)
  - conversation_id, direção (in/out), texto, mídia, timestamp, sent_by_user_id (quem do CRM respondeu)
- **`vdh_inbox_access`** — quem tem acesso à inbox VDH
  - user_id + role (viewer/responder/admin)

RLS: só usuários listados em `vdh_inbox_access` podem ler/escrever. Auditoria de quem respondeu o quê fica em `vdh_messages.sent_by_user_id`.

### Etapa 3 — Edge Functions

- **`vdh-instagram-webhook`** (público, sem JWT) — recebe DMs do Meta, grava no banco, dispara realtime
- **`vdh-instagram-send`** (autenticado) — envia resposta via Graph API, grava na tabela
- **`vdh-conversation-actions`** (autenticado) — atribuir, arquivar, marcar lida, criar lead

### Etapa 4 — Interface (tela `/vdh-crm`)

Componentes:
- **`InboxLayout`** — split view (lista + thread)
- **`ConversationList`** — busca, filtros (não lidas, atribuídas a mim, todas)
- **`ConversationThread`** — bolhas de mensagem, input de resposta, indicador "Maria está digitando..."
- **`ConversationHeader`** — botões: Atribuir corretor, Criar Lead, Arquivar
- **Realtime**: Supabase Realtime na tabela `vdh_messages` → mensagens novas aparecem na hora
- Badge de não lidas no menu lateral

### Etapa 5 — Substituir CRM antigo no VDH

- Remove `import CRM` e rota `/crm` do `App.tsx`
- Remove item "CRM" do menu lateral do VDH
- Adiciona item "Caixa de Entrada" apontando para `/vdh-crm`
- **Não deleto** os arquivos antigos (`src/pages/CRM.tsx`, `src/components/crm/*`, `src/components/proposals/*`) — fico só por preservação. Se você confirmar, removo depois.

### Etapa 6 — Vínculo com Lead (camada CRM leve)

Como o CRM antigo de leads/propostas vai sair, crio uma tabela mínima `vdh_leads` (nome, telefone, etapa, anotações) ou apenas mantenho o lead embutido dentro da própria conversa (status: novo / qualificando / quente / fechado). Sugiro a opção embutida — mais simples e alinhada com o foco em conversas.

---

## Permissões e auditoria

- Por padrão, só **Master Admins** veem a Caixa VDH
- Master Admin pode adicionar outros usuários como "responder" em `vdh_inbox_access`
- Cada mensagem enviada grava o `sent_by_user_id` → histórico completo de quem respondeu o quê
- Quando uma conversa é "atribuída", os outros usuários ainda veem mas o input mostra aviso "Atribuído a João — clique para assumir"

---

## Limitações do Meta (importante)

- **Janela de 24h**: só pode iniciar mensagem com quem te mandou DM nas últimas 24h. Depois disso, espera o cliente mandar de novo.
- Mensagens de **stories**, **reações** e **mídia** chegam normalmente.
- Webhook do Meta tem latência de 1-3 segundos.

---

## O que NÃO vou mexer

- Criar Post, Posts Educativos, Biblioteca, Calculadora, Tráfego Pago, AM, AF — **nada disso é alterado**
- Geradores de criativos do VDH continuam funcionando igual
- Publicação no Insta/Facebook (que já existe) continua igual

---

## Confirmações antes de começar

1. Confirmar **acesso**: só Master Admins por padrão? (você + neto@)
2. Confirmar **estratégia de leads**: vínculo embutido na conversa (mais simples) ou tabela `vdh_leads` separada?
3. Confirmar **remoção do CRM antigo**: removo do menu agora, mantenho arquivos para backup; deleto definitivo só com seu OK depois.

Se você confirmar (ou só disser "pode seguir"), começo pela Etapa 2 (banco) + Etapa 3 (webhook), te entrego a URL para você configurar no Meta e em seguida monto a interface.