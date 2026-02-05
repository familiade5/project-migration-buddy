// Educational slide backgrounds organized by category
import bgCover from '@/assets/educational/bg-cover.jpg';
import bgContent from '@/assets/educational/bg-content.jpg';
import bgHighlight from '@/assets/educational/bg-highlight.jpg';
import bgCta from '@/assets/educational/bg-cta.jpg';

// Process category backgrounds
import bgProcessCover from '@/assets/educational/bg-process-cover.jpg';
import bgProcessContent from '@/assets/educational/bg-process-content.jpg';
import bgProcessHighlight from '@/assets/educational/bg-process-highlight.jpg';
import bgProcessCta from '@/assets/educational/bg-process-cta.jpg';

// Stories category backgrounds
import bgStoriesCover from '@/assets/educational/bg-stories-cover.jpg';
import bgStoriesContent from '@/assets/educational/bg-stories-content.jpg';
import bgStoriesHighlight from '@/assets/educational/bg-stories-highlight.jpg';
import bgStoriesCta from '@/assets/educational/bg-stories-cta.jpg';

// Institutional category backgrounds
import bgInstitutionalCover from '@/assets/educational/bg-institutional-cover.jpg';
import bgInstitutionalContent from '@/assets/educational/bg-institutional-content.jpg';
import bgInstitutionalHighlight from '@/assets/educational/bg-institutional-highlight.jpg';
import bgInstitutionalCta from '@/assets/educational/bg-institutional-cta.jpg';

import { EducationalCategory } from '@/types/educational';

export type SlideType = 'cover' | 'content' | 'highlight' | 'cta';

interface CategoryBackgrounds {
  cover: string;
  content: string;
  highlight: string;
  cta: string;
}

export const categoryBackgrounds: Record<EducationalCategory, CategoryBackgrounds> = {
  tips: {
    cover: bgCover,
    content: bgContent,
    highlight: bgHighlight,
    cta: bgCta,
  },
  process: {
    cover: bgProcessCover,
    content: bgProcessContent,
    highlight: bgProcessHighlight,
    cta: bgProcessCta,
  },
  stories: {
    cover: bgStoriesCover,
    content: bgStoriesContent,
    highlight: bgStoriesHighlight,
    cta: bgStoriesCta,
  },
  institutional: {
    cover: bgInstitutionalCover,
    content: bgInstitutionalContent,
    highlight: bgInstitutionalHighlight,
    cta: bgInstitutionalCta,
  },
};

export const getBackground = (category: EducationalCategory, slideType: SlideType): string => {
  return categoryBackgrounds[category][slideType];
};
