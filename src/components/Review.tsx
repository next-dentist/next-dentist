"use client";

const Review = ({ review }: { review: { name: string; review: string } }) => {
  return (
    <div>
      <h1>{review.name}</h1>
      <p>{review.review}</p>
    </div>
  );
};

export default Review;
