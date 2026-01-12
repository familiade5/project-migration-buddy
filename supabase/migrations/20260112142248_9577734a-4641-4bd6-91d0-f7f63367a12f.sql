-- Create storage bucket for exported creatives
INSERT INTO storage.buckets (id, name, public)
VALUES ('exported-creatives', 'exported-creatives', true);

-- Allow authenticated users to upload to exported-creatives bucket
CREATE POLICY "Authenticated users can upload exported creatives"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exported-creatives');

-- Allow public read access to exported creatives
CREATE POLICY "Anyone can view exported creatives"
ON storage.objects
FOR SELECT
USING (bucket_id = 'exported-creatives');

-- Allow users to delete their own exported creatives
CREATE POLICY "Users can delete their own exported creatives"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'exported-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add column to store exported images URLs
ALTER TABLE public.creatives 
ADD COLUMN IF NOT EXISTS exported_images TEXT[] DEFAULT '{}';

-- Add column to track format (feed, story, or both)
ALTER TABLE public.creatives 
ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'both';