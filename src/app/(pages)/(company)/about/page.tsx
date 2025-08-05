"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import AboutPageClient from "./AboutPageClient";

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div>
          <LoadingSpinner fullScreen />
        </div>
      }
    >
      <AboutPageClient />
    </Suspense>
  );
}
