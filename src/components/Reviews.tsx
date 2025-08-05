"use client";

import { useState } from "react";
import Review from "./Review";

const Reviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: "John Doe",
      review: "This is a review",
    },
  ]);

  return (
    <div>
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </div>
  );
};

export default Reviews;
