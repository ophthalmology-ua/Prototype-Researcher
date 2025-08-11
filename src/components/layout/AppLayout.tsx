import { PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-3 gap-3">
            <SidebarTrigger aria-label="Toggle navigation" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-sm" style={{ backgroundImage: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }} />
              <span className="font-semibold tracking-tight">AMD Ocular Insight</span>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {isMobile ? "Research UI" : "OCT Research Dashboard Prototype"}
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
