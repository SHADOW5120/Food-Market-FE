'use client';

import { useRef, useState } from 'react';
import { UploadIcon } from '../auth/Icons';

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
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-6xl overflow-hidden mb-4 flex-shrink-0 shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>👤</span>
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={clearPreview}
            disabled={isLoading}
            className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors disabled:opacity-50"
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
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-orange-400 bg-gray-50'
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
          <UploadIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Drag and drop your image here
          </p>
          <p className="text-xs text-gray-500">
            or click to select a file (max 5MB)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Make sure to save your profile changes for the avatar to be uploaded.
        </p>
      </div>
    </div>
  );
}
