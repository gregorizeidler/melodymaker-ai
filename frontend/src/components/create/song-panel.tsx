"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Music, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { generateSong, type GenerateRequest } from "~/actions/generation";

const inspirationTags = [
  "80s synth-pop",
  "Acoustic ballad",
  "Epic movie score",
  "Lo-fi hip hop",
  "Driving rock anthem",
  "Summer beach vibe",
];

const styleTags = [
  "Industrial rave",
  "Heavy bass",
  "Orchestral",
  "Electronic beats",
  "Funky guitar",
  "Soulful vocals",
  "Ambient pads",
];

export default function SongPanel() {
  const [mode, setMode] = useState<"simple" | "custom">("simple");
  const [description, setDescription] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [lyricsMode, setLyricsMode] = useState<"write" | "auto">("write");
  const [lyrics, setLyrics] = useState("");
  const [styleInput, setStyleInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInspirationTagClick = (tag: string) => {
    const currentTags = description
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!currentTags.includes(tag)) {
      if (description.trim() === "") {
        setDescription(tag);
      } else {
        setDescription(description + ", " + tag);
      }
    }
  };
  const handleStyleTagClick = (tag: string) => {
    const currentTags = styleInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (!currentTags.includes(tag)) {
      if (styleInput.trim() === "") {
        setStyleInput(tag);
      } else {
        setStyleInput(styleInput + ", " + tag);
      }
    }
  };

  const handleCreate = async () => {
    if (mode == "simple" && !description.trim()) {
      toast.error("Please enter a description for your song.");
      return;
    }
    if (mode == "custom" && !styleInput.trim()) {
      toast.error("Please add some styles to your song.");
      return;
    }

    let requestBody: GenerateRequest;

    if (mode == "simple") {
      requestBody = {
        fullDescribedSong: description,
        instrumental,
      };
    } else {
      requestBody = {
        prompt: styleInput,
        lyrics: lyricsMode === "write" ? lyrics : undefined,
        describedLyrics: lyricsMode === "auto" ? lyrics : undefined,
        instrumental,
      };
    }

    try {
      setLoading(true);
      await generateSong(requestBody);
      setDescription("");
      setInstrumental(false);
      setLyrics("");
      setStyleInput("");
      toast.success("Your song has been queued for generation!");
    } catch {
      toast.error("An error occurred while creating your song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/30 flex w-full flex-col border-r lg:w-80">
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as "simple" | "custom")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="simple" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Describe your song</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A dreamy lofi hip hog song, perfect for studying or relaxing"
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("custom");
                }}
              >
                <Plus /> Lyrics
              </Button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Instrumental</label>
                <Switch
                  checked={instrumental}
                  onCheckedChange={setInstrumental}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Inspiration</label>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {inspirationTags.map((tag) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 flex-shrink-0 bg-transparent text-xs"
                      key={tag}
                      onClick={() => {
                        handleInspirationTagClick(tag);
                      }}
                    >
                      <Plus /> {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lyrics</label>
                <div className="flex items-center gap-1">
                  <Button
                    className="h-7 text-xs"
                    variant={lyricsMode === "auto" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setLyricsMode("auto");
                      setLyrics("");
                    }}
                  >
                    Auto
                  </Button>
                  <Button
                    className="h-7 text-xs"
                    variant={lyricsMode === "write" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setLyricsMode("write");
                      setLyrics("");
                    }}
                  >
                    Write
                  </Button>
                </div>
              </div>
              <Textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={
                  lyricsMode === "write"
                    ? "Write your lyrics here..."
                    : "Describe your lyrics and we'll generate them for you..."
                }
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Instrumental</label>
              <Switch
                checked={instrumental}
                onCheckedChange={setInstrumental}
              />
            </div>

            {/* Styles */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Styles</label>
              <Textarea
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
                placeholder="Enter styles tags"
                className="min-h-[60px] resize-none"
              />
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                  {styleTags.map((tag) => (
                    <Badge
                      variant="secondary"
                      key={tag}
                      className="hover:bg-secondary/80 flex-shrink-0 cursor-pointer text-xs"
                      onClick={() => handleStyleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t p-4">
        <Button
          onClick={handleCreate}
          disabled={loading}
          size="lg"
          className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 font-medium text-white hover:from-orange-600 hover:to-pink-600"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Music />}
          {loading ? "Creating..." : "Create Song"}
        </Button>
      </div>
    </div>
  );
}
