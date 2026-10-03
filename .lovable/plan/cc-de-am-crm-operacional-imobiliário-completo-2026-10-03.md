# CC de AM — CRM operacional imobiliário completo

## Objetivo
Evoluir o CC de AM para uma plataforma operacional de financiamento habitacional, sem apagar ou substituir o acervo atual. A base foi conferida: **35 clientes, 128 documentos, 9 narrativas e nenhum processo ativo**. Os 35 clientes receberão um processo inicial em **Novo cadastro**; documentos, extrações e narrativas permanecerão vinculados.

## Decisões confirmadas
- Criar um processo inicial para cada um dos 35 clientes existentes.
- Implantar agora os perfis **Administrador, Gestor, Analista e Corretor**, com permissões reais no banco.
- Usuários comuns arquivam; somente Administrador pode excluir definitivamente, com confirmação reforçada e registro de auditoria.
- Entregar em fases verificáveis, conferindo os critérios de aceite ao fim de cada fase.

## Regra estrutural central
Separar rigorosamente:
1. **Etapa atual do processo**: onde o atendimento está no fluxo.
2. **Resultado de cada análise de crédito**: Aprovado, Condicionado, Reprovado ou Erro.

Cada nova análise será um registro imutável. Nenhuma reanálise substituirá a anterior. Condicionado, Reprovado e Erro não serão colunas definitivas do Kanban; o processo ficará em acompanhamento e poderá voltar para nova análise.

## Inventário numerado do escopo
1. **Estrutura:** clientes, participantes, processos, análises, imóveis, vendedores, documentos, engenharia, contratos, ITBI/registro, entrega, tarefas, pendências, timeline e equipe relacionados corretamente.
2. **Cliente:** cadastro completo com dados pessoais, contato, renda individual/familiar, endereço, origem, corretor, observações e data.
3. **Participantes:** principal, cônjuge, coproponente e grupo familiar, com renda, participação e documentos próprios.
4. **Processo:** número único, cliente, corretor, abertura, tipo de compra, etapa, próxima ação, responsável, prazo e observações.
5. **Tipo de compra:** À vista ou Financiada, com caminhos diferentes e bloqueios coerentes.
6. **Etapas do processo:** Novo cadastro; Aguardando análise; Acompanhamento de crédito; Crédito aprovado; Vinculação do imóvel; Documentação; Engenharia/Vistoria; Pendência de engenharia; Contratação; ITBI/Registro; Entrega; Concluído; Perdido/encerrado.
7. **Análise de crédito:** entidade própria, permitindo várias análises por processo e preservando todas.
8. **Campos da análise:** códigos de proposta/avaliação/correspondente, CPF/nome, protocolo, recurso, modalidade, produto, valores, prestação possível, indexador, amortização, prazo, sistema originador, resultado, linha, faixa, motivos, observações, validade, agência, operador e original.
9. **Resultados:** Aprovado, Condicionado, Reprovado e Erro, com formulário adaptado ao resultado.
10. **Aprovado:** dados financeiros completos, validade, documento e avanço permitido.
11. **Linha de crédito:** MCMV ou SBPE; MCMV exige Faixa 1, 2, 3 ou 4.
12. **Condicionado:** motivo estruturado, mensagem exata, prestação possível, acompanhamento e data de reanálise.
13. **Reprovado:** Rating, Capacidade de pagamento ou Outro, com detalhe, acompanhamento e reanálise.
14. **Erro de análise:** registrar mensagem de validação, referência/pergunta, operador e documento, sem confundir com reprovação.
15. **Histórico de análises:** linha do tempo cronológica com resultado, motivo, valores, produto, analista e documento.
16. **Nova análise:** sempre cria novo registro, copia apenas dados cadastrais úteis e evidencia a evolução.
17. **Leitura automática:** PDF/JPG/JPEG/PNG; extrair os campos dos exemplos enviados sem inventar ausentes.
18. **Conferência:** mostrar dados identificados para edição e confirmação antes de salvar.
19. **Central de documentos:** categorias Cliente, Imóvel, Vendedores, Crédito, Engenharia, Contratação, ITBI/Registro e Chaves; arquivo, nome, data, usuário, processo, status e observação.
20. **Histórico documental:** visualizar, baixar, substituir quando permitido e manter versões anteriores.
21. **Imóvel:** cadastro estruturado completo e opção de vincular existente ou cadastrar novo.
22. **Vendedores:** um ou mais por imóvel, com CPF/CNPJ, contato, estado civil, documentos e observações.
23. **Checklist documental:** itens e estados Pendente, Recebido, Em análise, Aprovado e Com pendência, cada um com anexo.
24. **Engenharia/Vistoria:** datas, substatus, resultado, laudo, documentos, pendências, responsável e prazo; retorno após correção.
25. **Contratação:** preparação, assinatura, pendência e conclusão, com datas, contrato, assinaturas e documentos.
26. **ITBI/Registro:** valor, datas, protocolo, cartório, registro, documentos e pendências.
27. **Entrega das chaves:** previsão, data efetiva, responsável, comprovante e observações; conclusão do processo.
28. **Condicionados:** lista operacional com motivo, prestação possível, dias, analista, próxima ação e alertas configuráveis.
29. **Reprovados:** acompanhamento filtrável por motivo/data/equipe, com responsável, prazo e nova análise.
30. **Tarefas e pendências:** múltiplas por processo, com prioridade, responsável, prazo, status e conclusão.
31. **Painel:** indicadores clicáveis para todos os estados e resultados relevantes.
32. **Kanban:** baseado apenas na etapa do processo; cartão mostra último resultado, data, motivo, prestação, próxima ação, responsável e alertas.
33. **Timeline:** registrar automaticamente criação, anexos, análises, mudanças de etapa, imóvel, engenharia, contrato, registro e chaves.
34. **Próxima ação:** obrigatória e destacada em todo processo ativo, com responsável e prazo.
35. **Busca e filtros:** nome, CPF, telefone, códigos, processo, endereço, matrícula, equipe, etapa, tipo, resultado, motivos, linha, faixa, data e pendências.
36. **Relatórios e alertas:** aprovações, condicionados, reprovações, reanálises, tempos, etapas, pendências e prazos; estrutura preparada para exportação e futuras integrações.
37. **Usuários e segurança:** Administrador, Gestor, Analista e Corretor em tabela separada de papéis, permissões no banco, auditoria de criação/alteração/exclusão e acesso mínimo necessário.
38. **Experiência e aceite:** visão limpa do cliente/processo com resumo, crédito, imóvel, pendências, documentos, timeline e análises; validação final item a item contra os 38 blocos e os 37 critérios do documento.

