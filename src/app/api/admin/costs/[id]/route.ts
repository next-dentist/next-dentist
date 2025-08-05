import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const costSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  treatmentMetaId: z.string().optional(),
  description: z.string().optional(),
});

async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return false;
  }
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const cost = await db.cost.findMany({
      where: { id },
    });

    if (!cost) {
      return NextResponse.json({ error: "Cost not found" }, { status: 404 });
    }

    return NextResponse.json(cost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cost" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const validatedData = costSchema.parse(body);

    const cost = await db.cost.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(cost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update cost" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const cost = await db.cost.delete({
      where: { id },
    });

    return NextResponse.json(cost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cost" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = costSchema.parse(body);

    const cost = await db.cost.create({
      data: validatedData as any,
    });

    return NextResponse.json(cost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create cost" },
      { status: 500 }
    );
  }
}
