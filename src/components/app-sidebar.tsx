import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getSidebarData } from "@/config";
import { Dentist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
// This is sample data.

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  dentist: Dentist;
}

export function AppSidebar({ dentist, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Image
          src={dentist.image || "/images/default-avatar.png"}
          alt={dentist.name || ""}
          width={64}
          height={64}
          className="rounded-full object-cover border-2 border-primary/20"
        />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {getSidebarData(dentist.id).navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-md font-bold">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-md">
                      <Link href={item.url}>
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
