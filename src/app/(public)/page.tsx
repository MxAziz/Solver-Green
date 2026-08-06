import Image from "next/image";
import Link from "next/link";

// ata main home page, jeta tee home page ar bivinno section add kora hobe.......
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          This website is under Development
          </h1>

        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
          <button className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 md:w-39.5">
            <Link href="/dashboard">Dashboard</Link>
          </button>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-39.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
