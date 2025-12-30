import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "@/components/builder/builder-client";

interface BuilderPageProps {
  params: Promise<{ cardId: string }>;
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const session = await auth();
  const { cardId } = await params;

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/builder/" + cardId);
  }

  // Fetch card data
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      template: true,
    },
  });

  if (!card) {
    redirect("/dashboard");
  }

  // Auth check: only owner can edit
  if (card.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return <BuilderClient card={card} />;
}
