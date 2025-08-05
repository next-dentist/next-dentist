"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith("/dashboard");

  return (
    <div className="flex items-center gap-2">
      <Link href={isDashboardPath ? "/" : "/dashboard"}>
        <Image src="/logo.png" alt="Logo" width={200} height={70} />
      </Link>
    </div>
  );
}
