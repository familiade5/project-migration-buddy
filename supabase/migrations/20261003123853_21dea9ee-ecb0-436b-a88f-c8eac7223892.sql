DROP POLICY IF EXISTS "Internal users can delete cx documents" ON public.cx_documents;
DROP POLICY IF EXISTS "cx_documents_delete" ON public.cx_documents;
CREATE POLICY "cx_documents_delete_guarded"
ON public.cx_documents
FOR DELETE
TO authenticated
USING (
  public.is_internal_user(auth.uid())
  AND public.is_approved_user(auth.uid())
  AND (
    credit_analysis_id IS NULL
    OR public.cx_is_admin(auth.uid())
  )
);