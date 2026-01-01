import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const templates = [
  {
    title: "Romantic Hearts",
    description: "Classic romantic theme with floating hearts and soft glow effects. Perfect for expressing deep love.",
    previewImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
    price: 4.99,
    polarProductId: "demo_romantic_hearts",
    isActive: true,
    sortOrder: 1,
    availableEffects: ["hearts", "glow", "confetti"],
    availableMusic: ["romantic-piano", "acoustic-love", "gentle-strings"],
    defaultConfig: {
      backgroundUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
      defaultEffects: ["hearts"],
    },
  },
  {
    title: "Magical Fireworks",
    description: "Celebrate your love with stunning firework explosions and sparkle effects. Great for special occasions.",
    previewImage: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
    price: 5.99,
    polarProductId: "demo_magical_fireworks",
    isActive: true,
    sortOrder: 2,
    availableEffects: ["fireworks", "glow", "hearts", "confetti"],
    availableMusic: ["celebration", "romantic-piano", "upbeat-love"],
    defaultConfig: {
      backgroundUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800",
      defaultEffects: ["fireworks"],
    },
  },
  {
    title: "Sweet Confetti",
    description: "Fun and playful theme with colorful confetti rain. Perfect for joyful celebrations.",
    previewImage: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800",
    price: 3.99,
    polarProductId: "demo_sweet_confetti",
    isActive: true,
    sortOrder: 3,
    availableEffects: ["confetti", "hearts", "glow"],
    availableMusic: ["playful", "acoustic-love", "celebration"],
    defaultConfig: {
      backgroundUrl: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=800",
      defaultEffects: ["confetti"],
    },
  },
  {
    title: "Dreamy Glow",
    description: "Soft, ethereal theme with gentle glow effects. Creates a magical, intimate atmosphere.",
    previewImage: "https://images.unsplash.com/photo-1473552912822-de36ce21ed2b?w=800",
    price: 4.49,
    polarProductId: "demo_dreamy_glow",
    isActive: true,
    sortOrder: 4,
    availableEffects: ["glow", "hearts"],
    availableMusic: ["gentle-strings", "romantic-piano", "ambient-love"],
    defaultConfig: {
      backgroundUrl: "https://images.unsplash.com/photo-1473552912822-de36ce21ed2b?w=800",
      defaultEffects: ["glow"],
    },
  },
]

async function main() {
  console.log("Seeding templates...")

  for (const template of templates) {
    const existing = await prisma.template.findUnique({
      where: { polarProductId: template.polarProductId },
    })

    if (existing) {
      console.log(`Template ${template.title} already exists, updating...`)
      await prisma.template.update({
        where: { polarProductId: template.polarProductId },
        data: template,
      })
    } else {
      console.log(`Creating template: ${template.title}`)
      await prisma.template.create({ data: template as any })
    }
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
