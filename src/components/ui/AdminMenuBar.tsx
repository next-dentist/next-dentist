'use client';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { siteConfig } from '@/config';

import Link from 'next/link';

export default function AdminMenuBar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Admin Menu</MenubarTrigger>
        <MenubarContent>
          {siteConfig.adminLinks.map((link) => (
            <MenubarItem key={link.name}>
              <Link href={link.href}>{link.name}</Link>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
