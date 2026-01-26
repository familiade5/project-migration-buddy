-- Tornar o bucket crm-documents público para permitir visualização
UPDATE storage.buckets 
SET public = true 
WHERE id = 'crm-documents';

-- Criar política para permitir leitura pública dos documentos
CREATE POLICY "Public read access for crm-documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'crm-documents');