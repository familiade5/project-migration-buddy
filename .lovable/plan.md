## Objetivo

Permitir publicar imóveis do **VDH** e do **Apartamentos Fortaleza** no Canal Pro via feed XML, exatamente como já funciona no **Apartamentos Manaus** (AM). O AM tem: campos extras no formulário (CEP, categoria, lazer, condomínio, etc.), checkbox "Publicar também na OLX" no dialog de publicação, tabela `am_olx_listings`, edge function `olx-feed-am` que serve XML VRSYNC, e página `/am/olx-catalog` para gerenciar o feed.

Vou replicar essa mesma estrutura para os outros dois módulos.

---

## 1. Banco de dados (uma migração)

Criar duas novas tabelas espelhando `am_olx_listings`:

- `vdh_olx_listings` — para imóveis do VDH (Venda de Imóveis)
- `af_olx_listings` — para imóveis do Apartamentos Fortaleza

Mesma estrutura/colunas do AM (title, description, price, address, fotos, amenities, etc.), com RLS para usuários autenticados verem/inserirem.

## 2. Tipos (TypeScript)

- **VDH** (`src/types/property.ts` ou onde estiver o PropertyData usado pelo VDH): adicionar os ~30 campos opcionais do Canal Pro (CEP, category, totalArea, addressDisplay, isCommercial, amenityPool, amenityGym, condoFloors, etc.) — todos opcionais para não quebrar nada.
- **AF** (`src/types/apartamentosFortaleza.ts`): mesmos campos opcionais + valores default seguros.

## 3. Formulários

Replicar as seções extras "Canal Pro / OLX / ZAP" que existem em `AMPropertyForm.tsx` (linhas 290-444):
- Classificação do Anúncio (categoria, área total, exibição de endereço, comercial)
- Diferenciais do Imóvel
- Sobre o Condomínio
- Lazer e Esporte
- Comodidades e Serviços
- Segurança
- Negociação Avançada

Adicionar em:
- `src/components/posts/...` formulário VDH (vou localizar o arquivo correto)
- `src/components/apartamentos-fortaleza/AFPropertyForm.tsx`

Também adicionar campo **CEP** (obrigatório p/ OLX) na seção de identificação dos dois.

## 4. Dialogs de publicação

- **VDH**: já existe `VDHInstagramPublishDialog.tsx`. Adicionar checkbox "Publicar também na OLX / ZAP / VivaReal" + validações (CEP + ao menos 1 foto) + insert em `vdh_olx_listings`, espelhando `AMInstagramPublishDialog.tsx`.
- **AF**: não existe dialog ainda. Criar `AFInstagramPublishDialog.tsx` baseado no do AM (publica no Instagram via edge function `publish-social-media` + checkbox OLX que insere em `af_olx_listings`). Adicionar botão "Postar no Instagram AF" na página `ApartamentosFortalezaPage.tsx`.

## 5. Edge functions de feed XML

Criar duas novas edge functions (mesmo código do `olx-feed-am`, só muda a tabela lida):
- `supabase/functions/vdh-olx-feed/index.ts` → lê `vdh_olx_listings`
- `supabase/functions/af-olx-feed/index.ts` → lê `af_olx_listings`

URLs públicas que o cliente cola no Canal Pro → Integração de anúncios.

## 6. Páginas de catálogo

Criar páginas equivalentes a `AMOlxCatalog.tsx`:
- Catálogo VDH em `/olx-catalog` (no layout principal)
- Catálogo AF em `/af/olx-catalog` (no AFLayout)

Cada uma mostra a URL do feed, lista os imóveis publicados e permite ativar/desativar/excluir.

Adicionar entradas no menu lateral de cada layout.

---

## Restrições já consideradas

- Permissões VDH: respeitar hierarquia existente (Master Admin etc.) — usar mesmos guards já aplicados ao módulo.
- AF: módulo restrito a Master Admins → catálogo respeita isso.
- Sem mexer no fluxo atual: todos os campos são opcionais; quem não quiser publicar na OLX continua usando como está.

---

## Ordem de execução

1. Migração SQL (você aprova) → 2. Tipos → 3. Formulários (VDH + AF) → 4. Dialog AF + atualizar dialog VDH → 5. Edge functions → 6. Páginas de catálogo + rotas + menu.

Posso começar pela **migração** assim que você confirmar. Quer que eu siga exatamente esse plano ou prefere começar só por um módulo (VDH ou AF) primeiro para validar?