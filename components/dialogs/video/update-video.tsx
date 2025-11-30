"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    VideoSchema,
    VideoFormFields as Inputs,
} from "@/schemas/video.schema";
import { useUpdateVideo } from "@/lib/hooks/mutations/use-videos";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { useVideoById } from "@/lib/hooks/queries/use-videos";
import { IconEdit } from "@tabler/icons-react";
import { InputFormField } from "@/components/reuseable/input-form-field";
import { FileUploadFormField } from "@/components/reuseable/file-upload-form-field";
import { SelectFormField } from "@/components/select-form-field";
import { useCategories } from "@/lib/hooks/queries/use-categories";
import { SelectOption } from "@/types/global";
import { uploadToFirebase } from "@/lib/firebase/firebase-upload";
import Image from "next/image";

export function UpdateVideo({ id }: { id: string }) {
    const schema = VideoSchema();
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const updateMutation = useUpdateVideo(id);
    const { data } = useVideoById(id);
    const { data: categoriesData, isSuccess: isCategoriesSuccess } = useCategories();
    const [uploadProgress, setUploadProgress] = useState<{
        thumbnail?: number;
        video?: number;
    }>({});
    const [isUploading, setIsUploading] = useState(false);

    const video = data?.data;
    const categories = categoriesData?.data ?? [];

    const form = useForm<Inputs>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: video?.title ?? "",
            duration: video?.duration ?? "",
            category: video?.category ?? "",
        },
    });

    // Update form when video data loads
    useEffect(() => {
        if (video) {
            form.reset({
                title: video.title ?? "",
                duration: video.duration ?? "",
                category: video.category ?? "",
            });
        }
    }, [video, form]);

    if (!user || !user?.uid) return null;

    const options: SelectOption[] = [];
    if (isCategoriesSuccess && categories.length > 0) {
        for (const item of categories) {
            options.push({
                label: item.title,
                value: item.id!,
            });
        }
    }

    const submitForm: SubmitHandler<Inputs> = async (formData) => {
        try {
            setIsUploading(true);
            setUploadProgress({});

            const oldThumbnailUrl = video?.thumbnail;
            const oldVideoUrl = video?.video;

            let thumbnailUrl: string | undefined = oldThumbnailUrl;
            let videoUrl: string | undefined = oldVideoUrl;

            // Upload thumbnail to Firebase if new file is provided
            if (formData.thumbnail && formData.thumbnail instanceof File) {
                thumbnailUrl = await uploadToFirebase(
                    formData.thumbnail,
                    "video",
                    `thumbnail-${Date.now()}-${formData.thumbnail.name}`,
                    (progress) => setUploadProgress((prev) => ({ ...prev, thumbnail: progress }))
                );
            }

            // Upload video to Firebase if new file is provided
            if (formData.video && formData.video instanceof File) {
                videoUrl = await uploadToFirebase(
                    formData.video,
                    "video",
                    `video-${Date.now()}-${formData.video.name}`,
                    (progress) => setUploadProgress((prev) => ({ ...prev, video: progress }))
                );
            }

            // Prepare payload - only include fields that are being updated
            const payload: any = {
                title: formData.title,
                category: formData.category,
            };

            // Only include duration if it's provided
            if (formData.duration !== undefined && formData.duration !== null) {
                payload.duration = formData.duration;
            }

            // Only include thumbnail/video URLs if they exist
            if (thumbnailUrl) {
                payload.thumbnail = thumbnailUrl;
            }
            if (videoUrl) {
                payload.video = videoUrl;
            }

            // Include old URLs so server can delete them if they're being replaced
            if (formData.thumbnail && formData.thumbnail instanceof File && oldThumbnailUrl) {
                payload._oldThumbnailUrl = oldThumbnailUrl;
            }
            if (formData.video && formData.video instanceof File && oldVideoUrl) {
                payload._oldVideoUrl = oldVideoUrl;
            }

            const res = await updateMutation.mutateAsync(payload);
            if (res.success) {
                form.reset();
                setUploadProgress({});
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Error updating video:", error);
        } finally {
            setIsUploading(false);
            setUploadProgress({});
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <IconEdit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update Video</DialogTitle>
                    <DialogDescription>Update Video</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6">
                        <div className="grid gap-4">
                            <InputFormField
                                name="title"
                                label="Video Title"
                                formControl={form.control}
                                placeholder="Video Title"
                            />

                            {/* Existing Thumbnail Preview */}
                            {video?.thumbnail && !form.watch("thumbnail") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Thumbnail</label>
                                    <div className="relative w-32 h-20 border rounded overflow-hidden">
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title || "Thumbnail"}
                                            width={128}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            <FileUploadFormField
                                name="thumbnail"
                                label="Upload New Thumbnail (Optional - leave empty to keep current)"
                                formControl={form.control}
                                accept={{ "image/*": [] }}
                                maxFiles={1}
                                maxSize={10 * 1024 * 1024} // 10 MB
                                multiple={false}
                                dropText="Drop a image file here or click to select"
                                dragText="Drop image"
                            />
                            {uploadProgress.thumbnail !== undefined && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Uploading thumbnail...</span>
                                        <span className="font-medium">{Math.round(uploadProgress.thumbnail)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress.thumbnail}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Existing Video Preview */}
                            {video?.video && !form.watch("video") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Video</label>
                                    <div className="w-full max-w-md">
                                        <video
                                            src={video.video}
                                            controls
                                            className="w-full rounded object-contain"
                                            preload="metadata"
                                            style={{ maxHeight: "200px" }}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            )}

                            <FileUploadFormField
                                name="video"
                                label="Upload New Video (Optional - leave empty to keep current)"
                                formControl={form.control}
                                accept={{ "video/*": [] }}
                                maxFiles={1}
                                maxSize={50 * 1024 * 1024} // 50 MB
                                multiple={false}
                                dropText="Drop a video file here or click to select"
                                dragText="Drop video"
                            />
                            {uploadProgress.video !== undefined && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Uploading video...</span>
                                        <span className="font-medium">{Math.round(uploadProgress.video)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress.video}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            <SelectFormField
                                name="category"
                                label="Category"
                                formControl={form.control}
                                placeholder="Select"
                                options={options}
                                isRequired
                            />
                            <InputFormField
                                name="duration"
                                label="Duration(in minutes)"
                                formControl={form.control}
                                placeholder="50"
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                disabled={
                                    !form.formState.isValid || form.formState.isSubmitting || updateMutation.isPending || isUploading
                                }
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <span>Update</span>
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

