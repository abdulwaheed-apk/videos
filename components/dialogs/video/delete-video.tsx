import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useDeleteVideo } from "@/lib/hooks/mutations/use-videos";

export function DeleteVideo({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const deleteVideo = useDeleteVideo(id);

    const handleDelete = async () => {
        await deleteVideo.mutateAsync();
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <IconTrash />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this video?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete this
                        video.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteVideo.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteVideo.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteVideo.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

