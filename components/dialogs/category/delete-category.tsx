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
import { useDeleteCategory } from "@/lib/hooks/mutations/use-categories";

export function DeleteCategory({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const deleteCategory = useDeleteCategory(id);

    const handleDelete = async () => {
        await deleteCategory.mutateAsync();
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
                        Are you sure you want to delete this category?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete this
                        category and all videos linked to it. All associated video files
                        and thumbnails will also be removed from storage.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteCategory.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteCategory.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteCategory.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

