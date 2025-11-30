import { ColumnDef } from "@tanstack/react-table";
import { Video } from "@/types/video";
import { UpdateVideo } from "@/components/dialogs/video/update-video";
import { DeleteVideo } from "@/components/dialogs/video/delete-video";
import { PlayVideo } from "@/components/dialogs/video/play-video";
import Image from "next/image";

export const Columns = (): ColumnDef<Video>[] => {
  return [
    {
      accessorKey: "thumbnail",
      header: () => <div className="text-start">Thumbnail</div>,
      cell: ({ row }) => {
        const thumbnail = row.original.thumbnail;
        return (
          <div className="w-16 h-10">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={row.original.title}
                width={64}
                height={40}
                className="rounded object-cover w-full h-full"
              />
            ) : (
              <span className="text-muted-foreground text-xs">
                No thumbnail
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => <div className="text-start">Title</div>,
      cell: ({ row }) => {
        const title = row.original.title;
        return (
          <div className="max-w-48">
            <span className="block truncate" title={title}>
              {title}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "video",
      header: () => <div className="text-start">Video</div>,
      cell: ({ row }) => {
        const videoUrl = row.original.video;
        return (
          <div className="flex items-center">
            {videoUrl ? (
              <PlayVideo videoUrl={videoUrl} title={row.original.title} />
            ) : (
              <span className="text-muted-foreground">No video</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: () => <div className="text-start">Duration (min)</div>,
      cell: ({ row }) => {
        const duration = row.original.duration;
        return (
          <div className="max-w-24">
            <span>{duration || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: () => <div className="text-start">Category</div>,
      cell: ({ row }) => {
        const categoryName = (row.original as any).categoryName || row.original.category || "-";
        return (
          <div className="max-w-32">
            <span className="block truncate" title={categoryName}>
              {categoryName}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const rowId = row.original.id;
        if (!rowId) return null;
        return (
          <div className="flex justify-center items-center gap-2">
            <UpdateVideo id={rowId} />
            <DeleteVideo id={rowId} />
          </div>
        );
      },
    },
  ];
};
