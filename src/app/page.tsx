import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-black ">
      <div className="flex flex-col md:flex-row items-center gap-20 md:gap-70">
        <Link href="/anime">
          <Button
            className="size-40 text-4xl md:size-96 md:text-7xl text-white shadow-lg shadow-blue-500"
            variant="link"
          >
            ANIME
          </Button>
        </Link>

        <Link href="/manga">
          <Button
            className="size-40 text-4xl md:size-96 md:text-7xl text-white shadow-lg shadow-blue-500"
            variant="link"
          >
            MANGA
          </Button>
        </Link>
      </div>
    </div>
  );
}
