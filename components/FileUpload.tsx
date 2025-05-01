"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import lConfig from "@/lib/config";

interface FileUploadProps {
  type: "image" | "file";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (fileUrl: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const abortController = useRef<AbortController>(new AbortController());

  const styles = {
    button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border border-gray-100",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
  };

  const authenticator = async () => {
    try {
  
      const response = await fetch(`${lConfig.apiEndPoint}/auth/imagekit`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to authenticate");
      }
      return await response.json();
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Could not get upload credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Create local preview for images
      if (type === "image") {
        const previewUrl = URL.createObjectURL(file);
        setLocalPreview(previewUrl);
      }
      
      // Start upload automatically when file is selected
      handleUpload(file);
    }
  };

  const handleUpload = async (file?: File) => {
    const uploadFile = file || fileInputRef.current?.files?.[0];
    if (!uploadFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    abortController.current = new AbortController();

    try {
      // File validation
      if (type === "image" && uploadFile.size > 20 * 1024 * 1024) {
        throw new Error("Image size must be less than 20MB");
      }

      const { signature, expire, token, publicKey } = await authenticator();

      toast({
        title: "Upload Started",
        description: "Your file is being uploaded...",
      });

      const result = await upload({
        file: uploadFile,
        fileName: uploadFile.name,
        folder,
        publicKey,
        signature,
        expire,
        token,
        onProgress: (e) => {
          const newProgress = Math.round((e.loaded / e.total) * 100);
          setProgress(newProgress);
        },
        abortSignal: abortController.current.signal,
      });

      onFileChange(result.url!);
      toast({
        title: "Upload Successful!",
        description: `${uploadFile.name} has been uploaded successfully.`,
      });
    } catch (error) {
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: unknown) => {
    if (error instanceof ImageKitAbortError) {
      toast({
        title: "Upload Cancelled",
        description: "The upload was cancelled by the user.",
      });
    } else if (error instanceof ImageKitInvalidRequestError) {
      toast({
        title: "Invalid Request",
        description: "The file or upload parameters are invalid.",
        variant: "destructive",
      });
    } else if (error instanceof ImageKitUploadNetworkError) {
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } else if (error instanceof ImageKitServerError) {
      toast({
        title: "Server Error",
        description: "ImageKit servers are experiencing issues. Please try later.",
        variant: "destructive",
      });
    } else if (error instanceof Error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelUpload = () => {
    abortController.current.abort();
    toast({
      title: "Cancelling Upload",
      description: "Your upload is being cancelled...",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview Section */}
      {(localPreview || value) && type === "image" && (
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <img
            src={localPreview || value || ""}
            alt="Preview"
            className="object-contain w-full h-full"
            onLoad={() => {
              if (localPreview) URL.revokeObjectURL(localPreview);
            }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant={variant === "dark" ? "default" : "outline"}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn("w-full", styles.button)}
        >
          <Image
            src="/icons/upload.svg"
            alt="Upload"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className={styles.placeholder}>
            {isUploading ? `Uploading... ${progress}%` : placeholder}
          </span>
        </Button>

        {isUploading && (
          <Button
            type="button"
            variant="destructive"
            onClick={cancelUpload}
            className="w-24"
          >
            Cancel
          </Button>
        )}
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;