"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "./Header";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const isManageDentistPath = pathname?.startsWith("/manage-dentists");

  return <>{!isManageDentistPath && <Header />}</>;
};

export default NavBar;