## Entrega por fases verificáveis

### Fase 1 — Fundação segura e preservação
- Criar tabelas e campos novos de forma aditiva; nenhuma tabela atual será recriada, truncada ou renomeada.
- Manter `cx_clients`, `cx_documents`, `cx_client_events`, `cx_properties`, extrações e arquivos atuais intactos.
- Reaproveitar o processo atual, ampliando-o sem duplicar conceitos.
- Criar entidades estruturadas para participantes, análises, tarefas, vendedores, engenharia, contratação, registro/ITBI e entrega.
- Vincular documentos também à análise/participante/categoria/versionamento quando necessário.
- Criar os quatro perfis e políticas de acesso; ampliar papéis sem armazená-los no cadastro do usuário.
- Criar os 35 processos iniciais de forma idempotente e registrar a migração na timeline.
- Conferência: contagens antes/depois, vínculos, permissões e ausência de perda de dados.

### Fase 2 — Processo e análises de crédito
- Substituir a janela extensa por uma área de trabalho do processo, com resumo fixo e abas/seções focadas.
- Criar formulário dinâmico de análise e botão **Nova análise** sempre aditivo.
- Adaptar a leitura automática aos exemplos: Aprovado, Condicionado, Reprovado e Erro.
- Exibir tela de conferência antes de salvar e manter o original anexado.
- Implementar regras de fluxo à vista/financiado e histórico completo.
- Conferência: cadastrar, extrair, corrigir, salvar quatro resultados e reanalisar sem sobrescrever.

### Fase 3 — Operação imobiliária completa
- Implantar participantes, imóvel, vendedores, checklist documental, engenharia/vistoria, contratação, ITBI/registro e entrega das chaves.
- Exigir apenas os dados/documentos pertinentes à etapa atual e permitir pendências com retorno correto.
- Conferência: percorrer um processo à vista e um financiado do cadastro à conclusão.

### Fase 4 — Mesa de trabalho, acompanhamento e gestão
- Reorganizar Painel, Kanban e Monitoramento com próxima ação, tarefas, prazos, alertas e listas de condicionados/reprovados.
- Implementar busca global, filtros combinados, indicadores clicáveis e relatórios operacionais.
- Conferência em computador e celular, incluindo listas grandes e estados vazios.

### Fase 5 — Segurança, auditoria e aceite final
- Validar cada perfil com uma sessão real: corretor vê seus casos; analista registra análises; gestor acompanha tudo; administrador configura e pode excluir definitivamente.
- Registrar tentativas e exclusões administrativas em auditoria.
- Executar os 37 critérios de aceite do documento e revisar novamente os 38 itens deste plano.
- Confirmar contagens e integridade de clientes, documentos, narrativas, processos, análises e arquivos.

## Proteções de dados
- Migrações apenas aditivas e idempotentes.
- Nenhuma exclusão, limpeza ou substituição automática do acervo atual.
- Documentos originais preservados; substituição cria versão.
- Análises novas são inserções, nunca atualização de análise antiga.
- Resultado da análise nunca altera retroativamente o histórico.
- Exclusão definitiva fica restrita ao Administrador, exige confirmação reforçada e gera auditoria independente.

## Detalhes técnicos
- Manter o namespace `cx_*`, totalmente separado do CC VDH.
- Reaproveitar o armazenamento privado e a leitura documental já existentes.
- Todas as novas tabelas terão permissões explícitas, proteção por linha e validação de entrada.
- Etapa do processo e resultado da análise usarão campos/tabelas independentes e filtráveis.
- A timeline será uma visão unificada dos eventos, sem apagar os históricos atuais.
- As telas serão migradas gradualmente; campos antigos permanecem disponíveis até a nova leitura estar validada.

## Fora do escopo desta evolução
- CC VDH, site público VDH, criadores e aprovação de posts.
- Geração automática de contrato e declaração de entrega; a estrutura ficará preparada, mas o conteúdo automatizado será uma etapa futura separada.
