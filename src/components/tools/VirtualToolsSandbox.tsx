import React, { useState, useRef, useEffect } from 'react';
import { ManipulativeItem, ToolType } from '../../types';
import { ToolItemRenderer } from './ToolItemRenderer';
import { 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Grid, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Tv,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface VirtualToolsSandboxProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

const TOOL_DEFINITIONS: { type: ToolType; name: string; icon: string; defaultData: any }[] = [
  { type: 'sticks', name: 'Que tính', icon: '🥖', defaultData: { count: 3, bundle: 10, color: '#eab308' } },
  { type: 'number_cards', name: 'Thẻ số', icon: '🃏', defaultData: { value: 1000 } },
  { type: 'number_board', name: 'Bảng số 100', icon: '🔢', defaultData: { highlighted: [2, 4, 6, 8, 10], filter: 'even' } },
  { type: 'clock', name: 'Đồng hồ', icon: '⏰', defaultData: { hours: 8, minutes: 35 } },
  { type: 'ruler', name: 'Thước đo', icon: '📏', defaultData: { lengthCm: 15 } },
  { type: 'vietnam_money', name: 'Tiền Việt Nam', icon: '💵', defaultData: { denomination: 50000, count: 2 } },
  { type: 'square', name: 'Hình vuông', icon: '🟦', defaultData: { side: 4 } },
  { type: 'rectangle', name: 'Hình chữ nhật', icon: '🟩', defaultData: { length: 6, width: 3 } },
  { type: 'circle', name: 'Hình tròn', icon: '🟣', defaultData: { radius: 4 } },
  { type: 'fraction', name: 'Phân số', icon: '🥧', defaultData: { numerator: 3, denominator: 4 } },
  { type: 'angles', name: 'Góc (Thước đo)', icon: '📐', defaultData: { degrees: 90 } },
  { type: 'cube_3d', name: 'Hình hộp chữ nhật', icon: '📦', defaultData: { isNet: false } },
  { type: 'bar_chart', name: 'Biểu đồ cột', icon: '📊', defaultData: { columns: [{ label: 'Tổ 1', val: 15, color: '#3b82f6' }, { label: 'Tổ 2', val: 20, color: '#10b981' }, { label: 'Tổ 3', val: 18, color: '#f59e0b' }, { label: 'Tổ 4', val: 25, color: '#8b5cf6' }] } },
];

export const VirtualToolsSandbox: React.FC<VirtualToolsSandboxProps> = ({ tvMode, onBackToHome }) => {
  // Canvas items
  const [items, setItems] = useState<ManipulativeItem[]>([
    {
      id: 'init-fraction',
      type: 'fraction',
      x: 60,
      y: 80,
      scale: 1,
      rotation: 0,
      data: { numerator: 3, denominator: 4 },
    },
    {
      id: 'init-sticks',
      type: 'sticks',
      x: 360,
      y: 80,
      scale: 1,
      rotation: 0,
      data: { count: 3, bundle: 10, color: '#eab308' },
    },
    {
      id: 'init-clock',
      type: 'clock',
      x: 640,
      y: 60,
      scale: 1,
      rotation: 0,
      data: { hours: 8, minutes: 35 },
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [checkFeedback, setCheckFeedback] = useState<{ type: 'success' | 'hint'; message: string } | null>(null);

  // Drag tracking
  const draggingRef = useRef<{ id: string; startX: number; startY: number; itemX: number; itemY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Mouse & Touch move / up listeners on window for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const { id, startX, startY, itemX, itemY } = draggingRef.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, x: Math.max(10, Math.min(1600, itemX + dx)), y: Math.max(10, Math.min(1200, itemY + dy)) }
            : item
        )
      );
    };

    const handleMouseUp = () => {
      draggingRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current || !e.touches[0]) return;
      const t = e.touches[0];
      const { id, startX, startY, itemX, itemY } = draggingRef.current;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, x: Math.max(10, Math.min(1600, itemX + dx)), y: Math.max(10, Math.min(1200, itemY + dy)) }
            : item
        )
      );
    };

    const handleTouchEnd = () => {
      draggingRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Add new tool to canvas
  const handleAddTool = (toolType: ToolType) => {
    playSound.pop();
    const def = TOOL_DEFINITIONS.find((t) => t.type === toolType);
    if (!def) return;

    // Place near center with slight offset
    const offset = (items.length % 5) * 35;
    const newItem: ManipulativeItem = {
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: toolType,
      x: 100 + offset,
      y: 80 + offset,
      scale: 1,
      rotation: 0,
      data: JSON.parse(JSON.stringify(def.defaultData)),
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  // Start dragging (Mouse)
  const handleItemMouseDown = (item: ManipulativeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(item.id);
    draggingRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      itemX: item.x,
      itemY: item.y,
    };
  };

  // Start dragging (Touch)
  const handleItemTouchStart = (item: ManipulativeItem, e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    const t = e.touches[0];
    setSelectedId(item.id);
    draggingRef.current = {
      id: item.id,
      startX: t.clientX,
      startY: t.clientY,
      itemX: item.x,
      itemY: item.y,
    };
  };

  // Update item
  const handleUpdateItem = (id: string, updater: (prev: ManipulativeItem) => ManipulativeItem) => {
    setItems((prev) => prev.map((it) => (it.id === id ? updater(it) : it)));
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    playSound.pop();
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Clone item
  const handleCloneItem = (source: ManipulativeItem) => {
    const newItem: ManipulativeItem = {
      ...source,
      id: `tool-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: source.x + 30,
      y: source.y + 30,
      data: JSON.parse(JSON.stringify(source.data)),
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  // Reset all
  const handleResetCanvas = () => {
    playSound.pop();
    setItems([]);
    setSelectedId(null);
    setCheckFeedback(null);
  };

  // Check / Evaluate button
  const handleCheck = () => {
    if (items.length === 0) {
      playSound.tryAgain();
      setCheckFeedback({
        type: 'hint',
        message: 'Bảng đang trống! Thầy cô hoặc học sinh hãy chọn đồ dùng ở thanh công cụ bên dưới để bắt đầu nhé!',
      });
      return;
    }

    // Interactive celebration
    playSound.success();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setCheckFeedback({
      type: 'success',
      message: `Chính xác! Thầy cô và học sinh đã bố trí ${items.length} đồ dùng học tập rất khoa học và trực quan trên màn hình! 🎉`,
    });

    setTimeout(() => {
      setCheckFeedback(null);
    }, 6000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[640px] relative bg-slate-100 overflow-hidden select-none">
      {/* Top Action Bar */}
      <div className="bg-white px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm z-20">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={() => {
                playSound.pop();
                onBackToHome();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Quay lại Trang chủ"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          )}

          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            🧮
          </div>
          <div>
            <h2 className="font-cartoon font-black text-slate-800 text-base sm:text-lg flex items-center gap-2">
              BẢNG ĐỒ DÙNG DẠY HỌC TƯƠNG TÁC
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                13 Đồ dùng chuẩn SGK
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold hidden md:block">
              Kéo thả bằng chuột • Xoay • Phóng to / Thu nhỏ • Thay đổi số lượng • Trình chiếu trên TV
            </p>
          </div>
        </div>

        {/* Global Toolbar controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              showGrid ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
            } ${tvMode ? 'px-3 py-2 text-sm' : ''}`}
            title="Bật/Tắt lưới kẻ ô vuông"
          >
            <Grid className={tvMode ? 'w-5 h-5' : 'w-4 h-4'} />
            <span className="hidden sm:inline">Lưới ô</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleResetCanvas}
            className={`p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors ${
              tvMode ? 'px-3.5 py-2 text-sm font-cartoon' : ''
            }`}
            title="Làm lại bảng từ đầu"
          >
            <RotateCcw className={tvMode ? 'w-5 h-5' : 'w-4 h-4'} />
            <span className="hidden sm:inline">Làm lại</span>
          </button>

          {/* Big Check Button */}
          <button
            onClick={handleCheck}
            className={`btn-3d btn-3d-green rounded-2xl flex items-center gap-2 font-cartoon font-black shadow-md ${
              tvMode ? 'py-3 px-8 text-base ring-2 ring-emerald-300' : 'py-2 px-5 text-sm'
            }`}
          >
            <CheckCircle2 className={tvMode ? 'w-6 h-6' : 'w-5 h-5'} />
            <span>KIỂM TRA BẢNG</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={canvasRef}
        onClick={() => setSelectedId(null)}
        className={`flex-1 relative overflow-auto cursor-default ${
          showGrid
            ? 'bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] bg-slate-50'
            : 'bg-slate-100'
        }`}
        style={{ minHeight: '500px' }}
      >
        {/* Render items on canvas */}
        {items.map((item) => (
          <ToolItemRenderer
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            onUpdate={(updater) => handleUpdateItem(item.id, updater)}
            onDelete={() => handleDeleteItem(item.id)}
            onClone={() => handleCloneItem(item)}
            onMouseDownDrag={(e) => handleItemMouseDown(item, e)}
            onTouchStartDrag={(e) => handleItemTouchStart(item, e)}
          />
        ))}

        {/* Empty State Helper */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
              🧮
            </div>
            <h3 className="font-cartoon font-black text-xl text-slate-700 mb-1">
              Bảng đồ dùng đang sẵn sàng!
            </h3>
            <p className="text-sm text-slate-500 max-w-md font-semibold">
              Bấm vào các đồ dùng ở thanh dưới để đưa que tính, thước đo, đồng hồ, phân số lên bảng dạy học.
            </p>
          </div>
        )}

        {/* Check Feedback Popover Banner */}
        {checkFeedback && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
            <div
              className={`p-4 rounded-2xl shadow-2xl border-2 flex items-center gap-3 text-sm font-bold font-cartoon ${
                checkFeedback.type === 'success'
                  ? 'bg-emerald-500 border-emerald-300 text-white'
                  : 'bg-amber-400 border-amber-200 text-amber-950'
              }`}
            >
              {checkFeedback.type === 'success' ? (
                <Check className="w-6 h-6 shrink-0" />
              ) : (
                <HelpCircle className="w-6 h-6 shrink-0" />
              )}
              <span>{checkFeedback.message}</span>
              <button
                onClick={() => setCheckFeedback(null)}
                className="p-1 hover:bg-black/10 rounded-lg ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tool Palette (13 Tools - chunky & easy to click with mouse on TV) */}
      <div className="bg-white/95 backdrop-blur border-t-2 border-slate-200 p-2.5 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-200">
            <span className="font-cartoon font-bold text-xs uppercase tracking-wider text-slate-500">
              Chọn đồ dùng:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {TOOL_DEFINITIONS.map((tool) => (
              <button
                key={tool.type}
                onClick={() => handleAddTool(tool.type)}
                className={`group relative flex flex-col items-center justify-center rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border-2 border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 ${
                  tvMode ? 'p-3 min-w-[92px]' : 'p-2 min-w-[76px]'
                }`}
                title={`Thêm ${tool.name} vào bảng`}
              >
                <span className={`mb-0.5 group-hover:scale-110 transition-transform ${tvMode ? 'text-3xl' : 'text-2xl'}`}>
                  {tool.icon}
                </span>
                <span className={`font-cartoon font-bold text-slate-700 group-hover:text-amber-900 whitespace-nowrap ${
                  tvMode ? 'text-xs' : 'text-[11px]'
                }`}>
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
