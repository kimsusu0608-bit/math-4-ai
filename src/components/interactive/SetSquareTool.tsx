import React, { useRef, useState } from 'react';
import { RotateCw, X } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface SetSquareToolProps {
  visible: boolean;
  onClose: () => void;
  isLocked?: boolean;
}

export const SetSquareTool: React.FC<SetSquareToolProps> = ({ visible, onClose, isLocked = false }) => {
  const [pos, setPos] = useState({ x: 420, y: 190 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const rotateStartRef = useRef({ startAngle: 0, startRot: 0 });

  if (!visible) return null;

  const size = 260;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    playSound.click();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isLocked) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPos({
      x: Math.round(dragStartRef.current.startX + dx),
      y: Math.round(dragStartRef.current.startY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleRotateDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    setIsRotating(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const angle = Math.atan2(e.clientY - (pos.y + size / 2), e.clientX - (pos.x + size / 2));
    rotateStartRef.current = {
      startAngle: angle * (180 / Math.PI),
      startRot: rotation,
    };
    playSound.click();
  };

  const handleRotateMove = (e: React.PointerEvent) => {
    if (!isRotating || isLocked) return;
    const angle = Math.atan2(e.clientY - (pos.y + size / 2), e.clientX - (pos.x + size / 2));
    const currentAngle = angle * (180 / Math.PI);
    const delta = currentAngle - rotateStartRef.current.startAngle;
    let next = Math.round((rotateStartRef.current.startRot + delta) % 360);
    if (next < 0) next += 360;
    setRotation(next);
  };

  const handleRotateUp = (e: React.PointerEvent) => {
    setIsRotating(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: '0 0',
        touchAction: 'none',
        zIndex: 36,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
      className="select-none filter drop-shadow-2xl"
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="ekeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Outer triangle (Right isosceles 90-45-45) */}
          <polygon
            points={`0,0 ${size},0 0,${size}`}
            fill="url(#ekeGrad)"
            stroke="#ca8a04"
            strokeWidth="3"
          />

          {/* Inner cutout triangle */}
          <polygon
            points={`35,35 ${size - 75},35 35,${size - 75}`}
            fill="#ffffff"
            fillOpacity="0.4"
            stroke="#ca8a04"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* 90-degree corner square symbol */}
          <rect x="0" y="0" width="22" height="22" fill="none" stroke="#e11d48" strokeWidth="2.5" />
          <circle cx="11" cy="11" r="2.5" fill="#e11d48" />

          {/* Text labels */}
          <text x="32" y="24" fill="#e11d48" fontSize="12" fontWeight="900">
            90° (Vuông)
          </text>
          <text x={size - 60} y="22" fill="#854d0e" fontSize="11" fontWeight="bold">
            45°
          </text>
          <text x="12" y={size - 25} fill="#854d0e" fontSize="11" fontWeight="bold">
            45°
          </text>
          <text x="48" y="90" fill="#854d0e" fontSize="11" fontWeight="900" transform="rotate(-45 48 90)">
            Ê-KE TOÁN 4
          </text>
        </svg>

        {/* Close & Rotate */}
        <div className="absolute top-2 right-12 flex items-center gap-1 z-10">
          <button
            onClick={() => setRotation((r) => (r + 45) % 360)}
            className="p-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900"
            title="Xoay 45°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800"
            title="Ẩn ê-ke"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rotate Handle */}
        <div
          onPointerDown={handleRotateDown}
          onPointerMove={handleRotateMove}
          onPointerUp={handleRotateUp}
          className="absolute -right-2 top-0 w-8 h-8 rounded-full bg-yellow-500 text-white shadow-lg flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 border-2 border-white"
          title="Kéo để xoay ê-ke"
        >
          <RotateCw className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
