"use client";

import { useState, useEffect } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import Image from "next/image";

interface Anime {
  title: string;
  genres: string[];
  score: number;
  episodes: number;
  year: string;
  images: {
    jpg: {
      image_url: string;
    };
    webp?: {
      image_url: string;
    };
  };
  synopsis: string;
}

export default function AnimePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      const trimmed = query.trim();

      if (trimmed.length === 0) {
        setResults([]);
        setError(null);
        return;
      }

      const id = Number(trimmed);
      if (isNaN(id) || id <= 0) {
        setError("Please enter a valid numeric ID.");
        setResults([]);
        return;
      }

      setError(null);
      setResults([]);

      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await response.json();
        if (!response.ok) {
          const message = data?.message || "Unknown API error";
          console.error("API Error:", response.status, message);
          setError(
            `Anime with ID ${id} not found or API error (${response.status}).`,
          );
          return;
        }
        setResults([data.data]);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Failed to fetch anime data. Please check your connection.");
      }
    };

    const timeoutId = setTimeout(fetchAnime, 1000);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center pt-6 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-3">Search ID</h1>

        {/* Search Bar */}
        <Command className="bg-neutral-900 border border-neutral-700 rounded-lg">
          <CommandInput
            className="text-white bg-neutral-900 placeholder-neutral-500 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Anime ID (e.g., 1, 21, 5114)..."
            value={query}
            onValueChange={setQuery}
          />
        </Command>

        {/* Anime Result Display */}
        <div className="pt-8">
          {results.length > 0 && (
            <div className="bg-neutral-800 p-6 rounded-lg flex flex-col sm:flex-row gap-6">
              {/* Image */}
              <div className="flex-shrink-0 w-full sm:w-1/3">
                <Image
                  src={results[0].images?.jpg?.image_url}
                  alt={results[0].title}
                  width={640}
                  height={480}
                  className="rounded-lg w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 sm:w-2/3">
                <div className="bg-neutral-700 rounded-md px-4 py-2">
                  <strong>Title:</strong> {results[0].title}
                </div>
                <div className="bg-neutral-700 rounded-md px-4 py-2">
                  <strong>Genre:</strong>{" "}
                  {results[0].genres?.map((g) => g.name).join(", ")}
                </div>
                <div className="bg-neutral-700 rounded-md px-4 py-2">
                  <strong>Score:</strong> {results[0].score ?? "N/A"}
                </div>
                <div className="bg-neutral-700 rounded-md px-4 py-2">
                  <strong>Episodes:</strong> {results[0].episodes}
                </div>
                <div className="bg-neutral-700 rounded-md px-4 py-2">
                  <strong>Year:</strong> {results[0].year ?? "Unknown"}
                </div>
                <div className="bg-neutral-700 rounded-md px-4 py-3 mt-2">
                  <strong>Synopsis:</strong>
                  <p className="text-sm mt-1">{results[0].synopsis}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
