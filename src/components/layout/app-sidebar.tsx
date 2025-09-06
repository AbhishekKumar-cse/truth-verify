"use client";

import { signOut, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { BookCopy, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import Link from 'next/link';

import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { TruthLensIcon } from "@/components/icons";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
    user: User;
}

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link href={href}>
        <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-accent text-primary"
        )}>
            {children}
        </div>
    </Link>
)

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const getInitials = (email: string | null) => {
    if (!email) return <UserIcon className="h-5 w-5" />;
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <TruthLensIcon className="h-6 w-6 text-primary" />
                    <span>Truth Lens</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    <NavLink href="/dashboard" isActive={pathname === "/dashboard"}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </NavLink>
                    <NavLink href="/reports" isActive={pathname.startsWith("/reports")}>
                        <BookCopy className="h-4 w-4" />
                        My Reports
                    </NavLink>
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {getInitials(user.email)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">{user.email}</span>
                    </div>
                    <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <LogOut className="h-4 w-4" />
                        <span className="sr-only">Log out</span>
                    </Button>
                </div>
            </div>
        </div>
    </aside>
  );
}
