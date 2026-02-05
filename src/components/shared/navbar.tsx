import { UserNav } from "./user-nav"; // We'll build this next

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
      <div className="text-sm text-muted-foreground italic">
        Viewing as Administrator
      </div>
      <div className="flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
