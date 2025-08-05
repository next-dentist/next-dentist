"use client";

import Image from "next/image";
import { WhiteRoundedBox } from "./WhiteRoundedBox";

interface ReviewCardProps {
  name: string;
  image: string;
  profession: string;
  review: string;
}

export default function ReviewCard({
  name,
  image,
  profession,
  review,
}: ReviewCardProps) {
  return (
    <WhiteRoundedBox className="flex flex-col basis-1/4 gap-4 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Image src="/images/star.png" alt="stars" width={16} height={16} />
          <Image src="/images/star.png" alt="stars" width={16} height={16} />
          <Image src="/images/star.png" alt="stars" width={16} height={16} />
          <Image src="/images/star.png" alt="stars" width={16} height={16} />
          <Image src="/images/star.png" alt="stars" width={16} height={16} />
        </div>
        <span className=" font-bold">{name}</span>
        <span className="text-sm text-gray-500">{profession}</span>
      </div>
      <p className="text-sm text-gray-500">{review}</p>
    </WhiteRoundedBox>
  );
}
