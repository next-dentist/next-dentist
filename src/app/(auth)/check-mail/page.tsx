"use client";
import CheckEmail from "@/app/(auth)/check-mail/CheckMail";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <CheckEmail />
    </Suspense>
  );
}
