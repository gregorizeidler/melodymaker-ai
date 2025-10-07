"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { searchSongs, getAvailableGenres } from "~/actions/search";
import { SongCard } from "~/components/home/song-card";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const songs = await searchSongs({ query });
      setResults(songs);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Music</h1>
        <p className="text-muted-foreground mt-2">
          Find songs by title, genre, or artist
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search for songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <SearchIcon className="h-4 w-4" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {results.length} {results.length === 1 ? "result" : "results"}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground mt-4">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
