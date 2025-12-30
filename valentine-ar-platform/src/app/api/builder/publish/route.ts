import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishCardSchema } from "@/lib/validations/card";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cardId, ...publishData } = body;

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      );
    }

    // Validate publish data
    const validatedData = publishCardSchema.parse(publishData);

    // Verify card ownership
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    if (card.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't own this card" },
        { status: 403 }
      );
    }

    // Additional validation for publishing
    if (validatedData.isPublished) {
      if (!card.recipientName || !card.senderName || !card.message) {
        return NextResponse.json(
          { error: "Card must have recipient name, sender name, and message before publishing" },
          { status: 400 }
        );
      }
    }

    // Update card publish status
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        isPublished: validatedData.isPublished,
        expiresAt: validatedData.expiresAt,
        updatedAt: new Date(),
      },
    });

    // Generate shareable link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareableLink = validatedData.isPublished
      ? `${baseUrl}/view/${updatedCard.slug}`
      : "";

    return NextResponse.json({
      success: true,
      card: updatedCard,
      shareableLink,
    });
  } catch (error) {
    console.error("Publish card error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to publish card" },
      { status: 500 }
    );
  }
}
