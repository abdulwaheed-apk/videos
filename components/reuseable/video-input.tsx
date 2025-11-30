import React, { useCallback, useRef, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Video, Trash2, Upload, StopCircle, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// --- Mock Utilities and Constants (Using Tailwind for styling) ---
const MAX_VIDEO_SIZE = 1024 * 1024 * 100; // 100MB
const SUPPORTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

type Props = {
  value?: File;
  onChange: (file: File | undefined) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
};

export function VideoInput({ value, onChange, error, className = "" }: Props) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const tLabels = useTranslations("admin.questions.addQuestionForm.labels");

  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Determine if we have an uploaded file or recorded file
  const isRecordedFile = useMemo(
    () => value && recordedVideoUrl,
    [value, recordedVideoUrl],
  );

  // --- Clear Video ---
  const clearVideo = useCallback(() => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    // Stop local stream if it's active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setRecordedVideoUrl(null);
    videoChunksRef.current = [];
    onChange(undefined);
  }, [onChange, recordedVideoUrl]);

  // --- Dropzone (File Upload) ---
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file size
      if (file.size > MAX_VIDEO_SIZE) {
        console.error("Video file exceeds 100MB limit");
        return;
      }

      // Clear any existing recorded video or active stream
      clearVideo();

      onChange(file);
    },
    [onChange, clearVideo],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": SUPPORTED_VIDEO_MIME_TYPES },
    maxFiles: 1,
    maxSize: MAX_VIDEO_SIZE,
    disabled: isRecording || !!value,
  });

  // --- Recording ---
  const startRecording = async () => {
    clearVideo();
    videoChunksRef.current = [];

    try {
      // Request video and audio permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      // Attach stream to preview video element
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
        // Use play() inside a timeout for better compatibility
        setTimeout(
          () =>
            previewVideoRef.current
              ?.play()
              .catch((e) => console.error("Play failed", e)),
          0,
        );
      }

      recorder.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        // Simple MIME type check for webm (common cross-browser format)
        const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
          ? "video/webm; codecs=vp9"
          : MediaRecorder.isTypeSupported("video/webm")
            ? "video/webm"
            : "video/mp4";

        const videoBlob = new Blob(videoChunksRef.current, { type: mimeType });
        const extension = mimeType.includes("webm") ? "webm" : "mp4";

        const videoFile = new File(
          [videoBlob],
          `recorded-video-${Date.now()}.${extension}`,
          { type: mimeType },
        );

        const url = URL.createObjectURL(videoFile);
        setRecordedVideoUrl(url);
        onChange(videoFile);

        // Clear the preview video source object
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = null;
        }

        // Stop media tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera and microphone:", error);
      setIsRecording(false);
      // Ensure all tracks are stopped if an error occurs
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // --- Render Values ---
  const videoName = value
    ? isRecordedFile
      ? `${tLabels("recordedVideo")} (${value.type.split("/")[1]})`
      : value.name
    : tLabels("noVideoLabel");

  const videoUrl = value
    ? isRecordedFile
      ? recordedVideoUrl
      : URL.createObjectURL(value)
    : null;

  return (
    <Card
      className={cn(
        "p-6 space-y-4 bg-gray-50 border border-gray-200",
        className,
      )}
    >
      <p className="text-center text-gray-500 text-sm">
        {tLabels("videoLabel")}
      </p>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200",
          isDragActive && "border-blue-500 bg-blue-50",
          !isDragActive && "border-gray-300 hover:border-blue-400",
          (isRecording || value) &&
            "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Upload className="w-8 h-8 text-blue-500" />
          <p className="text-lg font-medium text-gray-700">
            {isDragActive
              ? tLabels("dropVideoLabel")
              : tLabels("dragVideoLabel")}
          </p>
          <p className="text-sm text-gray-500">
            {tLabels("supportedVideoLabel")}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-gray-500 font-semibold">
            {tLabels("or")}
          </span>
        </div>
      </div>

      {/* Recorder */}
      <div className="text-center p-4 bg-gray-100 rounded-lg border border-gray-200 space-y-4">
        <Label className="text-base text-gray-800">
          {" "}
          {tLabels("recordNewVideoLabel")}{" "}
        </Label>

        {/* Live Preview / Placeholder */}
        <div className="relative w-full max-w-full max-h-[720px] aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-md">
          {isRecording && (
            <div className="absolute top-2 left-2 flex items-center space-x-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span> {tLabels("live")} </span>
            </div>
          )}
          <video
            ref={previewVideoRef}
            className={cn(
              "w-full h-full  object-cover bg-black",
              !isRecording && !value ? "hidden" : "block",
            )}
            autoPlay
            muted={true} // Mute the live stream preview
            playsInline
          />

          {/* Placeholder for when no stream is active and no file is selected */}
          {!isRecording && !value && (
            <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full text-gray-500">
              <Video className="w-12 h-12" />
              <p className="mt-2 text-sm"> {tLabels("cameraPreviewLabel")} </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center items-center space-x-4">
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isRecording && !!value}
            className={
              isRecording
                ? "bg-red-600 hover:bg-red-700 transition-transform transform hover:scale-105"
                : "bg-green-600 hover:bg-green-700 transition-transform transform hover:scale-105"
            }
          >
            {isRecording ? (
              <StopCircle className="w-5 h-5 mr-2" />
            ) : (
              <PlayCircle className="w-5 h-5 mr-2" />
            )}
            {isRecording ? tLabels("stopRecording") : tLabels("startRecording")}
          </Button>

          {isRecording && (
            <div className="flex items-center space-x-2 text-red-600 font-semibold">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span>{tLabels("recording")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview/Playback of Selected File */}
      <div className="p-4 border rounded-lg bg-white shadow-inner space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          {tLabels("currentVideoLabel")}
        </h3>
        <p
          className={cn(
            "font-mono text-sm",
            value ? "text-blue-600" : "text-gray-500",
          )}
        >
          {videoName}
        </p>

        {value && videoUrl && (
          <div className="flex items-center space-x-4">
            <video
              controls
              src={videoUrl}
              className="w-full max-w-sm rounded-lg shadow-md"
              playsInline
            />
            <Button
              type="button"
              onClick={clearVideo}
              variant="destructive"
              size="icon"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </Card>
  );
}

export default VideoInput;
