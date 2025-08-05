// app/_lib/getLocation.ts
"use server";
import { cookies } from "next/headers";
import { z } from "zod";

export async function getRequesterLocation() {
  const raw = (await cookies()).get("geo")?.value;
  if (!raw) return null;

  const parsed = z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    ts:  z.number()
  }).safeParse(JSON.parse(raw));

  // refresh once a day
  if (!parsed.success || (Date.now() - parsed.data.ts) > 86_400_000) {
    return null;
  }
  return { lat: parsed.data.lat, lon: parsed.data.lon } as const;
}
