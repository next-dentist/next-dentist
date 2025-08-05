"use client";

import { Suspense } from "react";
import VerifyEmail from "./VerifyEmail";

export default function VerifyEmailClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
