
# Caixa de Entrada VDH — Kanban + Respostas Rápidas com IA + Auto-resposta

Tudo será adicionado dentro da Caixa de Entrada existente, sem mexer em publicações do VDH/AM. Facebook Messenger fica para uma próxima etapa, conforme combinado.

---

## 1. Kanban customizável com tags

**Como vai funcionar na prática:**

- Toda conversa nova entra automaticamente com a tag "Primeiro Contato" (configurável).
- Você cria, renomeia, reordena e exclui colunas/tags livremente (ex: Primeiro Contato → Qualificando → Quente → Negociando → Fechado → Perdido). Cada uma com cor própria.
- No chat, troca a tag pelo seletor que já existe (só que agora puxa SUAS colunas, não as fixas).
- Nova aba "**Kanban**" no topo, ao lado da lista. Mostra as colunas com os cards dos leads, podendo arrastar e soltar entre colunas (muda a tag automaticamente).
- Continua tudo em tempo real: alterou em um lugar, atualiza no outro.

```text
[ Caixa de Entrada VDH ]
 ├─ Aba: Conversas (lista atual)
 └─ Aba: Kanban
      ┌─────────────┬──────────────┬──────────┬──────────┐
      │ 1º Contato  │ Qualificando │ Quente   │ Fechado  │
      │ • Maria     │ • João       │ • Carlos │ • Ana    │
      │ • Pedro     │              │ • Lucas  │          │
      └─────────────┴──────────────┴──────────┴──────────┘
```

---

## 2. Respostas rápidas + sugestão automática por IA

**Cadastro:**
- Tela "Respostas Rápidas" (acessível por um botão dentro do chat e nas configurações).
- Cada resposta tem: **título**, **palavras-chave/intenção** (ex: "preço, valor, quanto custa") e **texto da resposta**.

**Uso no atendimento:**
- Quando chega uma mensagem nova do lead, a IA lê e, se o conteúdo bater com alguma resposta cadastrada, mostra um **card discreto acima do campo de digitação**: "💡 Sugestão: **Tabela de Preços** — clique para usar".
- Você clica → o texto entra na caixa de digitação → você revisa/edita → envia.
- Também tem um botão "📋 Respostas" que abre a lista completa pra você escolher manualmente.

---

## 3. Auto-resposta fora do horário comercial (com IA)

**Configuração:**
- Tela de "Configurações de Auto-resposta": ligar/desligar, dias da semana, horário comercial (ex: Seg–Sex 8h–18h, Sáb 8h–12h).
- Você define a **personalidade/instruções** (ex: "Você é a assistente da VDH Imóveis. Seja simpática e breve. Diga que um corretor humano responderá pela manhã. Se o lead falar de financiamento, mencione MCMV.").
- A IA tem acesso às respostas rápidas cadastradas como contexto, então mantém o tom certo.

**Funcionamento:**
- Mensagem chega via webhook do Instagram → sistema confere o horário → se estiver fora do expediente E auto-resposta ativa → IA gera e envia a resposta.
- A mensagem da IA aparece no chat marcada como "🤖 Auto-resposta" para você saber que foi automática.
- A conversa entra na coluna "Primeiro Contato" normalmente, pra você dar continuidade quando voltar ao expediente.

---

## 4. Detalhes técnicos (parte técnica, pode pular)

**Banco de dados (novas tabelas):**
- `vdh_kanban_columns` — colunas customizáveis (nome, cor, posição, padrão_para_novos)
- `vdh_quick_replies` — respostas prontas (título, gatilhos, conteúdo)
- `vdh_auto_reply_config` — config única (ativo, horários, dias, prompt do sistema)
- Migrar `vdh_conversations.lead_status` (enum fixo) para `kanban_column_id` (FK), mantendo compatibilidade com os dados atuais.

**Edge Functions novas:**
- `vdh-suggest-reply` — chama Lovable AI (Gemini 2.5 Flash) com a mensagem do lead + lista de respostas, retorna `{ matched_reply_id, confidence }`.
- Modificar `vdh-instagram-webhook` para verificar horário e disparar auto-resposta via Lovable AI quando aplicável.

**Frontend:**
- Componentes: `KanbanBoard`, `QuickReplyManager`, `QuickReplySuggestion`, `AutoReplySettings`.
- Drag-and-drop com `@dnd-kit/core` (já leve, sem dependências pesadas).
- Tabs no topo da inbox: "Conversas" / "Kanban".

**Custos:** uso da Lovable AI é por request. Sugestões e auto-respostas usam Gemini 2.5 Flash (econômico).

---

## Ordem de entrega

1. Migração do banco (colunas, respostas, config)
2. Kanban customizável + drag-and-drop
3. Respostas rápidas (cadastro + botão na conversa)
4. Sugestão de resposta por IA
5. Auto-resposta fora do horário

Tudo entregue de uma vez.

---

**Confirma que posso seguir com esse plano?** Se quiser ajustar algo (nomes das colunas iniciais, tom da IA, horário padrão, etc.), me avise antes.
