import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-violet-500 shadow-md py-4 px-8 flex items-center justify-center gap-4">
      <div className="flex max-w-6xl w-full items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/logo_img.svg" alt="Study Lovers" width={60} height={60} className="object-contain mb-2" />
          <h1 className="text-white text-2xl font-bold">Study Lovers</h1>
        </Link>
      </div>
    </header>
  );
} 