import Link from "next/link";
import { LayoutDashboard, Video, Users, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Courses", icon: Video, href: "/dashboard/courses" },
  { label: "Students", icon: Users, href: "/dashboard/students" },
  { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r">
      <div className="px-6 py-2">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">KajabiLMS</h1>
      </div>
      <div className="flex-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start hover:bg-white/10 mb-1"
            )}
          >
            <route.icon className="mr-3 h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
