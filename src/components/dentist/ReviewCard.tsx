'use client';

import { RatingCategory, Review, ReviewRating } from '@prisma/client';
import { Card, CardContent, CardHeader } from '../ui/card';
import RatingStars from './RatingStars';

type Props = {
  review: Review & {
    subratings: (ReviewRating & { category: RatingCategory })[];
  };
};

export default function ReviewCard({ review }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <header className="flex items-center gap-3 text-sm">
          <RatingStars value={review.rating} />
          <span className="font-medium">{review.reviewerName}</span>
          <time className="text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </time>
        </header>
      </CardHeader>
      <CardContent>
        {review.title && <h3 className="mt-2 font-semibold">{review.title}</h3>}

        <p className="mt-1 text-sm whitespace-pre-line">{review.body}</p>

        {review.subratings.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-3 text-xs">
            {review.subratings.map(s => (
              <li
                key={s.id}
                className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1"
              >
                <span>{s.category.label ?? s.category.name}:</span>
                <RatingStars value={s.value} size={12} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
