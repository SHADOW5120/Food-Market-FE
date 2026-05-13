'use client';

import { Lightbulb, UploadCloud, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onAvatarChange: (file: File) => void;
  isLoading?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  username,
  onAvatarChange,
  isLoading = false,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onAvatarChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-6xl overflow-hidden mb-4 flex-shrink-0 shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16" />
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={clearPreview}
            disabled={isLoading}
            className="text-sm text-destructive hover:text-destructive font-semibold transition-colors disabled:opacity-50"
          >
            Remove Preview
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-[color:hsl(var(--border))] hover:border-accent bg-muted'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          onClick={() => fileInputRef.current?.click()}
          className="hidden"
          disabled={isLoading}
        />
        
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          <UploadCloud className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground mb-1">
            Drag and drop your image here
          </p>
          <p className="text-xs text-muted-foreground">
            or click to select a file (max 5MB)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-muted border border-[color:hsl(var(--border))] border-[color:hsl(var(--border))] rounded-lg p-4">
        <div className="flex items-start gap-2 text-sm text-foreground">
          <Lightbulb className="w-5 h-5 mt-1 text-primary" />
          <p>
            <strong>Tip:</strong> Make sure to save your profile changes for the avatar to be uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}



