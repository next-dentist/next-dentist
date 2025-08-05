import Image from "next/image";
import Link from "next/link";

interface ImageGridProps {
  items: {
    id: string;
    image: string;
    name: string;
    description?: string;
    slug: string;
  }[];
}

export default function ImageGrid({ items }: ImageGridProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/treatments/${item.slug}`}
            className="group relative block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-square relative">
              <Image
                src={item.image || "/placeholder-treatment.jpg"}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-sm line-clamp-2 opacity-90">
                {item.description || "Learn more about this treatment"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
