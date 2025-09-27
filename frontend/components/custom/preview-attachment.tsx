import { Attachment } from "ai";
import { useEffect, useState } from "react";
import { LoaderIcon } from "./icons";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Reset states when attachment changes
    setImageLoaded(false);
    setImageError(false);
  }, [attachment]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', url);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Failed to load image:', url);
    setImageError(true);
  };

  return (
    <div className="flex flex-col gap-2 max-w-16">
      <div className="h-20 w-16 bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType && contentType.startsWith("image") && url && !isUploading ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={name ?? "An image attachment"}
              className={`rounded-md size-full object-cover ${!imageLoaded ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && !imageError && (
              <div className="animate-spin text-zinc-500">
                <LoaderIcon />
              </div>
            )}
            {imageError && (
              <div className="text-red-500 text-xs text-center">
                Failed to load
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-xs text-zinc-500">
            {isUploading ? '' : (contentType ? contentType.split('/')[1] : 'File')}
          </div>
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon />
          </div>
        )}
      </div>

      <div className="text-xs text-zinc-500 max-w-16 truncate">
        {name ? name.split('/').pop() : "Unnamed file"}
      </div>
    </div>
  );
};