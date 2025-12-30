import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch card with template data
    const card = await prisma.card.findUnique({
      where: { slug },
      include: {
        template: {
          select: {
            title: true,
            previewImage: true,
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Check if card is published
    if (!card.isPublished) {
      return NextResponse.json(
        { error: "Card not published" },
        { status: 403 }
      );
    }

    // Check if card is expired
    if (card.expiresAt && card.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Card has expired" },
        { status: 410 }
      );
    }

    // Increment view count
    await prisma.card.update({
      where: { id: card.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
    });

    // Track analytics event
    await prisma.analytics.create({
      data: {
        cardId: card.id,
        eventType: "view",
        eventData: {},
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    // Return card data
    return NextResponse.json({
      id: card.id,
      slug: card.slug,
      recipientName: card.recipientName,
      senderName: card.senderName,
      message: card.message,
      backgroundType: card.backgroundType,
      backgroundColor: card.backgroundColor,
      backgroundUrl: card.backgroundUrl,
      musicUrl: card.musicUrl,
      musicVolume: card.musicVolume,
      arEffects: card.arEffects,
      voiceTriggers: card.voiceTriggers,
      gestureTriggers: card.gestureTriggers,
      template: card.template,
      viewCount: card.viewCount + 1,
    });
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
}
