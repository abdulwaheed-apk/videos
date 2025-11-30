"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import {
  Controller,
  FieldPath,
  FieldValues,
  type Control,
} from "react-hook-form";
import { X } from "lucide-react";

type FileUploadFormFieldProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  formControl: Control<TFieldValues>;
  accept?: Accept; // react-dropzone Accept map, e.g. { "image/*": [] }
  maxFiles?: number;
  maxSize?: number; // bytes
  multiple?: boolean;
  dropText?: string;
  dragText?: string;
  className?: string;
};

export function FileUploadFormField<TFieldValues extends FieldValues>({
  name,
  label,
  formControl,
  accept,
  maxFiles = 1,
  maxSize,
  multiple = false,
  dropText = "Drop files here or click to select",
  dragText = "Drag & drop files",
  className = "",
}: FileUploadFormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={formControl}
      render={({ field, fieldState }) => {
        return (
          <InnerDropzone
            field={field}
            error={fieldState.error}
            accept={accept}
            maxFiles={maxFiles}
            maxSize={maxSize}
            multiple={multiple}
            label={label}
            dropText={dropText}
            dragText={dragText}
            className={className}
          />
        );
      }}
    />
  );
}

function InnerDropzone({
  field,
  error,
  accept,
  maxFiles,
  maxSize,
  multiple,
  label,
  dropText,
  dragText,
  className,
}: any) {
  const [previews, setPreviews] = useState<Array<{ file: File; url: string }>>(
    [],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
      // update react-hook-form value: either File or File[]
      field.onChange(multiple ? files : (files[0] ?? null));
    },
    [field, multiple],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    noClick: false,
    noKeyboard: false,
  });

  // create previews whenever field.value changes
  useEffect(() => {
    const value = field.value;
    const files: File[] = [];

    if (!value) {
      setPreviews([]);
      return;
    }
    if (Array.isArray(value)) files.push(...value);
    else files.push(value);

    const next = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews(next);

    return () => {
      next.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [field.value]);

  const removeFile = (index: number) => {
    if (!field.value) return;
    if (Array.isArray(field.value)) {
      const next = [...field.value];
      next.splice(index, 1);
      field.onChange(next);
    } else {
      field.onChange(null);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        {...getRootProps()}
        className={
          "w-full min-h-[120px] border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center " +
          (isDragActive ? "border-primary bg-slate-50" : "border-slate-200") +
          " cursor-pointer"
        }
      >
        <input {...getInputProps()} />
        <div className="select-none">
          <div className="text-sm font-semibold">
            {isDragActive ? dragText : dropText}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Allowed: {accept ? Object.keys(accept).join(", ") : "any"}
          </div>
        </div>
        <button type="button" onClick={open} className="sr-only" />
      </div>

      {previews.length > 0 && (
        <div className="flex gap-3 flex-wrap mt-2">
          {previews.map((p, i) => (
            <div
              key={p.url}
              className={`relative border rounded overflow-hidden ${p.file.type.startsWith("video/")
                  ? "w-64 h-36"
                  : "w-28 h-28"
                }`}
            >
              {p.file.type.startsWith("image/") ? (
                <img
                  src={p.url}
                  alt={p.file.name}
                  className="w-full h-full object-cover"
                />
              ) : p.file.type.startsWith("video/") ? (
                <video
                  src={p.url}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs p-2">
                  <div>
                    <div className="font-medium">{p.file.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {(p.file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow z-10"
                aria-label="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
