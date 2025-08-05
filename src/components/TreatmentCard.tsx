import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface TreatmentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  price?: string;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({
  title,
  description,
  imageUrl,
  slug,
  price,
}) => {
  return (
    <Card className="overflow-hidden text-center transition-all duration-300 hover:shadow-lg">
      <div className="relative flex h-[100px] w-full items-center justify-center">
        <Image
          src={imageUrl}
          alt={title}
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>
        {price && (
          <div className="mb-2">
            <span className="text-primary font-medium">
              Starting from {price}
            </span>
          </div>
        )}
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center p-5 pt-0">
        <Link href={`/treatments/${slug}`}>
          <Button
            variant="outline"
            className="text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TreatmentCard;
