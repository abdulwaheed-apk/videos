"use client";
import { useState } from "react";
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
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateVideo } from "@/lib/hooks/mutations/use-videos";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { InputFormField } from "@/components/reuseable/input-form-field";
import { VideoSchema, VideoFormFields as Inputs } from "@/schemas/video.schema";
import { FileUploadFormField } from "@/components/reuseable/file-upload-form-field";
import { SelectFormField } from "@/components/select-form-field";
import { useCategories } from "@/lib/hooks/queries/use-categories";
import { SelectOption } from "@/types/global";
import { uploadToFirebase } from "@/lib/firebase/firebase-upload";

export function AddVideo() {
  const schema = VideoSchema();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateVideo();
  const { data, isSuccess } = useCategories();
  const [uploadProgress, setUploadProgress] = useState<{
    thumbnail?: number;
    video?: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
    }
  });

  if (!user || !user?.uid) return;

  const submitForm: SubmitHandler<Inputs> = async (formData) => {
    try {
      setIsUploading(true);
      setUploadProgress({});
      
      let thumbnailUrl: string | undefined;
      let videoUrl: string | undefined;

      // Upload thumbnail to Firebase
      if (formData.thumbnail) {
        thumbnailUrl = await uploadToFirebase(
          formData.thumbnail,
          "video",
          `thumbnail-${Date.now()}-${formData.thumbnail.name}`,
          (progress) => setUploadProgress((prev) => ({ ...prev, thumbnail: progress }))
        );
      }

      // Upload video to Firebase
      if (formData.video) {
        videoUrl = await uploadToFirebase(
          formData.video,
          "video",
          `video-${Date.now()}-${formData.video.name}`,
          (progress) => setUploadProgress((prev) => ({ ...prev, video: progress }))
        );
      }

      // Prepare payload with uploaded URLs
      const payload = {
        title: formData.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        category: formData.category,
        duration: formData.duration,
        isActive: true,
      };

      const res = await createMutation.mutateAsync(payload);
      if (res.success) {
        form.reset();
        setUploadProgress({});
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const options: SelectOption[] = [];
  const categories = data?.data ?? [];

  if (isSuccess && categories.length > 0) {
    for (const item of categories) {
      options.push({
        label: item.title,
        value: item.id!,
      });
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Video</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>Create a new Video</DialogDescription>
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
              <FileUploadFormField
                name="thumbnail"
                label="Upload Thumbnail"
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
              <FileUploadFormField
                name="video"
                label="Upload Video"
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
                  !form.formState.isValid || form.formState.isSubmitting || createMutation.isPending || isUploading
                }
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : createMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Submit</span>
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
