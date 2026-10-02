# Site público VDH + novo CC do VDH (Fases 1 e 2)

Os criadores de post não mudam. O CC do AM continua separado e intacto.

## O que o cliente vai ver (site público)
- **Início `/imoveis`:** "Onde você quer morar?". O cliente escolhe o estado com CRECI (AM, CE, MS, PB, RN, SC) e depois a cidade, vendo quantos imóveis cada uma tem.
- **Lista da cidade:** cards com foto, preço, desconto e etiquetas "Aceita financiamento" (verde), "Somente à vista" (laranja), "Novo" e "Em disputa" (quando houver cronômetro). Filtros por financiamento, preço, quartos, tipo e maior desconto.
- **Página do imóvel `/imoveis/:codigo`:** fotos (ou "Imagem não fornecida"), preço, avaliação, endereço, simulador rápido (renda → parcela e entrada estimadas) e dois botões:
  - **"Quero saber se aprovo"** abre o formulário.
  - **WhatsApp** para (92) 98839-1098, com a mensagem já preenchida com o código e o endereço do imóvel.
- **Formulário de pré-análise `/imoveis/:codigo/simular`**, em passos: dados e renda → quem soma renda (opcional) → documentos enviados pelo celular (RG/CNH, renda, residência) → aceite LGPD → enviar. A tela final confirma o envio e explica os próximos passos.
- Visual VDH: verde escuro, pensado para celular, sem nenhum menu ou link para as telas internas.

## Atualização automática
- Todo dia de madrugada, o sistema lê a lista da Caixa dos 6 estados (1 crédito por estado, cerca de 6 créditos por dia).
- Imóvel novo entra no site. Imóvel que saiu da lista aparece como "Vendido" por 3 dias e depois some.
- Essa atualização fica separada da fila de Aprovação Posts.

## Novo CC do VDH (interno)
- Nova tela **"CC VDH"** para administradores, separada do CC do AM.
- Cada pedido do site chega com o cliente, os documentos e o **imóvel de interesse** (foto, preço, link e situação na Caixa).
- Funil: Novo pedido → Documentação → Em análise → Aprovado / Condicionado / Reprovado → Enviado para vendas → Fechado.
- Ao aprovar, o analista **escolhe o corretor manualmente**, e o caso aparece para ele.
- Aviso quando o imóvel de interesse sai da Caixa.

## Detalhes técnicos
- Nova tabela `vdh_site_properties` (código Caixa como chave, UF, cidade, bairro, tipo, preço, avaliação, desconto, financiamento, fotos, `status` active/sold, `first_seen_at`, `last_seen_at`, `sold_at`). Leitura pública (anon) só de active e de sold recente.
- Edge function `vdh-site-sync`, executada pelo pg_cron diariamente. Ela reaproveita o download, o cache, a correção de acentos e o zero-padding das fotos de `import-caixa-city`, passando essa lógica para `_shared/caixa.ts`.
- Tabelas do CC VDH: `vdh_cc_leads` (dados do cliente, renda, property_code, snapshot do imóvel, etapa, corretor responsável, token de acompanhamento) e `vdh_cc_lead_history`. As tabelas `cx_*` do AM não são usadas.
- Envio do formulário pela edge function `vdh-site-submit` (validação Zod, sem login, limite de tamanho), com os documentos no bucket privado `vdh-site-docs`. Só usuários internos leem os documentos.
- Leitura automática dos documentos reaproveitando `extract-client-document` dentro do CC VDH.
- Rotas públicas fora do `ProtectedRoute`. O caminho fica pronto para o domínio próprio no futuro.
- Metadados SEO por cidade e por imóvel.

## Fora desta etapa (fase 3)
Mapa, favoritos, alertas por WhatsApp, rodízio automático de corretores e painel de métricas.
