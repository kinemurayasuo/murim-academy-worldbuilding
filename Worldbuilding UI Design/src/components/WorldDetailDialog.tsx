import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WorldItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  detailedDescription: string;
  specifications?: { label: string; value: string }[];
}

interface WorldDetailDialogProps {
  item: WorldItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorldDetailDialog({ item, open, onOpenChange }: WorldDetailDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.category} 정보</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2">개요</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div>
                <h3 className="mb-2">상세 설정</h3>
                <p className="text-gray-600 whitespace-pre-line">{item.detailedDescription}</p>
              </div>

              {item.specifications && item.specifications.length > 0 && (
                <div>
                  <h3 className="mb-3">세부 사항</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-gray-500">{spec.label}:</span>
                        <span className="">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
