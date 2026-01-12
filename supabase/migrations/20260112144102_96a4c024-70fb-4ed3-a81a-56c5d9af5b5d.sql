-- Add policy for admins to delete any creative
CREATE POLICY "Admins can delete any creative" 
ON public.creatives 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));