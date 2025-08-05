'use client';

import ReviewsSection from '@/components/dentist/ReviewsSection';
import { FaqItem } from './types';

interface ReviewsTabProps {
  dentistId: string;
  faqsForAccordion: FaqItem[];
  expandedFaq: number | null;
  onFaqToggle: (index: number | null) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  dentistId,
  faqsForAccordion,
  expandedFaq,
  onFaqToggle,
}) => {
  return <ReviewsSection dentistId={dentistId} />;
};
