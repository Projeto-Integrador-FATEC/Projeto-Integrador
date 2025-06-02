import { Header } from "@/components/header";

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-zinc-900">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <main className="flex-1 mt-[105px]">
        {children}
      </main>
    </div>
  );
} 