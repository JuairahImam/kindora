"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Link as LinkIcon, X, Check, Camera, Image as ImageIcon } from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  aspect?: "square" | "banner";
  placeholder?: string;
  error?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  required = false,
  aspect = "banner",
  placeholder = "Upload image or paste link",
  error,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [compressing, setCompressing] = useState(false);
  const [urlInput, setUrlInput] = useState(value && !value.startsWith("data:") ? value : "");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return;
    }

    try {
      setCompressing(true);
      const maxWidth = aspect === "square" ? 500 : 1200;
      const maxHeight = aspect === "square" ? 500 : 800;
      const compressed = await compressImageFile(file, maxWidth, maxHeight, 0.85);
      onChange(compressed);
    } catch (err) {
      console.error("Image processing error:", err);
    } finally {
      setCompressing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSquare = aspect === "square";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-theme-heading flex items-center gap-1.5">
          {isSquare ? (
            <Camera className="w-4 h-4 text-theme-primary" />
          ) : (
            <ImageIcon className="w-4 h-4 text-theme-primary" />
          )}
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 bg-theme-bg p-0.5 rounded-lg border border-theme-border text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              mode === "upload"
                ? "bg-theme-surface text-theme-primary shadow-xs font-bold"
                : "text-theme-body hover:text-theme-heading"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              mode === "url"
                ? "bg-theme-surface text-theme-primary shadow-xs font-bold"
                : "text-theme-body hover:text-theme-heading"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Active Preview if image exists */}
      {value ? (
        <div className="relative rounded-2xl border-2 border-theme-border bg-theme-surface p-3 overflow-hidden group">
          <div
            className={`relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 ${
              isSquare ? "w-28 h-28 mx-auto" : "w-full h-44"
            }`}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized={value.startsWith("data:")}
            />
          </div>

          {/* Action buttons on hover */}
          <div className="flex items-center justify-between pt-2 px-1 text-xs text-theme-body">
            <span className="truncate max-w-[200px]">
              {value.startsWith("data:") ? "Uploaded Image File" : value}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-semibold text-theme-primary hover:underline cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="font-semibold text-red-500 hover:underline cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : mode === "upload" ? (
        /* Drag & Drop Upload Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer bg-theme-surface/50 hover:bg-theme-primary-soft/30 ${
            dragActive
              ? "border-theme-primary bg-theme-primary-soft"
              : error
              ? "border-red-500"
              : "border-theme-border hover:border-theme-primary"
          }`}
        >
          {compressing ? (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <div className="w-8 h-8 border-3 border-theme-border border-t-theme-primary rounded-full animate-spin" />
              <p className="text-xs font-semibold text-theme-heading">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="w-12 h-12 rounded-2xl bg-theme-primary-soft text-theme-primary flex items-center justify-center shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-theme-heading">
                  Click to upload <span className="font-normal text-theme-body">or drag and drop</span>
                </p>
                <p className="text-xs text-theme-body">PNG, JPG, WebP, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Paste URL Input */
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-body pointer-events-none" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className={`w-full h-11 pl-10 pr-4 rounded-xl border-2 bg-theme-surface text-theme-heading text-sm outline-none transition-all ${
                  error
                    ? "border-red-500"
                    : "border-theme-border focus:border-theme-primary"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              className="btn-secondary h-11 px-4 text-xs font-bold gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Apply
            </button>
          </div>
          <p className="text-[11px] text-theme-body">
            Paste any direct image URL from Unsplash or other sources.
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-medium">⚠ {error}</p>}
    </div>
  );
}
