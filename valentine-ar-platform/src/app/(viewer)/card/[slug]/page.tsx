import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ARViewerClient } from "./client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const card = await prisma.card.findUnique({
    where: { slug },
    select: {
      recipientName: true,
      senderName: true,
      message: true,
      template: {
        select: {
          previewImage: true,
        },
      },
    },
  });

  if (!card) {
    return {
      title: "Card Not Found",
    };
  }

  return {
    title: `Valentine Card for ${card.recipientName}`,
    description: `A special Valentine AR greeting card from ${card.senderName}`,
    openGraph: {
      title: `Valentine Card for ${card.recipientName}`,
      description: card.message,
      images: [card.template.previewImage],
    },
  };
}

export default async function ARViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch card data
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
    notFound();
  }

  // Check if card is published
  if (!card.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Card Not Ready
          </h1>
          <p className="text-gray-600">
            This card hasn&apos;t been published yet. Please check back later!
          </p>
        </div>
      </div>
    );
  }

  // Check if card is expired
  if (card.expiresAt && card.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Card Expired
          </h1>
          <p className="text-gray-600">
            This card has expired and is no longer available.
          </p>
        </div>
      </div>
    );
  }

  // Prepare card data for client
  const cardData = {
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
    viewCount: card.viewCount,
  };

  return <ARViewerClient cardData={cardData} />;
}
