import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Gamepad2, 
  Bot, 
  ClipboardList, 
  Award, 
  Tv, 
  QrCode, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react';
import { AppTab } from '../types';
import { playSound } from '../utils/audio';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  tvMode: boolean;
  setTvMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  openQrModal: () => void;
  openActivities: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  tvMode,
  setTvMode,
  soundEnabled,
  setSoundEnabled,
  openQrModal,
  openActivities,
}) => {
  const tabs = [
    { id: 'home' as AppTab, label: 'TRANG CHỦ', icon: Tv, color: 'text-slate-600 bg-slate-50 border-slate-200' },
    { id: 'lessons' as AppTab, label: 'BÀI HỌC TOÁN 4', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'tools' as AppTab, label: 'ĐỒ DÙNG DẠY HỌC', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'interactive-practice' as AppTab, label: 'THỰC HÀNH TƯƠNG TÁC', icon: Compass, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'activities' as AppTab, label: '5 HOẠT ĐỘNG MẪU', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'games' as AppTab, label: 'TRÒ CHƠI TOÁN HỌC', icon: Gamepad2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'ai-assistant' as AppTab, label: 'TRỢ LÝ TOÁN AI', icon: Bot, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'exercises' as AppTab, label: 'BÀI TẬP', icon: ClipboardList, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'results' as AppTab, label: 'KẾT QUẢ', icon: Award, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  const handleTabClick = (tabId: AppTab) => {
    if (soundEnabled) playSound.click();
    setActiveTab(tabId);
  };

  const toggleTvMode = () => {
    if (soundEnabled) playSound.pop();
    const nextVal = !tvMode;
    setTvMode(nextVal);
    if (nextVal) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/98 backdrop-blur shadow-md transition-all duration-300 border-b border-slate-200 ${
      tvMode ? 'py-3 px-6 bg-slate-900 text-white border-slate-700' : 'py-3 px-4 sm:px-8'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div 
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200 ${
            tvMode ? 'ring-2 ring-amber-400' : ''
          }`}>
            <span className="text-2xl">📐</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight font-cartoon flex items-center gap-2 ${
                tvMode ? 'text-white' : 'text-slate-900'
              }`}>
                <span className={tvMode ? 'text-amber-300' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'}>
                  MATH 4 AI
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                  Lớp 4
                </span>
                {tvMode && (
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    16:9 HDMI
                  </span>
                )}
              </h1>
            </div>
            {!tvMode && (
              <p className="text-xs text-slate-500 font-semibold hidden sm:block">
                Trợ lý & Đồ dùng dạy học Toán tương tác cho màn hình TV
              </p>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Larger and bolder in TV Mode */}
        <nav className="flex items-center flex-wrap justify-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 rounded-2xl font-black transition-all tracking-wide ${
                  tvMode
                    ? isActive
                      ? 'bg-amber-400 text-slate-950 shadow-lg scale-105 px-4 py-2.5 text-base ring-2 ring-amber-300'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800 px-3.5 py-2 text-sm'
                    : isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-400/50 px-3 py-2 text-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 text-sm'
                }`}
                title={tab.label}
              >
                <Icon className={`${tvMode ? 'w-5 h-5' : 'w-4 h-4'} ${
                  tvMode
                    ? isActive ? 'text-slate-950' : 'text-slate-400'
                    : isActive ? 'text-white' : 'text-slate-500'
                }`} />
                <span className="whitespace-nowrap font-cartoon">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* TV Mode, Sound & QR buttons */}
        <div className="flex items-center gap-2">
          {/* TV Presentation Mode Exit or Toggle Button */}
          {tvMode ? (
            <button
              onClick={toggleTvMode}
              className="btn-3d btn-3d-rose px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl ring-2 ring-rose-300"
              title="Thoát chế độ Trình chiếu TV (Phím Esc)"
            >
              <Minimize2 className="w-5 h-5" />
              <span className="font-cartoon uppercase">THOÁT TV (ESC)</span>
            </button>
          ) : (
            <button
              onClick={toggleTvMode}
              className="btn-3d btn-3d-blue px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md"
              title="Bật chế độ Giáo viên Trình chiếu toàn màn hình TV (Phím F)"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden lg:inline font-cartoon">TRÌNH CHIẾU TV (F)</span>
            </button>
          )}

          {/* QR Remote Connect Modal (Hidden on TV mode to keep screen uncluttered, or shown compact) */}
          {!tvMode && (
            <button
              onClick={openQrModal}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition-colors"
              title="Kết nối điều khiển bằng điện thoại qua mã QR"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden xl:inline">MÃ QR</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound.pop();
            }}
            className={`p-2 rounded-xl transition-colors ${
              tvMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
