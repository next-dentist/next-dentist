"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
