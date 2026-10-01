import React from 'react';
import { 
  Tv, 
  RotateCcw, 
  CheckCircle, 
  ZoomIn, 
  ZoomOut, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Maximize2,
  Minimize2,
  Keyboard
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { AppTab } from '../types';

interface TeacherTVBannerProps {
  tvMode: boolean;
  setTvMode: (val: boolean) => void;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  activeTab?: AppTab;
  setActiveTab?: (tab: AppTab) => void;
  onCheck?: () => void;
  onReset?: () => void;
}

const TAB_ORDER: { id: AppTab; label: string }[] = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'lessons', label: '1. Bài học' },
  { id: 'tools', label: '2. Đồ dùng ảo' },
  { id: 'activities', label: '3. Hoạt động mẫu' },
  { id: 'games', label: '4. Trò chơi' },
  { id: 'ai-assistant', label: '5. Trợ lý AI' },
  { id: 'exercises', label: '6. Bài tập' },
  { id: 'results', label: '7. Kết quả' },
];

export const TeacherTVBanner: React.FC<TeacherTVBannerProps> = ({
  tvMode,
  setTvMode,
  scale,
  setScale,
  activeTab = 'home',
  setActiveTab,
  onCheck,
  onReset,
}) => {
  if (!tvMode) return null;

  const currentIdx = TAB_ORDER.findIndex(t => t.id === activeTab);

  const handlePrevTab = () => {
    if (!setActiveTab) return;
    playSound.click();
    const prevIdx = currentIdx <= 0 ? TAB_ORDER.length - 1 : currentIdx - 1;
    setActiveTab(TAB_ORDER[prevIdx].id);
  };

  const handleNextTab = () => {
    if (!setActiveTab) return;
    playSound.click();
    const nextIdx = currentIdx >= TAB_ORDER.length - 1 ? 0 : currentIdx + 1;
    setActiveTab(TAB_ORDER[nextIdx].id);
  };

  const handleToggleFullscreen = () => {
    playSound.pop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleExitTV = () => {
    playSound.pop();
    setTvMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-lg text-white px-5 py-3 rounded-3xl shadow-2xl border-2 border-amber-400/80 flex items-center gap-3 sm:gap-4 transition-all animate-fade-in max-w-[95vw] overflow-x-auto select-none">
      {/* 16:9 TV Presentation Badge */}
      <div className="flex items-center gap-2 pr-3 border-r border-slate-700 shrink-0">
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        <Tv className="w-5 h-5 text-amber-400" />
        <div className="hidden sm:block">
          <div className="font-cartoon font-black text-xs text-amber-300 leading-tight">
            TRÌNH CHIẾU TV 16:9
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            HDMI • Máy tính ➔ TV
          </div>
        </div>
      </div>

      {/* Stepper for switching sections using wireless mouse */}
      {setActiveTab && (
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={handlePrevTab}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-200 hover:text-white transition-all flex items-center gap-1 text-xs font-cartoon font-bold active:scale-95"
            title="Mục trước đó (Phím Mũi tên trái)"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Mục trước</span>
          </button>

          <span className="px-2.5 py-1 text-xs font-cartoon font-bold text-amber-200 bg-slate-900/80 rounded-xl whitespace-nowrap border border-slate-700">
            {TAB_ORDER[currentIdx]?.label}
          </span>

          <button
            onClick={handleNextTab}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-200 hover:text-white transition-all flex items-center gap-1 text-xs font-cartoon font-bold active:scale-95"
            title="Mục tiếp theo (Phím Mũi tên phải)"
          >
            <span className="hidden md:inline">Mục sau</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}

      {/* Font & Zoom controls for TV screen distance */}
      <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-2xl border border-slate-700 shrink-0">
        <button
          onClick={() => {
            playSound.click();
            setScale(s => Math.max(0.9, Number((s - 0.1).toFixed(1))));
          }}
          className="p-2 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
          title="Thu nhỏ chữ (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-bold px-1 text-amber-300 min-w-[42px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => {
            playSound.click();
            setScale(s => Math.min(1.5, Number((s + 0.1).toFixed(1))));
          }}
          className="p-2 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
          title="Phóng to chữ cho học sinh ngồi xa (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={handleToggleFullscreen}
        className="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-2xl text-slate-200 hover:text-white transition-colors border border-slate-700 shrink-0"
        title="Bật/Tắt toàn màn hình TV (Phím F)"
      >
        <Maximize2 className="w-4 h-4 text-blue-400" />
      </button>

      {/* Big prominent Exit TV Mode Button as requested */}
      <button
        onClick={handleExitTV}
        className="btn-3d btn-3d-rose px-4 py-2 rounded-2xl font-cartoon font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xl ring-2 ring-rose-400 shrink-0"
        title="Thoát chế độ Trình chiếu TV (Phím Esc)"
      >
        <X className="w-4 h-4" />
        <span>THOÁT TV (ESC)</span>
      </button>
    </div>
  );
};

