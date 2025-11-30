"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";

export function PlayVideo({ videoUrl, title }: { videoUrl: string; title?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!videoUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Play className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title || "Video Player"}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}

