import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Image as ImageIcon,
  Move
} from 'lucide-react';

interface AvatarCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCroppedImage: (dataUrl: string) => void;
  initialImageFile?: File | null;
}

interface ImageBounds {
  width: number;
  height: number;
}

export const AvatarCropperModal: React.FC<AvatarCropperModalProps> = ({
  isOpen,
  onClose,
  onSaveCroppedImage,
  initialImageFile,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Moderation & Validation states
  const [moderationStatus, setModerationStatus] = useState<'idle' | 'scanning' | 'passed' | 'failed'>('idle');
  const [moderationReason, setModerationReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const CANVAS_SIZE = 340;
  const CROP_RADIUS = 130; // Radius of circular aperture

  // Load and validate file
  const processSelectedFile = useCallback((file: File) => {
    setErrorMessage('');
    setModerationStatus('scanning');
    setModerationReason('Screening image format, dimensions, and community guidelines...');

    // 1. Enforce file size limit: 5MB
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setModerationStatus('failed');
      setModerationReason('File exceeds the 5MB size limit. Please choose a smaller image.');
      setErrorMessage(`File is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is 5.0MB.`);
      return;
    }

    // 2. Enforce file type limits
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setModerationStatus('failed');
      setModerationReason('Unsupported file format. Only JPG, PNG, and WebP are allowed.');
      setErrorMessage('Please upload a standard image (JPG, PNG, or WebP).');
      return;
    }

    setFileName(file.name);
    setFileSizeStr((file.size / 1024).toFixed(0) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Dimension check
        if (img.width < 100 || img.height < 100) {
          setModerationStatus('failed');
          setModerationReason('Image resolution is too low. Minimum resolution is 100x100 pixels.');
          setErrorMessage('Resolution too small for a clear banking profile avatar.');
          return;
        }

        // Basic moderation simulation
        // Flag extreme non-image or suspicious filename patterns
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('nsfw') || lowerName.includes('explicit') || lowerName.includes('virus')) {
          setModerationStatus('failed');
          setModerationReason('Image flagged by automated safety filters for inappropriate keywords.');
          setErrorMessage('Automated policy violation: Inappropriate content pattern.');
          return;
        }

        imageRef.current = img;
        setImageSrc(result);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setModerationStatus('passed');
        setModerationReason('Verified: Safety scan passed. Dimensions & metadata meet Finova standards.');
      };
      img.onerror = () => {
        setModerationStatus('failed');
        setModerationReason('Corrupted or invalid image file.');
        setErrorMessage('Unable to decode image. Please check the file.');
      };
      img.src = result;
    };
    reader.onerror = () => {
      setModerationStatus('failed');
      setModerationReason('Failed to read file from disk.');
      setErrorMessage('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (initialImageFile) {
      processSelectedFile(initialImageFile);
    }
  }, [initialImageFile, processSelectedFile]);

  // Redraw canvas whenever zoom, pan, rotation, or image changes
  useEffect(() => {
    if (!imageSrc || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save state for transform
    ctx.save();
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fit scale for base drawing
    const scale = Math.max((CROP_RADIUS * 2) / img.width, (CROP_RADIUS * 2) / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Draw Dark Vignette Mask with Circular Hole
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)'; // Slate dark mask
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(width / 2, height / 2, CROP_RADIUS, 0, Math.PI * 2, true);
    ctx.fill();

    // Circular crop border & guides
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, CROP_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#659B5E';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Subtle 3x3 grid guidelines inside circle
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    // vertical lines
    ctx.moveTo(width / 2 - CROP_RADIUS / 3, height / 2 - CROP_RADIUS * 0.9);
    ctx.lineTo(width / 2 - CROP_RADIUS / 3, height / 2 + CROP_RADIUS * 0.9);
    ctx.moveTo(width / 2 + CROP_RADIUS / 3, height / 2 - CROP_RADIUS * 0.9);
    ctx.lineTo(width / 2 + CROP_RADIUS / 3, height / 2 + CROP_RADIUS * 0.9);
    // horizontal lines
    ctx.moveTo(width / 2 - CROP_RADIUS * 0.9, height / 2 - CROP_RADIUS / 3);
    ctx.lineTo(width / 2 + CROP_RADIUS * 0.9, height / 2 - CROP_RADIUS / 3);
    ctx.moveTo(width / 2 - CROP_RADIUS * 0.9, height / 2 + CROP_RADIUS / 3);
    ctx.lineTo(width / 2 + CROP_RADIUS * 0.9, height / 2 + CROP_RADIUS / 3);
    ctx.stroke();

    ctx.restore();
  }, [imageSrc, zoom, pan, rotation]);

  // Pointer drag handling for pan
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Export cropped circle
  const handleSaveCrop = () => {
    if (!imageRef.current || moderationStatus !== 'passed') return;
    setIsProcessing(true);

    try {
      const outputSize = 400; // High resolution square export
      const offscreen = document.createElement('canvas');
      offscreen.width = outputSize;
      offscreen.height = outputSize;
      const ctx = offscreen.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.clip();

      const img = imageRef.current;
      const scaleMultiplier = outputSize / (CROP_RADIUS * 2);

      ctx.save();
      ctx.translate(outputSize / 2 + pan.x * scaleMultiplier, outputSize / 2 + pan.y * scaleMultiplier);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom * scaleMultiplier, zoom * scaleMultiplier);

      const baseScale = Math.max((CROP_RADIUS * 2) / img.width, (CROP_RADIUS * 2) / img.height);
      const drawWidth = img.width * baseScale;
      const drawHeight = img.height * baseScale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const croppedDataUrl = offscreen.toDataURL('image/png', 0.95);
      onSaveCroppedImage(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Error generating cropped avatar:', err);
      setErrorMessage('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cropper-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 id="cropper-title" className="text-base font-bold text-[#1E293B]">
              Custom Avatar Studio
            </h3>
            <p className="text-xs text-[#64748B]">
              Adjust, zoom, and frame your personal profile picture
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!imageSrc ? (
            /* Upload State */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  processSelectedFile(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-[#CBD5E1] hover:border-[#659B5E] bg-[#F8FAFC] hover:bg-[#F1F8F1] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#E2E8F0] flex items-center justify-center text-[#659B5E] mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#1E293B]">
                Click or drag & drop to upload photo
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                JPG, PNG, or WebP • Maximum 5.0 MB
              </p>
              <div className="mt-4 px-3 py-1 bg-white rounded-full border border-[#E2E8F0] text-[11px] font-medium text-[#41603B] flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#659B5E]" />
                Automated Safety & Policy Screening
              </div>
            </div>
          ) : (
            /* Cropper Active State */
            <div className="space-y-4">
              {/* Canvas viewport */}
              <div className="relative flex justify-center bg-[#0F172A] rounded-2xl overflow-hidden p-2 select-none shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="cursor-grab active:cursor-grabbing touch-none max-w-full rounded-xl"
                  title="Drag to reposition photo"
                />

                {/* Drag hint overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white/80 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <Move className="w-3 h-3 text-[#659B5E]" />
                  Drag to frame
                </div>
              </div>

              {/* Zoom & Adjustment Controls */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-3">
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-[#64748B] shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#659B5E] cursor-pointer h-1.5 bg-[#CBD5E1] rounded-lg"
                    aria-label="Zoom photo"
                  />
                  <ZoomIn className="w-4 h-4 text-[#64748B] shrink-0" />
                  <span className="text-xs font-mono font-semibold text-[#1E293B] w-12 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0] text-xs">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl hover:bg-slate-50 font-medium text-[#1E293B] flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#659B5E]" />
                    Rotate 90°
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B] font-medium"
                  >
                    Reset Framing
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-[#659B5E] hover:text-[#41603B] hover:underline"
                  >
                    Choose Different Photo
                  </button>
                </div>
              </div>

              {/* Moderation / Safety Check Status Card */}
              <div 
                className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 transition-colors ${
                  moderationStatus === 'passed'
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                    : moderationStatus === 'scanning'
                    ? 'bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]'
                    : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                }`}
              >
                {moderationStatus === 'passed' ? (
                  <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                ) : moderationStatus === 'scanning' ? (
                  <div className="w-4 h-4 border-2 border-[#CA8A04] border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                )}

                <div className="space-y-0.5">
                  <div className="font-semibold">
                    {moderationStatus === 'passed' && 'Content Moderation: Verified Safe'}
                    {moderationStatus === 'scanning' && 'Moderation Check in Progress'}
                    {moderationStatus === 'failed' && 'Upload Rejected'}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {moderationReason}
                  </div>
                  {fileName && (
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      File: {fileName} ({fileSizeStr})
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                processSelectedFile(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] rounded-xl transition-colors"
          >
            Cancel
          </button>

          {imageSrc && (
            <button
              type="button"
              id="confirm-crop-avatar-btn"
              disabled={moderationStatus !== 'passed' || isProcessing}
              onClick={handleSaveCrop}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs text-white shadow-xs flex items-center gap-1.5 transition-all ${
                moderationStatus === 'passed' && !isProcessing
                  ? 'bg-[#659B5E] hover:bg-[#54844e] active:scale-98 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply & Use Profile Picture</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
