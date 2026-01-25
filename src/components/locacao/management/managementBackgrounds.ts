import introBg from '@/assets/locacao-management-bg-intro.jpg';
import servicesBg from '@/assets/locacao-management-bg-services.jpg';
import trustBg from '@/assets/locacao-management-bg-trust.jpg';
import contactBg from '@/assets/locacao-management-bg-contact.jpg';

export type ManagementSlideKey = 'intro' | 'benefits' | 'trust' | 'contact';

export const managementDefaultBackgroundBySlide: Record<ManagementSlideKey, string> = {
  intro: introBg,
  benefits: servicesBg,
  trust: trustBg,
  contact: contactBg,
};
