import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  chapterCount: number;
  price: number | null;
  isPublished?: boolean;
}

export const CourseCard = ({
  id,
  title,
  thumbnailUrl,
  chapterCount,
  price,
  isPublished
}: CourseCardProps) => {
  return (
    <Link href={`/dashboard/courses/${id}`}>
      <Card className="group hover:shadow-md transition overflow-hidden border h-full">
        <div className="relative w-full aspect-video rounded-t-md overflow-hidden bg-slate-100">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={thumbnailUrl || "/placeholder-course.jpg"}
          />
        </div>
        <CardContent className="p-4 flex flex-col gap-y-2">
          <div className="text-lg font-semibold group-hover:text-blue-600 transition line-clamp-2">
            {title}
          </div>
          <div className="flex items-center gap-x-1 text-slate-500 text-sm">
            <div className="rounded-full bg-blue-100 p-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <span>
              {chapterCount} {chapterCount === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            {price !== null ? (
              <p className="text-md font-bold text-slate-700">
                ${price.toLocaleString()}
              </p>
            ) : (
              <p className="text-md font-bold text-green-600">Free</p>
            )}
            
            {isPublished !== undefined && (
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Published" : "Draft"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
