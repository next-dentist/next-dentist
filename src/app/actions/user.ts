"use server";

import { db } from "@/db";
import { saltAndHashPassword } from "@/lib/utils";
import { User } from "@prisma/client";

export async function getUser(email: string) {
  const user: User | null = await db.user.findUnique({ where: { email } });
  return user;
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await saltAndHashPassword(password);

  const user: User = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      emailVerified: false,
    },
  });
  return user;
}
