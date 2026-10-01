import React, { useState } from 'react';
import { ManipulativeItem, ToolType } from '../../types';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Copy, 
  Trash2, 
  Move, 
  Plus, 
  Minus, 
  CheckCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface ToolItemRendererProps {
  item: ManipulativeItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updater: (prev: ManipulativeItem) => ManipulativeItem) => void;
  onDelete: () => void;
  onClone: () => void;
  onMouseDownDrag: (e: React.MouseEvent) => void;
  onTouchStartDrag?: (e: React.TouchEvent) => void;
}

export const ToolItemRenderer: React.FC<ToolItemRendererProps> = ({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onClone,
  onMouseDownDrag,
  onTouchStartDrag,
}) => {
  // Handlers for item modifications
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound.pop();
    onUpdate(prev => ({
      ...prev,
      rotation: (prev.rotation + 15) % 360,
    }));
  };

  const handleScale = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound.click();
    onUpdate(prev => ({
      ...prev,
      scale: Math.max(0.6, Math.min(2.2, Number((prev.scale + delta).toFixed(1)))),
    }));
  };

  // Render tool specific visuals
  const renderToolBody = () => {
    switch (item.type) {
      // 1. QUE TÍNH (STICKS)
      case 'sticks': {
        const count = item.data.count || 1;
        const bundle = item.data.bundle || 1; // 1 = que lẻ, 10 = bó 10, 100 = bó 100
        const color = item.data.color || '#eab308'; // amber

        return (
          <div className="p-3 bg-amber-50/90 rounded-2xl border-2 border-amber-300 shadow-lg min-w-[180px]">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <span className="font-cartoon font-bold text-xs text-amber-900">
                🥖 QUE TÍNH ({bundle === 10 ? 'Bó 10 que' : bundle === 100 ? 'Bó 100 que' : 'Que lẻ'})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-xs font-mono">
                Tổng: {count * bundle} que
              </span>
            </div>

            {/* Visual Sticks Display */}
            <div className="py-3 flex items-center justify-center gap-1.5 flex-wrap min-h-[90px]">
              {bundle === 10 ? (
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, count) }).map((_, bIdx) => (
                    <div key={bIdx} className="relative flex items-center p-1 bg-amber-200 rounded-lg border border-amber-400">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 10 }).map((_, sIdx) => (
                          <div 
                            key={sIdx} 
                            className="w-1.5 h-16 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-red-500/80 rounded border border-red-600 text-[8px] text-white font-bold flex items-center justify-center">
                        Bó 10
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {Array.from({ length: Math.min(20, count) }).map((_, sIdx) => (
                    <div
                      key={sIdx}
                      className="w-2.5 h-16 rounded-full border border-amber-600/30 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {count > 20 && (
                    <span className="text-xs font-bold text-amber-800 self-center">
                      +{count - 20} que
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stick Controls */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-amber-200">
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onUpdate(prev => ({
                      ...prev,
                      data: { ...prev.data, count: Math.max(1, (prev.data.count || 1) - 1) },
                    }));
                  }}
                  className="w-6 h-6 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold flex items-center justify-center text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-xs px-1 text-amber-950">
                  {count}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onUpdate(prev => ({
                      ...prev,
                      data: { ...prev.data, count: (prev.data.count || 1) + 1 },
                    }));
                  }}
                  className="w-6 h-6 rounded bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold flex items-center justify-center text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Toggle Bundle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound.pop();
                  onUpdate(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      bundle: prev.data.bundle === 10 ? 1 : 10,
                    },
                  }));
                }}
                className="text-[10px] px-2 py-1 rounded bg-amber-600 text-white font-bold"
              >
                {bundle === 10 ? 'Tách que lẻ' : 'Bó thành 10'}
              </button>
            </div>
          </div>
        );
      }

      // 2. THẺ SỐ (NUMBER CARDS)
      case 'number_cards': {
        const value = item.data.value || 1000;
        const colorMap: Record<number, string> = {
          1: 'from-green-500 to-emerald-600',
          10: 'from-blue-500 to-blue-700',
          100: 'from-amber-500 to-orange-600',
          1000: 'from-purple-500 to-indigo-600',
          10000: 'from-rose-500 to-pink-600',
          100000: 'from-teal-500 to-cyan-700',
          1000000: 'from-yellow-400 to-amber-600',
        };
        const labelMap: Record<number, string> = {
          1: 'Đơn vị',
          10: 'Chục',
          100: 'Trăm',
          1000: 'Nghìn',
          10000: 'Chục nghìn',
          100000: 'Trăm nghìn',
          1000000: 'Triệu',
        };

        const availableVals = [1, 10, 100, 1000, 10000, 100000, 1000000];

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-xl min-w-[200px]">
            <div className="text-center font-cartoon font-bold text-xs text-slate-500 mb-1">
              THẺ SỐ LỚP 4: {labelMap[value] || 'Thẻ số'}
            </div>
            <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[value] || 'from-indigo-500 to-purple-600'} text-white text-center shadow-md`}>
              <div className="text-3xl font-black font-mono tracking-wider">
                {value.toLocaleString('vi-VN')}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest mt-1 opacity-90">
                Hàng: {labelMap[value]}
              </div>
            </div>

            {/* Quick value switcher */}
            <div className="grid grid-cols-4 gap-1 mt-2">
              {availableVals.map((v) => (
                <button
                  key={v}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onUpdate(prev => ({
                      ...prev,
                      data: { ...prev.data, value: v },
                    }));
                  }}
                  className={`text-[9px] font-bold font-mono py-1 rounded border ${
                    value === v
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 3. BẢNG SỐ (NUMBER BOARD 1-100)
      case 'number_board': {
        const highlighted = (item.data.highlighted || []) as number[];
        const filter = item.data.filter || 'all';

        const toggleCell = (num: number) => {
          playSound.click();
          onUpdate(prev => {
            const list = (prev.data.highlighted || []) as number[];
            const nextList = list.includes(num) ? list.filter(n => n !== num) : [...list, num];
            return {
              ...prev,
              data: { ...prev.data, highlighted: nextList },
            };
          });
        };

        const applyFilter = (f: string) => {
          playSound.pop();
          let nums: number[] = [];
          if (f === 'even') nums = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => n % 2 === 0);
          else if (f === 'odd') nums = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => n % 2 !== 0);
          else if (f === 'mul3') nums = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => n % 3 === 0);
          else if (f === 'mul5') nums = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => n % 5 === 0);
          else if (f === 'mul9') nums = Array.from({ length: 100 }, (_, i) => i + 1).filter(n => n % 9 === 0);
          else if (f === 'clear') nums = [];

          onUpdate(prev => ({
            ...prev,
            data: { ...prev.data, filter: f, highlighted: nums },
          }));
        };

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-indigo-200 shadow-xl max-w-[340px]">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <span className="font-cartoon font-bold text-xs text-indigo-900">
                🔢 BẢNG 100 SỐ TỰ NHIÊN
              </span>
              <span className="text-[10px] font-bold text-indigo-600">
                Đã chọn: {highlighted.length} số
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1 py-1.5 flex-wrap">
              <button
                onClick={(e) => { e.stopPropagation(); applyFilter('even'); }}
                className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold"
              >
                Số chẵn
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); applyFilter('odd'); }}
                className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold"
              >
                Số lẻ
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); applyFilter('mul3'); }}
                className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold"
              >
                Bội của 3
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); applyFilter('mul5'); }}
                className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold"
              >
                Bội của 5
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); applyFilter('clear'); }}
                className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold"
              >
                Xóa chọn
              </button>
            </div>

            {/* 10x10 Grid */}
            <div className="grid grid-cols-10 gap-0.5 bg-slate-100 p-1 rounded-xl">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
                const isSelected = highlighted.includes(n);
                return (
                  <button
                    key={n}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCell(n);
                    }}
                    className={`aspect-square text-[9px] font-bold font-mono rounded flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-black shadow scale-105'
                        : 'bg-white hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      // 4. ĐỒNG HỒ (CLOCK)
      case 'clock': {
        const hours = item.data.hours ?? 8;
        const minutes = item.data.minutes ?? 35;

        // Angles
        const minuteAngle = minutes * 6; // 360 / 60
        const hourAngle = (hours % 12) * 30 + minutes * 0.5;

        const setTime = (h: number, m: number) => {
          playSound.click();
          onUpdate(prev => ({
            ...prev,
            data: { ...prev.data, hours: h, minutes: m },
          }));
        };

        return (
          <div className="p-3 bg-white rounded-3xl border-4 border-amber-400 shadow-xl min-w-[220px] flex flex-col items-center">
            <span className="font-cartoon font-bold text-xs text-amber-900 mb-1">
              ⏰ ĐỒNG HỒ KIM TƯƠNG TÁC
            </span>

            {/* Analog Clock Face */}
            <div className="relative w-40 h-40 rounded-full border-4 border-slate-800 bg-amber-50 shadow-inner flex items-center justify-center">
              {/* Hour numbers 1-12 */}
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                const angle = (num * 30 - 90) * (Math.PI / 180);
                const r = 58;
                const x = Math.round(80 + r * Math.cos(angle));
                const y = Math.round(80 + r * Math.sin(angle));
                return (
                  <span
                    key={num}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-black font-mono text-slate-800"
                  >
                    {num}
                  </span>
                );
              })}

              {/* Hour Hand */}
              <div
                style={{ transform: `rotate(${hourAngle}deg)` }}
                className="absolute w-2 h-12 bg-slate-900 rounded-full origin-bottom bottom-1/2 shadow-sm transition-transform duration-200"
              />

              {/* Minute Hand */}
              <div
                style={{ transform: `rotate(${minuteAngle}deg)` }}
                className="absolute w-1.5 h-16 bg-blue-600 rounded-full origin-bottom bottom-1/2 shadow-sm transition-transform duration-200"
              />

              {/* Center Pivot */}
              <div className="w-3.5 h-3.5 bg-red-600 rounded-full z-10 shadow" />
            </div>

            {/* Digital Readout */}
            <div className="mt-2 px-3 py-1 bg-slate-900 text-white rounded-xl font-mono font-bold text-base shadow flex items-center gap-1.5">
              <span>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-amber-300 uppercase font-sans">
                {hours >= 12 ? 'Chiều / Tối' : 'Sáng'}
              </span>
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTime((hours + 1) % 24, minutes);
                }}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                +1 Giờ
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTime(hours, (minutes + 5) % 60);
                }}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                +5 Phút
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTime(hours, (minutes + 15) % 60);
                }}
                className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold"
              >
                +15 Phút
              </button>
            </div>
          </div>
        );
      }

      // 5. THƯỚC ĐO (RULER)
      case 'ruler': {
        const lengthCm = item.data.lengthCm || 15;

        return (
          <div className="p-2 bg-amber-100/90 rounded-xl border-2 border-amber-400 shadow-2xl backdrop-blur-sm min-w-[280px]">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="font-cartoon font-bold text-[10px] text-amber-900">
                📏 THƯỚC ĐO CENTIMET & MILIMET
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800">
                {lengthCm} cm
              </span>
            </div>

            {/* Visual Ruler markings */}
            <div className="relative h-14 bg-gradient-to-b from-yellow-200 to-amber-300 rounded border border-amber-500 overflow-hidden flex shadow-inner">
              {Array.from({ length: lengthCm + 1 }).map((_, cm) => (
                <div key={cm} className="flex-1 relative border-r border-amber-900/60 h-full">
                  {/* CM label */}
                  <span className="absolute top-1 left-1 text-[10px] font-bold font-mono text-slate-900 select-none">
                    {cm}
                  </span>
                  {/* Centimeter main tick */}
                  <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-slate-900" />
                  {/* Half-centimeter tick (5mm) */}
                  {cm < lengthCm && (
                    <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-slate-700" />
                  )}
                  {/* Millimeter ticks */}
                  {cm < lengthCm && (
                    <>
                      <div className="absolute bottom-0 left-[20%] w-[1px] h-2 bg-slate-500" />
                      <div className="absolute bottom-0 left-[40%] w-[1px] h-2 bg-slate-500" />
                      <div className="absolute bottom-0 left-[60%] w-[1px] h-2 bg-slate-500" />
                      <div className="absolute bottom-0 left-[80%] w-[1px] h-2 bg-slate-500" />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="text-[10px] text-center text-amber-900 font-semibold pt-1">
              Dùng để đo chiều dài các vật mẫu trên bảng
            </div>
          </div>
        );
      }

      // 6. TIỀN VIỆT NAM (VIETNAM MONEY)
      case 'vietnam_money': {
        const denomination = item.data.denomination || 20000;
        const count = item.data.count || 1;

        const moneyColors: Record<number, { bg: string; text: string; name: string }> = {
          1000: { bg: 'bg-stone-300 border-stone-400', text: 'text-stone-800', name: 'Một nghìn đồng' },
          2000: { bg: 'bg-orange-200 border-orange-400', text: 'text-orange-900', name: 'Hai nghìn đồng' },
          5000: { bg: 'bg-blue-300 border-blue-500', text: 'text-blue-900', name: 'Năm nghìn đồng' },
          10000: { bg: 'bg-amber-200 border-amber-400', text: 'text-amber-900', name: 'Mười nghìn đồng' },
          20000: { bg: 'bg-cyan-200 border-cyan-400', text: 'text-cyan-900', name: 'Hai mươi nghìn đồng' },
          50000: { bg: 'bg-rose-200 border-rose-400', text: 'text-rose-900', name: 'Năm mươi nghìn đồng' },
          100000: { bg: 'bg-emerald-200 border-emerald-400', text: 'text-emerald-900', name: 'Một trăm nghìn đồng' },
          200000: { bg: 'bg-red-200 border-red-400', text: 'text-red-900', name: 'Hai trăm nghìn đồng' },
          500000: { bg: 'bg-sky-200 border-sky-400', text: 'text-sky-900', name: 'Năm trăm nghìn đồng' },
        };

        const currentStyle = moneyColors[denomination] || moneyColors[20000];
        const denomList = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-xl min-w-[210px]">
            <div className="flex items-center justify-between pb-1.5">
              <span className="font-cartoon font-bold text-xs text-emerald-900">
                💵 TIỀN VIỆT NAM (VNĐ)
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700">
                SL: {count} tờ
              </span>
            </div>

            {/* Banknote visual */}
            <div className={`p-3 rounded-xl border-2 shadow-inner ${currentStyle.bg} flex flex-col justify-between h-24 relative overflow-hidden`}>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                <span>⭐</span>
              </div>
              <div className="text-center">
                <span className={`text-2xl font-black font-mono tracking-wider ${currentStyle.text}`}>
                  {denomination.toLocaleString('vi-VN')} đ
                </span>
                <p className="text-[10px] font-semibold text-slate-600">{currentStyle.name}</p>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>VN-{denomination / 1000}K</span>
                <span>NGÂN HÀNG NHÀ NƯỚC</span>
              </div>
            </div>

            {/* Total value */}
            <div className="mt-2 text-center p-1 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900">
                Tổng tiền: <b>{(denomination * count).toLocaleString('vi-VN')} đồng</b>
              </span>
            </div>

            {/* Denomination quick select */}
            <div className="grid grid-cols-3 gap-1 mt-2">
              {denomList.map((d) => (
                <button
                  key={d}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onUpdate(prev => ({
                      ...prev,
                      data: { ...prev.data, denomination: d },
                    }));
                  }}
                  className={`text-[9px] font-bold font-mono py-1 rounded border ${
                    denomination === d
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  {d >= 1000 ? `${d / 1000}k` : d}
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 7. HÌNH VUÔNG (SQUARE)
      case 'square': {
        const side = item.data.side || 4; // 4 cm
        const perimeter = side * 4;
        const area = side * side;

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-blue-300 shadow-xl min-w-[200px]">
            <div className="font-cartoon font-bold text-xs text-blue-900 text-center mb-1">
              🟦 HÌNH VUÔNG (Cạnh a = {side} cm)
            </div>

            <div className="flex justify-center p-3">
              <div
                style={{ width: `${side * 24}px`, height: `${side * 24}px` }}
                className="bg-blue-200/80 border-2 border-blue-600 rounded-lg flex items-center justify-center relative shadow"
              >
                <span className="text-xs font-bold font-mono text-blue-900">
                  {side} cm
                </span>
              </div>
            </div>

            {/* Formulas & Calculations */}
            <div className="bg-blue-50 p-2 rounded-xl border border-blue-200 text-xs space-y-1">
              <div>
                <span className="text-slate-600">Chu vi P = a × 4:</span>{' '}
                <b className="font-mono text-blue-700">{side} × 4 = {perimeter} cm</b>
              </div>
              <div>
                <span className="text-slate-600">Diện tích S = a × a:</span>{' '}
                <b className="font-mono text-blue-700">{side} × {side} = {area} cm²</b>
              </div>
            </div>

            {/* Side adjustments */}
            <div className="flex items-center justify-between gap-1 mt-2">
              <span className="text-[10px] font-bold text-slate-500">Đổi cạnh a:</span>
              <div className="flex gap-1">
                {[2, 4, 6, 8].map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound.click();
                      onUpdate(prev => ({
                        ...prev,
                        data: { ...prev.data, side: s },
                      }));
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      side === s ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {s}cm
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 8. HÌNH CHỮ NHẬT (RECTANGLE)
      case 'rectangle': {
        const length = item.data.length || 6;
        const width = item.data.width || 3;
        const perimeter = (length + width) * 2;
        const area = length * width;

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-xl min-w-[220px]">
            <div className="font-cartoon font-bold text-xs text-emerald-900 text-center mb-1">
              🟩 HÌNH CHỮ NHẬT (dài {length}cm, rộng {width}cm)
            </div>

            <div className="flex justify-center p-3">
              <div
                style={{ width: `${length * 22}px`, height: `${width * 22}px` }}
                className="bg-emerald-200/80 border-2 border-emerald-600 rounded-lg flex items-center justify-center shadow"
              >
                <span className="text-xs font-bold font-mono text-emerald-950">
                  {length} × {width} cm
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div>
                <span className="text-slate-600">Chu vi P = (a + b) × 2:</span>{' '}
                <b className="font-mono text-emerald-700">({length} + {width}) × 2 = {perimeter} cm</b>
              </div>
              <div>
                <span className="text-slate-600">Diện tích S = a × b:</span>{' '}
                <b className="font-mono text-emerald-700">{length} × {width} = {area} cm²</b>
              </div>
            </div>
          </div>
        );
      }

      // 9. HÌNH TRÒN (CIRCLE)
      case 'circle': {
        const radius = item.data.radius || 4;
        const diameter = radius * 2;

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-purple-300 shadow-xl min-w-[200px] flex flex-col items-center">
            <span className="font-cartoon font-bold text-xs text-purple-900 mb-1">
              🟣 HÌNH TRÒN (Tâm O, bán kính r)
            </span>

            <div className="relative w-32 h-32 rounded-full border-2 border-purple-600 bg-purple-100 flex items-center justify-center my-2 shadow">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 z-10" />
              <span className="absolute text-[10px] font-bold text-red-600 -translate-y-3">O</span>
              {/* Radius line */}
              <div className="absolute right-0 top-1/2 w-1/2 h-0.5 bg-purple-700" />
              <span className="absolute right-4 top-1/2 -translate-y-4 text-[10px] font-bold text-purple-900 font-mono">
                r = {radius}cm
              </span>
            </div>

            <div className="bg-purple-50 p-2 rounded-xl border border-purple-200 text-xs w-full text-center space-y-0.5">
              <div>Bán kính <b>r = {radius} cm</b></div>
              <div>Đường kính <b>d = 2 × r = {diameter} cm</b></div>
            </div>
          </div>
        );
      }

      // 10. PHÂN SỐ (FRACTION)
      case 'fraction': {
        const numerator = item.data.numerator || 3;
        const denominator = item.data.denominator || 4;

        const setNumerator = (n: number) => {
          playSound.click();
          onUpdate(prev => ({
            ...prev,
            data: { ...prev.data, numerator: Math.max(1, Math.min(denominator, n)) },
          }));
        };

        const setDenominator = (d: number) => {
          playSound.pop();
          onUpdate(prev => ({
            ...prev,
            data: {
              ...prev.data,
              denominator: d,
              numerator: Math.min(prev.data.numerator || 1, d),
            },
          }));
        };

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-amber-300 shadow-xl min-w-[220px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
              <span className="font-cartoon font-bold text-xs text-amber-900">
                🥧 BĂNG GIẤY PHÂN SỐ
              </span>
              <div className="flex flex-col items-center justify-center font-mono font-black text-amber-800 text-sm leading-none bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span>{numerator}</span>
                <div className="w-4 h-0.5 bg-amber-800 my-0.5" />
                <span>{denominator}</span>
              </div>
            </div>

            {/* Visual strip representation */}
            <div className="my-3">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">
                Bấm vào từng ô để tô màu / chọn phần:
              </p>
              <div className="flex h-12 rounded-xl border-2 border-amber-500 overflow-hidden shadow-sm">
                {Array.from({ length: denominator }).map((_, idx) => {
                  const isColored = idx < numerator;
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNumerator(idx + 1 === numerator ? idx : idx + 1);
                      }}
                      className={`flex-1 flex items-center justify-center text-xs font-bold font-mono transition-colors border-r border-amber-300 last:border-r-0 ${
                        isColored
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : 'bg-white hover:bg-amber-50 text-slate-400'
                      }`}
                    >
                      1/{denominator}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Denominator change buttons */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-amber-100">
              <span className="text-[10px] text-slate-500 font-bold">Chia phần:</span>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6, 8].map((d) => (
                  <button
                    key={d}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDenominator(d);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      denominator === d
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    /{d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // 11. GÓC (ANGLES / PROTRACTOR)
      case 'angles': {
        const degrees = item.data.degrees ?? 90;

        let angleType = 'Góc vuông (90°)';
        let badgeColor = 'bg-blue-500 text-white';
        if (degrees < 90) {
          angleType = 'Góc nhọn (< 90°)';
          badgeColor = 'bg-emerald-500 text-white';
        } else if (degrees > 90 && degrees < 180) {
          angleType = 'Góc tù (> 90° và < 180°)';
          badgeColor = 'bg-amber-500 text-white';
        } else if (degrees === 180) {
          angleType = 'Góc bẹt (180°)';
          badgeColor = 'bg-purple-500 text-white';
        }

        const presets = [45, 60, 90, 120, 150, 180];

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-indigo-300 shadow-xl min-w-[220px] flex flex-col items-center">
            <span className="font-cartoon font-bold text-xs text-indigo-900 mb-1">
              📐 THƯỚC ĐO GÓC & PHÂN LOẠI
            </span>

            {/* Visual Angle Diagram */}
            <div className="relative w-36 h-28 flex items-end justify-center pb-2">
              <svg className="w-36 h-28 overflow-visible" viewBox="0 0 140 100">
                {/* Vertex */}
                <circle cx="70" cy="85" r="4" fill="#ef4444" />
                <text x="65" y="98" fontSize="10" fontWeight="bold" fill="#ef4444">O</text>

                {/* Base Ray (OA) */}
                <line x1="70" y1="85" x2="135" y2="85" stroke="#1e293b" strokeWidth="3" />
                <text x="130" y="98" fontSize="10" fontWeight="bold" fill="#1e293b">A</text>

                {/* Rotating Ray (OB) */}
                {(() => {
                  const rad = (degrees * Math.PI) / 180;
                  const bx = 70 + 65 * Math.cos(rad);
                  const by = 85 - 65 * Math.sin(rad);
                  return (
                    <>
                      <line x1="70" y1="85" x2={bx} y2={by} stroke="#3b82f6" strokeWidth="3" />
                      <text x={bx} y={by - 5} fontSize="10" fontWeight="bold" fill="#3b82f6">B</text>
                    </>
                  );
                })()}

                {/* Arc */}
                <path
                  d={`M 95 85 A 25 25 0 0 0 ${70 + 25 * Math.cos((degrees * Math.PI) / 180)} ${85 - 25 * Math.sin((degrees * Math.PI) / 180)}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Badge */}
            <div className={`px-2.5 py-1 rounded-xl text-xs font-black font-cartoon mb-2 ${badgeColor}`}>
              {angleType} : {degrees}°
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1 w-full">
              {presets.map((deg) => (
                <button
                  key={deg}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound.click();
                    onUpdate(prev => ({
                      ...prev,
                      data: { ...prev.data, degrees: deg },
                    }));
                  }}
                  className={`py-1 rounded text-[10px] font-bold font-mono border ${
                    degrees === deg ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 12. HÌNH HỘP CHỮ NHẬT (CUBE 3D)
      case 'cube_3d': {
        const isNet = item.data.isNet || false; // unfolded net mode

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-cyan-300 shadow-xl min-w-[220px] flex flex-col items-center">
            <span className="font-cartoon font-bold text-xs text-cyan-900 mb-1">
              📦 HÌNH HỘP CHỮ NHẬT (3D)
            </span>

            {/* 3D Wireframe / Isometric Box */}
            {!isNet ? (
              <div className="py-2">
                <svg className="w-36 h-28" viewBox="0 0 140 110">
                  {/* Back edges (dashed) */}
                  <line x1="30" y1="40" x2="30" y2="85" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1.5" />
                  <line x1="30" y1="85" x2="90" y2="85" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1.5" />
                  <line x1="30" y1="85" x2="10" y2="100" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1.5" />

                  {/* Front Face */}
                  <rect x="10" y="55" width="80" height="45" fill="rgba(14, 165, 233, 0.25)" stroke="#0284c7" strokeWidth="2" />
                  {/* Top Face */}
                  <polygon points="10,55 30,40 110,40 90,55" fill="rgba(56, 189, 248, 0.4)" stroke="#0284c7" strokeWidth="2" />
                  {/* Right Face */}
                  <polygon points="90,55 110,40 110,85 90,100" fill="rgba(2, 132, 199, 0.35)" stroke="#0284c7" strokeWidth="2" />
                </svg>
              </div>
            ) : (
              /* Unfolded Net representation */
              <div className="p-2 bg-cyan-50 rounded-xl border border-cyan-200 text-center my-2">
                <div className="text-[10px] font-bold text-cyan-900 mb-1">Trải 6 mặt phẳng:</div>
                <div className="grid grid-cols-4 gap-0.5 max-w-[120px] mx-auto">
                  <div className="col-start-2 bg-cyan-200 border border-cyan-400 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 1</div>
                  <div className="col-span-4 grid grid-cols-4 gap-0.5">
                    <div className="bg-cyan-200 border border-cyan-400 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 2</div>
                    <div className="bg-cyan-300 border border-cyan-500 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 3</div>
                    <div className="bg-cyan-200 border border-cyan-400 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 4</div>
                    <div className="bg-cyan-200 border border-cyan-400 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 5</div>
                  </div>
                  <div className="col-start-2 bg-cyan-200 border border-cyan-400 text-[8px] h-6 flex items-center justify-center font-bold">Mặt 6</div>
                </div>
              </div>
            )}

            {/* Properties */}
            <div className="grid grid-cols-3 gap-1 bg-cyan-50 p-1.5 rounded-xl border border-cyan-200 text-center w-full text-[11px] font-bold text-cyan-950 mb-2">
              <div>6 Mặt</div>
              <div>8 Đỉnh</div>
              <div>12 Cạnh</div>
            </div>

            {/* Toggle Unfold */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound.pop();
                onUpdate(prev => ({
                  ...prev,
                  data: { ...prev.data, isNet: !prev.data.isNet },
                }));
              }}
              className="w-full py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
            >
              {isNet ? 'Xem khối 3D' : 'Trải mặt phẳng (Net)'}
            </button>
          </div>
        );
      }

      // 13. BIỂU ĐỒ CỘT (BAR CHART)
      case 'bar_chart': {
        const columns = item.data.columns || [
          { label: 'Tổ 1', val: 15, color: '#3b82f6' },
          { label: 'Tổ 2', val: 20, color: '#10b981' },
          { label: 'Tổ 3', val: 18, color: '#f59e0b' },
          { label: 'Tổ 4', val: 25, color: '#8b5cf6' },
        ];
        const total = columns.reduce((acc: number, c: any) => acc + c.val, 0);
        const avg = Math.round(total / columns.length);

        return (
          <div className="p-3 bg-white rounded-2xl border-2 border-indigo-300 shadow-xl min-w-[260px]">
            <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
              <span className="font-cartoon font-bold text-xs text-indigo-900">
                📊 BIỂU ĐỒ CỘT (Số bông hoa điểm 10)
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-700">
                TB: {avg} hoa
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-32 flex items-end justify-around gap-2 pt-4 pb-2 border-b border-slate-300 px-2">
              {columns.map((col: any, idx: number) => {
                const heightPct = Math.min(100, (col.val / 30) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold font-mono text-slate-700 mb-0.5">
                      {col.val}
                    </span>
                    <div
                      style={{ height: `${heightPct}%`, backgroundColor: col.color }}
                      className="w-full rounded-t-lg transition-all shadow-sm flex items-start justify-center cursor-pointer hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound.click();
                        const nextVal = (col.val + 5) > 30 ? 5 : col.val + 5;
                        const nextCols = [...columns];
                        nextCols[idx] = { ...col, val: nextVal };
                        onUpdate(prev => ({
                          ...prev,
                          data: { ...prev.data, columns: nextCols },
                        }));
                      }}
                      title="Bấm để tăng số lượng cột"
                    />
                    <span className="text-[10px] font-bold text-slate-600 mt-1">
                      {col.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-center text-slate-500 pt-1.5">
              Bấm vào từng cột để thay đổi số liệu. Tổng cộng: <b>{total} hoa</b>
            </div>
          </div>
        );
      }

      default:
        return <div>Đồ dùng</div>;
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scale(${item.scale})`,
        transformOrigin: 'center center',
      }}
      className={`absolute cursor-move select-none transition-shadow ${
        isSelected ? 'ring-4 ring-blue-500/80 rounded-3xl shadow-2xl z-30' : 'hover:ring-2 hover:ring-slate-400/50 z-10'
      }`}
    >
      {/* Floating Toolbar when selected */}
      {isSelected && (
        <div 
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-xl shadow-xl flex items-center gap-1 z-40 whitespace-nowrap animate-fade-in"
        >
          {/* Rotate */}
          <button
            onClick={handleRotate}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white"
            title="Xoay 15°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Scale Down */}
          <button
            onClick={handleScale(-0.1)}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono font-bold px-1 text-slate-300">
            {Math.round(item.scale * 100)}%
          </span>

          {/* Scale Up */}
          <button
            onClick={handleScale(0.1)}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Clone */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.pop();
              onClone();
            }}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white"
            title="Nhân bản (Tăng số lượng)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound.pop();
              onDelete();
            }}
            className="p-1 hover:bg-rose-500 rounded-lg text-rose-300 hover:text-white"
            title="Xóa đồ dùng"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main item body wrapped in drag handler */}
      <div onMouseDown={onMouseDownDrag} onTouchStart={onTouchStartDrag}>
        {renderToolBody()}
      </div>
    </div>
  );
};
