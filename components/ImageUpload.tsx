"use client";

import { Image, Video, ImageKitProvider, upload } from "@imagekit/next";

import { useRef, useState } from "react";
import NextImage from "next/image";

import { cn } from "@/lib/utils";
import config from "@/lib/config";
import { toast } from "sonner"

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

// Function to get upload authentication parameters from your API
const getUploadAuthParams = async () => {
  try {
    // const response = await fetch(`${config.env.prodApiEndpoint}/api/auth/imagekit`);
     const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token, publicKey } = data;

    return { token, expire, signature, publicKey };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
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
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);
    setIsUploading(false);
    setProgress(0);

    toast.error(`${type} upload failed`, {
  description: `Your ${type} could not be uploaded. Please try again.`
});
  };

  const onSuccess = (res: any) => {
    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);
    setIsUploading(false);
    setProgress(100);

   toast.success(`${type} uploaded successfully`, {
  description: `${res.filePath} uploaded successfully!`
});
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        
        toast.warning("File size too large", {
          description: "Please upload a file that is less than 20MB in size",
        });
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
       
        toast.warning("File size too large", {
          description: "Please upload a file that is less than 50MB in size",
        });
        return false;
      }
    }
    return true;
  };

  const handleFileUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
   
    toast.warning("No file selected", {
      description: "Please select a file to upload",
    });
      return;
    }

    const selectedFile = fileInput.files[0];

    // Validate file
    if (!onValidate(selectedFile)) {
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Get authentication parameters
      const authParams = await getUploadAuthParams();

      // Upload file using the new SDK
      const uploadResponse = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        folder: folder,
        useUniqueFileName: true,
        ...authParams,
        onProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        },
      });

      onSuccess(uploadResponse);
    } catch (error: any) {
      onError(error);
    }
  };

  return (
    <ImageKitProvider
      publicKey ={publicKey}
      urlEndpoint={urlEndpoint}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Upload button */}
      <button
        className={cn(" flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (fileInputRef.current && !isUploading) {
            fileInputRef.current.click();
          }
        }}
        disabled={isUploading}
      >
        <NextImage
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>
          {isUploading ? "Uploading..." : placeholder}
        </p>

        {file.filePath && (
          <p className={cn("mt-1 text-center text-xs", styles.text)}>{file.filePath}</p>
        )}
      </button>

      {/* Progress bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {/* Display uploaded file */}
      {file.filePath &&
        (type === "image" ? (
          <Image
            src={file.filePath}
            alt={file.filePath}
            width={500}
            height={300}
            className="mt-4 rounded-lg"
          />
        ) : type === "video" ? (
          <Video
            src={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl mt-4"
          />
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;