import { supabase } from '@/integrations/supabase/client';
import { isEncryptedPdf, pdfToJpegBase64, invokeErrorMessage } from '@/lib/pdfToImages';
import { CxExtraction } from '@/types/correspondente';

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
  });

/** Lê um documento pessoal/renda com a IA e devolve os dados extraídos. */
export async function extractClientFile(file: File, docType: string): Promise<CxExtraction> {
  const pageImages = (await isEncryptedPdf(file)) ? await pdfToJpegBase64(file) : undefined;
  const base64 = pageImages ? '' : await fileToBase64(file);
  const { data, error } = await supabase.functions.invoke('extract-client-document', {
    body: { fileBase64: base64, pageImages, mimeType: file.type, fileName: file.name, docType },
  });
  if (error) throw new Error(await invokeErrorMessage(error));
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return (data as { data: CxExtraction }).data;
}

/** Lê um resultado/análise da CAIXA e devolve os campos estruturados para conferência. */
export async function extractCreditAnalysisFile(file: File): Promise<Record<string, unknown>> {
  const pageImages = (await isEncryptedPdf(file)) ? await pdfToJpegBase64(file) : undefined;
  const base64 = pageImages ? '' : await fileToBase64(file);
  const { data, error } = await supabase.functions.invoke('extract-financing-data', {
    body: { fileBase64: base64, pageImages, mimeType: file.type, fileName: file.name },
  });
  if (error) throw new Error(await invokeErrorMessage(error));
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return ((data as { data?: Record<string, unknown> })?.data ?? {});
}

/** Envia o arquivo para a pasta do cliente e registra em cx_documents. */
export async function saveCxFile(opts: {
  clientId: string;
  file: File;
  docType: string;
  extracted?: unknown;
  dealId?: string | null;
  stage?: string | null;
}) {
  const { clientId, file, docType, extracted, dealId, stage } = opts;
  const ext = file.name.split('.').pop() || 'bin';
  const path = `${clientId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('correspondente-docs')
    .upload(path, file, { contentType: file.type || undefined });
  if (upErr) throw new Error(upErr.message);
  const { data: u } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('cx_documents')
    .insert({
      client_id: clientId,
      doc_type: docType,
      file_name: file.name,
      file_path: path,
      mime_type: file.type || null,
      status: 'done',
      extracted: (extracted ?? null) as never,
      uploaded_by_user_id: u.user?.id ?? null,
      deal_id: dealId ?? null,
      stage: stage ?? null,
    } as never)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as { id: string; file_name: string; file_path: string; doc_type: string; stage: string | null; created_at: string };
}

export async function openCxFile(path: string) {
  const { data, error } = await supabase.storage.from('correspondente-docs').createSignedUrl(path, 600);
  if (error || !data) throw new Error(error?.message || 'Arquivo indisponível');
  window.open(data.signedUrl, '_blank');
}
