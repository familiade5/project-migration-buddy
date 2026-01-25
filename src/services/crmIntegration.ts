import { supabase } from '@/integrations/supabase/client';

interface CreatePropertyFromCreativeParams {
  code: string;
  propertyType: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'rural' | 'outro';
  city: string;
  state: string;
  neighborhood?: string;
  address?: string;
  saleValue?: number;
  coverImageUrl: string;
  sourceCreativeId: string;
  createdByUserId: string;
}

/**
 * Creates a CRM property entry from a creative post.
 * The property is automatically placed in "em_anuncio" stage.
 */
export async function createCrmPropertyFromCreative(params: CreatePropertyFromCreativeParams) {
  try {
    // Check if property with same code already exists
    const { data: existing } = await supabase
      .from('crm_properties')
      .select('id')
      .eq('code', params.code)
      .maybeSingle();

    if (existing) {
      // Update existing property with new cover image and mark as has creatives
      const { error: updateError } = await supabase
        .from('crm_properties')
        .update({
          cover_image_url: params.coverImageUrl,
          source_creative_id: params.sourceCreativeId,
          has_creatives: true,
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      console.log('CRM property updated with new creative:', existing.id);
      return existing.id;
    }

    // Create new property in "em_anuncio" stage
    const { data, error } = await supabase
      .from('crm_properties')
      .insert({
        code: params.code,
        property_type: params.propertyType,
        city: params.city,
        state: params.state,
        neighborhood: params.neighborhood || null,
        address: params.address || null,
        sale_value: params.saleValue || null,
        commission_value: params.saleValue ? params.saleValue * 0.05 : null,
        commission_percentage: 5,
        cover_image_url: params.coverImageUrl,
        source_creative_id: params.sourceCreativeId,
        created_by_user_id: params.createdByUserId,
        current_stage: 'em_anuncio',
        has_creatives: true,
      })
      .select('id')
      .single();

    if (error) throw error;
    console.log('CRM property created from creative:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creating CRM property from creative:', error);
    // Don't throw - we don't want to block creative creation if CRM fails
    return null;
  }
}

/**
 * Copies the cover image to a permanent location in storage.
 * This ensures the image persists even if the original creative is deleted.
 */
export async function copyImageToCrmStorage(
  sourceUrl: string,
  propertyCode: string
): Promise<string | null> {
  try {
    // Fetch the image from the source URL
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const fileName = `covers/${propertyCode}-${Date.now()}.jpg`;

    // Upload to crm-documents bucket
    const { error: uploadError } = await supabase.storage
      .from('crm-documents')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('crm-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error copying image to CRM storage:', error);
    return null;
  }
}
