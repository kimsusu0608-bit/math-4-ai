import React, { useRef, useState, useEffect } from 'react';
import { RotateCw, RotateCcw, Crosshair, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { ProtractorState } from './types';
import { playSound } from '../../utils/audio';

interface ProtractorToolProps {
  state: ProtractorState;
  onChange: (updater: (prev: ProtractorState) => ProtractorState) => void;
  targetVertex?: { x: number; y: number; label: string };
  isLocked?: boolean;
  tvMode?: boolean;
}

export const ProtractorTool: React.FC<ProtractorToolProps> = ({
  state,
  onChange,
  targetVertex,
  isLocked = false,
  tvMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPosX: number; startPosY: number }>({
    x: 0,
    y: 0,
    startPosX: 0,
    startPosY: 0,
  });
  const rotateStartRef = useRef<{ startAngle: number; initialRotation: number }>({
    startAngle: 0,
    initialRotation: 0,
  });

  // Track multi-touch pointers for pinch / 2-finger rotation
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());

  // Check if center is close to target vertex (snap threshold 28px)
  const distToVertex = targetVertex
    ? Math.hypot(state.x - targetVertex.x, state.y - targetVertex.y)
    : 999;
  const isNearVertex = distToVertex <= 28;

  // Geometry dimensions for standard SVG protractor (R = 210px)
  const R = 210;
  const innerR = 85;
  const scale = state.scale || 1.15;

  // Handle Drag Pointer
  const handleBodyPointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    e.preventDefault();

    // Register pointer
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 1) {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startPosX: state.x,
        startPosY: state.y,
      };
      playSound.click();
    }
  };

  const handleBodyPointerMove = (e: React.PointerEvent) => {
    if (isLocked) return;
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Two-finger touch rotation & pinch zoom
    if (activePointersRef.current.size >= 2) {
      const pts = Array.from(activePointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const currentTouchAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

      if ((rotateStartRef.current as any).touchAngle !== undefined) {
        const delta = currentTouchAngle - (rotateStartRef.current as any).touchAngle;
        onChange((prev) => ({
          ...prev,
          rotation: Math.round(((prev.rotation + delta) % 360 + 360) % 360),
        }));
      }
      (rotateStartRef.current as any).touchAngle = currentTouchAngle;
      return;
    }

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      let newX = Math.round(dragStartRef.current.startPosX + dx);
      let newY = Math.round(dragStartRef.current.startPosY + dy);

      // Smart magnetic snap when approaching vertex
      if (targetVertex && Math.hypot(newX - targetVertex.x, newY - targetVertex.y) < 22) {
        newX = targetVertex.x;
        newY = targetVertex.y;
      }

      onChange((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleBodyPointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size === 0) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      delete (rotateStartRef.current as any).touchAngle;
    }
  };

  // Handle Rotation Knob / Handle
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Calculate angle from center of protractor (state.x, state.y)
    const rect = containerRef.current?.parentElement?.getBoundingClientRect();
    const originX = rect ? rect.left + state.x : state.x;
    const originY = rect ? rect.top + state.y : state.y;

    const angleRad = Math.atan2(e.clientY - originY, e.clientX - originX);
    rotateStartRef.current = {
      startAngle: angleRad * (180 / Math.PI),
      initialRotation: state.rotation,
    };
    playSound.click();
  };

  const handleRotatePointerMove = (e: React.PointerEvent) => {
    if (!isRotating || isLocked) return;
    const rect = containerRef.current?.parentElement?.getBoundingClientRect();
    const originX = rect ? rect.left + state.x : state.x;
    const originY = rect ? rect.top + state.y : state.y;

    const angleRad = Math.atan2(e.clientY - originY, e.clientX - originX);
    const currentAngle = angleRad * (180 / Math.PI);
    const delta = currentAngle - rotateStartRef.current.startAngle;

    let newRot = Math.round((rotateStartRef.current.initialRotation + delta) % 360);
    if (newRot < 0) newRot += 360;

    // Optional snap to common cardinal angles within 2°
    [0, 30, 45, 60, 90, 120, 135, 150, 180, 270].forEach((cardinal) => {
      if (Math.abs(newRot - cardinal) < 2) newRot = cardinal;
    });

    onChange((prev) => ({
      ...prev,
      rotation: newRot,
    }));
  };

  const handleRotatePointerUp = (e: React.PointerEvent) => {
    setIsRotating(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Quick rotation step buttons
  const stepRotation = (delta: number) => {
    if (isLocked) return;
    playSound.click();
    onChange((prev) => {
      let next = Math.round((prev.rotation + delta) % 360);
      if (next < 0) next += 360;
      return { ...prev, rotation: next };
    });
  };

  const snapToVertex = () => {
    if (!targetVertex || isLocked) return;
    playSound.pop();
    onChange((prev) => ({
      ...prev,
      x: targetVertex.x,
      y: targetVertex.y,
    }));
  };

  if (!state.visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${state.x}px`,
        top: `${state.y}px`,
        transform: `translate(-50%, -100%) rotate(${state.rotation}deg) scale(${scale})`,
        transformOrigin: '50% 100%', // Base center (Tâm O) is origin!
        touchAction: 'none',
        zIndex: 35,
        opacity: state.opacity,
        pointerEvents: isLocked ? 'none' : 'auto',
      }}
      className="select-none transition-opacity duration-150"
    >
      {/* Visual Magnetic Snap Ring when near target vertex */}
      {isNearVertex && targetVertex && (
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full border-4 border-emerald-400 bg-emerald-400/30 animate-ping pointer-events-none" />
      )}

      {/* SVG REALISTIC PROTRACTOR */}
      <svg
        width={R * 2 + 60}
        height={R + 70}
        viewBox={`${-R - 30} ${-R - 40} ${R * 2 + 60} ${R + 70}`}
        className="overflow-visible filter drop-shadow-xl cursor-grab active:cursor-grabbing"
        onPointerDown={handleBodyPointerDown}
        onPointerMove={handleBodyPointerMove}
        onPointerUp={handleBodyPointerUp}
      >
        <defs>
          {/* Glass / Acrylic plastic realistic gradient */}
          <linearGradient id="acrylicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ecfeff" stopOpacity="0.88" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.75" />
            <stop offset="95%" stopColor="#e0f2fe" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>

          {/* Border bevel filter */}
          <filter id="protractorShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer acrylic semi-circle body */}
        <path
          d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0 Z`}
          fill="url(#acrylicGrad)"
          stroke="#0284c7"
          strokeWidth="3.5"
          filter="url(#protractorShadow)"
        />

        {/* Inner semi-circular cutout border (student grip area) */}
        <path
          d={`M ${-innerR} 0 A ${innerR} ${innerR} 0 0 1 ${innerR} 0 Z`}
          fill="#f8fafc"
          fillOpacity="0.35"
          stroke="#0284c7"
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* BASELINE (Đường chuẩn 0° - 180°) */}
        <line x1={-R + 8} y1="0" x2={R - 8} y2="0" stroke="#0f172a" strokeWidth="2.5" />

        {/* Degree Markings: 0° to 180° */}
        {Array.from({ length: 181 }).map((_, deg) => {
          const rad = (deg * Math.PI) / 180;
          const isTen = deg % 10 === 0;
          const isFive = deg % 5 === 0 && !isTen;

          // Tick lengths
          let tickLen = 6;
          let strokeW = 1;
          let strokeColor = '#334155';

          if (isTen) {
            tickLen = 22;
            strokeW = 2.2;
            strokeColor = '#0f172a';
          } else if (isFive) {
            tickLen = 14;
            strokeW = 1.6;
            strokeColor = '#1e293b';
          }

          const cos = Math.cos(Math.PI - rad);
          const sin = Math.sin(Math.PI - rad);

          const x1 = R * cos;
          const y1 = -R * sin;
          const x2 = (R - tickLen) * cos;
          const y2 = -(R - tickLen) * sin;

          // Numbers at every 10 degrees:
          // Outer scale: 0° (right) to 180° (left)
          // Inner scale: 180° (right) to 0° (left)
          let outerNum = null;
          let innerNum = null;

          if (isTen) {
            const numRadiusOuter = R - 32;
            const nxOut = numRadiusOuter * cos;
            const nyOut = -numRadiusOuter * sin;

            const numRadiusInner = R - 52;
            const nxIn = numRadiusInner * cos;
            const nyIn = -numRadiusInner * sin;

            outerNum = (
              <text
                key={`outer-${deg}`}
                x={nxOut}
                y={nyOut}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0f172a"
                fontSize="12.5"
                fontWeight="900"
                fontFamily="Baloo 2, Nunito, sans-serif"
                transform={`rotate(${90 - deg}, ${nxOut}, ${nyOut})`}
              >
                {deg}
              </text>
            );

            innerNum = (
              <text
                key={`inner-${deg}`}
                x={nxIn}
                y={nyIn}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#0369a1"
                fontSize="10"
                fontWeight="800"
                fontFamily="Baloo 2, Nunito, sans-serif"
                transform={`rotate(${90 - deg}, ${nxIn}, ${nyIn})`}
              >
                {180 - deg}
              </text>
            );
          }

          return (
            <g key={deg}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={strokeW}
              />
              {outerNum}
              {innerNum}
            </g>
          );
        })}

        {/* 90 DEGREE CENTRAL RAY LINE */}
        <line
          x1="0"
          y1={-innerR}
          x2="0"
          y2={-R + 24}
          stroke="#e11d48"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
        <text
          x="0"
          y={-innerR - 12}
          textAnchor="middle"
          fill="#e11d48"
          fontSize="11"
          fontWeight="900"
        >
          90°
        </text>

        {/* Outer Scale Labels (0° & 180°) */}
        <text x={R - 15} y="15" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
          0°
        </text>
        <text x={-R + 15} y="15" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">
          180°
        </text>

        {/* PROTRACTOR CENTER (TÂM THƯỚC O) - VERY CLEAR CROSSHAIR & APERTURE HOLE */}
        <g id="protractor-center">
          {/* Target circle */}
          <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="5" fill="#e11d48" />
          {/* Crosshair lines */}
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#0f172a" strokeWidth="2" />
          <line x1="0" y1="-16" x2="0" y2="4" stroke="#0f172a" strokeWidth="2" />

          {/* Label "TÂM THƯỚC" */}
          <rect x="-35" y="-32" width="70" height="15" rx="4" fill="#0f172a" fillOpacity="0.85" />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            TÂM THƯỚC
          </text>
        </g>

        {/* Brand label */}
        <text
          x="0"
          y={-R * 0.42}
          textAnchor="middle"
          fill="#0284c7"
          fontSize="10"
          fontWeight="900"
          fontFamily="Baloo 2, sans-serif"
          letterSpacing="1"
        >
          MATH 4 AI • THƯỚC ĐO GÓC
        </text>
      </svg>

      {/* ROTATION HANDLE / DIAL (Large Knob for Easy Classroom Touch on TV) */}
      <div
        onPointerDown={handleRotatePointerDown}
        onPointerMove={handleRotatePointerMove}
        onPointerUp={handleRotatePointerUp}
        style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          touchAction: 'none',
        }}
        className="cursor-ew-resize group flex flex-col items-center"
        title="Chạm và kéo để xoay thước đo góc"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 shadow-xl border-3 border-white flex items-center justify-center font-black text-xs ring-4 ring-amber-400/50 group-hover:scale-110 active:scale-95 transition-transform">
          <RotateCw className="w-6 h-6 animate-spin-slow" />
        </div>
        <div className="bg-slate-900/90 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black mt-1 shadow-md border border-amber-300/40">
          {Math.round(state.rotation)}°
        </div>
      </div>

      {/* QUICK FLOATING TOUCH CONTROLS ON TV */}
      <div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-slate-700 pointer-events-auto"
        style={{ transform: `rotate(${-state.rotation}deg)` }} // keep controls right-side up!
      >
        <button
          onClick={() => stepRotation(-5)}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-cartoon font-bold text-xs flex items-center gap-0.5 active:scale-90"
          title="Xoay ngược chiều kim đồng hồ 5°"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>-5°</span>
        </button>

        <button
          onClick={() => stepRotation(-1)}
          className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-90"
          title="Xoay tinh chỉnh -1°"
        >
          -1°
        </button>

        <button
          onClick={() => {
            playSound.click();
            onChange((p) => ({ ...p, rotation: 0 }));
          }}
          className="px-2 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-cartoon font-bold text-xs active:scale-90"
          title="Đặt thước nằm ngang 0°"
        >
          0° Ngang
        </button>

        <button
          onClick={() => stepRotation(1)}
          className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-90"
          title="Xoay tinh chỉnh +1°"
        >
          +1°
        </button>

        <button
          onClick={() => stepRotation(5)}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-cartoon font-bold text-xs flex items-center gap-0.5 active:scale-90"
          title="Xoay theo chiều kim đồng hồ 5°"
        >
          <span>+5°</span>
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {targetVertex && (
          <button
            onClick={snapToVertex}
            className={`ml-1 px-2.5 py-1 rounded-xl font-cartoon font-bold text-xs flex items-center gap-1 shadow-sm active:scale-90 ${
              isNearVertex
                ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100'
            }`}
            title="Tự động đặt tâm thước đúng vào đỉnh góc"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Vào đỉnh {targetVertex.label}</span>
          </button>
        )}
      </div>
    </div>
  );
};
