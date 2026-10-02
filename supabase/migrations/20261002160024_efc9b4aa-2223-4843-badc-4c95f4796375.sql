ALTER TABLE public.cx_deals ADD COLUMN IF NOT EXISTS purchase_type text, ADD COLUMN IF NOT EXISTS credit_status text;
ALTER TABLE public.cx_deals ALTER COLUMN stage SET DEFAULT 'cadastro';
ALTER TABLE public.cx_clients ADD COLUMN IF NOT EXISTS lead_source text;
DELETE FROM public.cx_pipeline_stages WHERE key IN ('simulacao','documentacao','em_analise','condicionado','aprovado','contrato','reprovado');
INSERT INTO public.cx_pipeline_stages (key,label,color,bg,border,position,is_system,is_active) VALUES
('cadastro','Cadastro do cliente','#64748b','#f8fafc','#cbd5e1',10,true,true),
('tipo_compra','Tipo de compra','#0ea5e9','#f0f9ff','#bae6fd',20,true,true),
('analise_credito','Análise de crédito','#6366f1','#eef2ff','#c7d2fe',30,true,true),
('credito_aprovado','Crédito aprovado','#10b981','#ecfdf5','#a7f3d0',40,true,true),
('pendencia','Pendência / Acompanhamento','#ef4444','#fef2f2','#fecaca',50,true,true),
('vincular_imovel','Vincular imóvel','#f59e0b','#fffbeb','#fde68a',60,true,true),
('contrato','Contrato','#1a3a6b','#eff6ff','#bfdbfe',70,true,true),
('itbi_registro','ITBI / Registro','#ec4899','#fdf2f8','#fbcfe8',80,true,true),
('entrega_chaves','Entrega das chaves','#0d9488','#f0fdfa','#99f6e4',90,true,true),
('concluido','Concluído','#15803d','#dcfce7','#86efac',100,true,true);