"use client";
import { Loader } from "@/components/reuseable/loader";
import { DataNotFound } from "@/components/data-not-found";
import { AddVideo } from "@/components/dialogs/video/add-video";
import { useVideos } from "@/lib/hooks/queries/use-videos";
import { useCategories } from "@/lib/hooks/queries/use-categories";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleTable } from "@/components/ui/simple-table";
import { Columns } from "./columns";
import { useMemo } from "react";

export default function VideosPage() {
  const { data, isLoading, error, isError } = useVideos();
  const { data: categoriesData } = useCategories();
  const columns = Columns();

  // Create a map of category ID to category name
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    if (categoriesData?.data) {
      categoriesData.data.forEach((category) => {
        if (category.id) {
          map.set(category.id, category.title);
        }
      });
    }
    return map;
  }, [categoriesData]);

  // Enhance video data with category names
  const videosWithCategoryNames = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((video) => ({
      ...video,
      categoryName: categoryMap.get(video.category) || video.category || "Unknown",
    }));
  }, [data?.data, categoryMap]);

  // Check if error is 404 (no data)
  const is404Error = error && (error as any)?.response?.status === 404;
  const isOtherError = isError && !is404Error;
  const hasData = videosWithCategoryNames && videosWithCategoryNames.length > 0;

  return (
    <Card className="w-full h-full min-h-full border-transparent">
      <CardHeader>
        <CardTitle>Videos</CardTitle>
        <CardDescription>Manage Videos</CardDescription>
        <CardAction>
          <AddVideo />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full mx-auto py-10">
          {isLoading && <Loader />}

          {!isLoading && !hasData && !isOtherError && (
            <DataNotFound />
          )}

          {isOtherError && (
            <div className="m-auto w-fit h-auto pb-10 text-destructive">
              Error: {(error as any)?.response?.data?.message || (error as any)?.message || "An error occurred"}
            </div>
          )}

          {!isLoading && hasData && (
            <div>
              <SimpleTable
                columns={columns}
                data={videosWithCategoryNames}
                maxHeight="650px"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
