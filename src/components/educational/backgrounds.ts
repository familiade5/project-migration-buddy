// Educational slide backgrounds organized by category with 7 unique images per category
// This ensures NO image repetition across slides in a post (max 7 slides)

// Tips category backgrounds (bg-1 through bg-7)
import tipsBg1 from '@/assets/educational/tips/bg-1.jpg';
import tipsBg2 from '@/assets/educational/tips/bg-2.jpg';
import tipsBg3 from '@/assets/educational/tips/bg-3.jpg';
import tipsBg4 from '@/assets/educational/tips/bg-4.jpg';
import tipsBg5 from '@/assets/educational/tips/bg-5.jpg';
import tipsBg6 from '@/assets/educational/tips/bg-6.jpg';
import tipsBg7 from '@/assets/educational/tips/bg-7.jpg';

// Process category backgrounds (bg-1 through bg-7)
import processBg1 from '@/assets/educational/process/bg-1.jpg';
import processBg2 from '@/assets/educational/process/bg-2.jpg';
import processBg3 from '@/assets/educational/process/bg-3.jpg';
import processBg4 from '@/assets/educational/process/bg-4.jpg';
import processBg5 from '@/assets/educational/process/bg-5.jpg';
import processBg6 from '@/assets/educational/process/bg-6.jpg';
import processBg7 from '@/assets/educational/process/bg-7.jpg';

// Stories category backgrounds (bg-1 through bg-7)
import storiesBg1 from '@/assets/educational/stories/bg-1.jpg';
import storiesBg2 from '@/assets/educational/stories/bg-2.jpg';
import storiesBg3 from '@/assets/educational/stories/bg-3.jpg';
import storiesBg4 from '@/assets/educational/stories/bg-4.jpg';
import storiesBg5 from '@/assets/educational/stories/bg-5.jpg';
import storiesBg6 from '@/assets/educational/stories/bg-6.jpg';
import storiesBg7 from '@/assets/educational/stories/bg-7.jpg';

// Institutional category backgrounds (bg-1 through bg-7)
import institutionalBg1 from '@/assets/educational/institutional/bg-1.jpg';
import institutionalBg2 from '@/assets/educational/institutional/bg-2.jpg';
import institutionalBg3 from '@/assets/educational/institutional/bg-3.jpg';
import institutionalBg4 from '@/assets/educational/institutional/bg-4.jpg';
import institutionalBg5 from '@/assets/educational/institutional/bg-5.jpg';
import institutionalBg6 from '@/assets/educational/institutional/bg-6.jpg';
import institutionalBg7 from '@/assets/educational/institutional/bg-7.jpg';

import { EducationalCategory } from '@/types/educational';

// Legacy type for backwards compatibility
export type SlideType = 'cover' | 'content' | 'highlight' | 'cta';

// Array of 7 unique backgrounds per category
const categoryBackgroundArrays: Record<EducationalCategory, string[]> = {
  tips: [tipsBg1, tipsBg2, tipsBg3, tipsBg4, tipsBg5, tipsBg6, tipsBg7],
  process: [processBg1, processBg2, processBg3, processBg4, processBg5, processBg6, processBg7],
  stories: [storiesBg1, storiesBg2, storiesBg3, storiesBg4, storiesBg5, storiesBg6, storiesBg7],
  institutional: [institutionalBg1, institutionalBg2, institutionalBg3, institutionalBg4, institutionalBg5, institutionalBg6, institutionalBg7],
};

/**
 * Get background image by slide index (0-based).
 * Each slide gets a unique image - no repetition!
 * If slideIndex exceeds 6, it wraps around.
 */
export const getBackgroundByIndex = (category: EducationalCategory, slideIndex: number): string => {
  const backgrounds = categoryBackgroundArrays[category];
  const wrappedIndex = slideIndex % backgrounds.length;
  return backgrounds[wrappedIndex];
};

// Legacy interface for backwards compatibility
interface CategoryBackgrounds {
  cover: string;
  content: string;
  highlight: string;
  cta: string;
}

// Legacy mapping (uses first 4 images for backwards compatibility)
export const categoryBackgrounds: Record<EducationalCategory, CategoryBackgrounds> = {
  tips: {
    cover: tipsBg1,
    content: tipsBg2,
    highlight: tipsBg3,
    cta: tipsBg4,
  },
  process: {
    cover: processBg1,
    content: processBg2,
    highlight: processBg3,
    cta: processBg4,
  },
  stories: {
    cover: storiesBg1,
    content: storiesBg2,
    highlight: storiesBg3,
    cta: storiesBg4,
  },
  institutional: {
    cover: institutionalBg1,
    content: institutionalBg2,
    highlight: institutionalBg3,
    cta: institutionalBg4,
  },
};

/**
 * @deprecated Use getBackgroundByIndex instead to avoid image repetition
 */
export const getBackground = (category: EducationalCategory, slideType: SlideType): string => {
  return categoryBackgrounds[category][slideType];
};
