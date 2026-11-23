import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const allowed = ['image/jpeg', 'image/png', 'image/webp'];

export const validateImageFile = (file: File) => {
  if (!allowed.includes(file.type)) return 'Please select a JPG, PNG, or WebP image.';
  if (file.size > 5 * 1024 * 1024) return 'Image size must be less than 5MB.';
  return null;
};

type ImageUploaderProps = { currentImage?: string | null; multiple?: boolean; disabled?: boolean; uploading?: boolean; onFilesChange: (files: File[]) => void; onRemove?: () => void; };

export function ImageUploader({ currentImage, multiple = false, disabled, uploading, onFilesChange, onRemove }: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const choose = (list: FileList | null) => {
    const next = Array.from(list || []);
    const invalid = next.map(validateImageFile).find(Boolean);
    if (invalid) { setError(invalid); return; }
    setError(null); setFiles(next); onFilesChange(next);
  };
  const remove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next); onFilesChange(next);
  };

  return <div className="space-y-3">
    <div className="flex flex-wrap gap-3">
      {currentImage && !files.length && <div className="relative h-24 w-36 overflow-hidden rounded-md border"><img src={currentImage} alt="Current image" className="h-full w-full object-cover" />{onRemove && <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-7 w-7" onClick={onRemove} disabled={disabled || uploading}><X className="h-4 w-4" /></Button>}</div>}
      {files.map((file, index) => <div key={`${file.name}-${index}`} className="relative h-24 w-36 overflow-hidden rounded-md border"><img src={previews[index]} alt={file.name} className="h-full w-full object-cover" /><Button type="button" size="icon" variant="secondary" className="absolute right-1 top-1 h-7 w-7" onClick={() => remove(index)} disabled={disabled || uploading}><X className="h-4 w-4" /></Button><span className="absolute inset-x-0 bottom-0 truncate bg-black/65 px-1 py-0.5 text-xs text-white">{file.name}</span></div>)}
    </div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} className="hidden" onChange={e => choose(e.target.files)} />
    <Button type="button" variant="outline" onClick={() => input.current?.click()} disabled={disabled || uploading}>{uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}{uploading ? 'Uploading...' : multiple ? 'Choose Images' : 'Choose Image'}</Button>
    <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP · maximum 5MB per image</p>{error && <p className="text-sm text-destructive">{error}</p>}
  </div>;
}
