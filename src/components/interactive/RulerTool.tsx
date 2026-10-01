import React, { useRef, useState } from 'react';
import { RotateCw, RotateCcw, X } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface RulerToolProps {
  visible: boolean;
  onClose: () => void;
  isLocked?: boolean;
}

export const RulerTool: React.FC<RulerToolProps> = ({ visible, onClose, isLocked = false }) => {
  const [pos, setPos] = useState({ x: 260, y: 180 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const rotateStartRef = useRef({ startAngle: 0, startRot: 0 });

  if (!visible) return null;

  const width = 460;
  const height = 70;
  const cmCount = 20;

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

    const angle = Math.atan2(e.clientY - (pos.y + height / 2), e.clientX - (pos.x + width / 2));
    rotateStartRef.current = {
      startAngle: angle * (180 / Math.PI),
      startRot: rotation,
    };
    playSound.click();
  };

  const handleRotateMove = (e: React.PointerEvent) => {
    if (!isRotating || isLocked) return;
    const angle = Math.atan2(e.clientY - (pos.y + height / 2), e.clientX - (pos.x + width / 2));
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
        transformOrigin: 'center center',
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
        style={{ width: `${width}px`, height: `${height}px` }}
        className="relative bg-amber-50/90 border-2 border-amber-600 rounded-xl flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-sm"
      >
        {/* Close & Rotate buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button
            onClick={() => setRotation((r) => (r + 45) % 360)}
            className="p-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900"
            title="Xoay 45°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800"
            title="Ẩn thước"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ruler graduations (cm & mm) along top edge */}
        <div className="w-full h-10 border-b border-amber-400 relative">
          {Array.from({ length: cmCount * 10 + 1 }).map((_, i) => {
            const isCm = i % 10 === 0;
            const isHalfCm = i % 5 === 0 && !isCm;
            const leftPct = (i / (cmCount * 10)) * 100;
            const h = isCm ? 22 : isHalfCm ? 14 : 8;

            return (
              <div
                key={i}
                style={{ left: `${leftPct}%`, height: `${h}px` }}
                className={`absolute top-0 w-[1.5px] ${isCm ? 'bg-slate-900 font-bold' : 'bg-slate-700'}`}
              >
                {isCm && (
                  <span className="absolute top-5 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-900">
                    {i / 10}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Ruler center info */}
        <div className="px-4 pb-2 flex items-center justify-between text-xs text-amber-900 font-bold font-cartoon">
          <span>📐 THƯỚC THẲNG HỌC SINH (20 cm)</span>
          <span className="text-[10px] text-amber-700 font-mono">{rotation}°</span>
        </div>
      </div>

      {/* Rotation Knob */}
      <div
        onPointerDown={handleRotateDown}
        onPointerMove={handleRotateMove}
        onPointerUp={handleRotateUp}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 border-2 border-white"
        title="Kéo để xoay thước"
      >
        <RotateCw className="w-4 h-4" />
      </div>
    </div>
  );
};
