import { BuilderProvider } from "@/components/builder/builder-provider";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BuilderProvider>{children}</BuilderProvider>;
}
