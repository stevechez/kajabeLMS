import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
}

export const CourseProgress = ({
  value,
  variant,
  size,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress
        className="h-2"
        value={value}
        // Custom coloring based on variant if desired
      />
      <p className={cn(
        "font-medium mt-2 text-slate-700",
        size === "sm" && "text-xs",
      )}>
        {Math.round(value)}% Complete
      </p>
    </div>
  )
}
