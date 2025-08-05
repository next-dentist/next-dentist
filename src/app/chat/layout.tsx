'use client';

import { SocketProvider } from '@/providers/SocketProvider';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return <SocketProvider>{children}</SocketProvider>;
}
