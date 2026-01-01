import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cardCustomizationSchema } from "@/lib/validations/card";

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
    const { cardId, ...customizationData } = body;

    if (!cardId) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      );
    }

    // Validate customization data
    const validatedData = cardCustomizationSchema.parse(customizationData);

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

    // Update card
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        recipientName: validatedData.recipientName,
        senderName: validatedData.senderName,
        message: validatedData.message,
        backgroundType: validatedData.backgroundType,
        backgroundColor: validatedData.backgroundColor,
        backgroundUrl: validatedData.backgroundUrl,
        musicUrl: validatedData.musicUrl,
        musicVolume: validatedData.musicVolume,
        arEffects: validatedData.arEffects,
        voiceTriggers: validatedData.voiceTriggers,
        gestureTriggers: validatedData.gestureTriggers,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      card: updatedCard,
    });
  } catch (error) {
    console.error("Save card error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save card" },
      { status: 500 }
    );
  }
}
