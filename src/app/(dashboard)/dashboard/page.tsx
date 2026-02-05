import { createClient } from "@/utils/supabase/server";
import { CourseCard } from "@/components/shared/course-card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch courses and count their modules (chapters)
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      modules (id)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Courses</h2>
          <p className="text-muted-foreground">Manage and create your knowledge products.</p>
        </div>
        <Link href="/dashboard/courses/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {courses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No courses found. Start by creating one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              thumbnailUrl={course.thumbnail_url}
              chapterCount={course.modules.length}
              price={149} // You can pull this from your DB or Stripe
              isPublished={course.is_published}
            />
          ))}
        </div>
      )}
    </div>
  );
}
