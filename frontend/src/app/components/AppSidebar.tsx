"use client"

import React, { useEffect } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Check, ChevronsUpDown } from "lucide-react"

import { useSelectedVersion } from "./ModelVersionContext";

interface Version {
  key: string;
  label: string;
}

export function AppSidebar() {
  const [versions, setVersions] = React.useState<Version[]>([])
  const { selectedVersion, setSelectedVersion } = useSelectedVersion();

  useEffect(() => {
    const fetchVersions = async () => {
      const response = await fetch("/api/model", {
        method: "GET"
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data: Version[] = await response.json();
      setVersions(data);
    };
    fetchVersions();
  }, []);

  return (
    <Sidebar>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
              >
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Model</span>
                  <span className="">{selectedVersion.label}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width]"
              align="start"
            >
              {versions.map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onSelect={() => setSelectedVersion(item)}
                >
                  {item.label}{" "}
                  {item.key === selectedVersion.key && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
