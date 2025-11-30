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
import { useDeleteUser } from "@/lib/hooks/mutations/use-users";

export function DeleteUser({ id }: { id: string }) {
    const [open, setOpen] = useState(false);
    const deleteUser = useDeleteUser(id);

    const handleDelete = async () => {
        await deleteUser.mutateAsync();
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
                        Are you sure you want to delete this user?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete this
                        user account and all associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteUser.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteUser.isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {deleteUser.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

