import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WorldCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  onClick: () => void;
}

export function WorldCard({ title, category, description, image, tags, onClick }: WorldCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
