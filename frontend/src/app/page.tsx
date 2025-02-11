import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { ChatApp } from "./components/ChatApp";
import { AppSidebar } from "./components/AppSidebar";
import { SelectedVersionProvider } from "./components/ModelVersionContext";

export default function Home() {
  return (
    <SelectedVersionProvider>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
            </div>
          </header>
          <ChatApp/>
        </SidebarInset>
      </SidebarProvider>
    </SelectedVersionProvider>
  );
}
