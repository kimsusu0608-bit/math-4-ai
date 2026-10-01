import React, { useState } from 'react';
import { 
  Smartphone, 
  QrCode, 
  X, 
  Wifi, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Tv, 
  Volume2,
  Bell,
  Heart,
  Hand,
  Users,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { AppTab } from '../types';

interface QRRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: AppTab) => void;
  setTvMode: React.Dispatch<React.SetStateAction<boolean>>;
  initialMode?: 'student' | 'teacher' | 'info';
}

export const QRRemoteModal: React.FC<QRRemoteModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  setTvMode,
  initialMode = 'student',
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'student' | 'teacher' | 'interactive' | 'info'>(initialMode as any);
  const [lastAction, setLastAction] = useState<string>('Sẵn sàng tương tác');
  const [studentTeam, setStudentTeam] = useState<string>('Tổ 1 - Sóc Nâu');
  const [studentAnswer, setStudentAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerAction = (actionName: string, callback: () => void) => {
    setLastAction(actionName);
    callback();
  };

  const dispatchRemoteAction = (action: string, payload?: any) => {
    window.dispatchEvent(
      new CustomEvent('math4ai_remote_action', {
        detail: { action, payload },
      })
    );
  };

  const handleStudentBuzzer = () => {
    playSound.fanfare();
    confetti({ particleCount: 60, spread: 60 });
    setLastAction(`🔔 ${studentTeam} ĐÃ BẤM CHUÔNG GIÀNH QUYỀN TRẢ LỜI!`);
  };

  const handleStudentPickOption = (opt: string) => {
    playSound.click();
    setStudentAnswer(opt);
    setLastAction(`✅ ${studentTeam} đã chọn đáp án: ${opt}`);
  };

  const handleStudentCheer = () => {
    playSound.success();
    confetti({ particleCount: 80, spread: 70 });
    setLastAction(`❤️ ${studentTeam} gửi tim cổ vũ cả lớp!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm text-2xl">
              📱
            </div>
            <div>
              <h2 className="text-xl font-black font-cartoon flex items-center gap-2">
                <span>KẾT NỐI ĐIỆN THOẠI QUA MÃ QR</span>
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  16:9 TV Sync
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-semibold">
                Dành cho Học sinh bấm chuông trả lời & Giáo viên điều khiển TV từ xa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 4 Tabs Inside Modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTabMode('student')}
            className={`pb-3 font-cartoon font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTabMode === 'student'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>📱 Học sinh</span>
          </button>

          <button
            onClick={() => setActiveTabMode('interactive')}
            className={`pb-3 font-cartoon font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTabMode === 'interactive'
                ? 'border-amber-500 text-amber-800 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📐 Remote Đo góc TV</span>
          </button>

          <button
            onClick={() => setActiveTabMode('teacher')}
            className={`pb-3 font-cartoon font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTabMode === 'teacher'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Remote Giáo viên</span>
          </button>

          <button
            onClick={() => setActiveTabMode('info')}
            className={`pb-3 font-cartoon font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTabMode === 'info'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>📷 Mã QR</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Status banner */}
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-bold">KẾT NỐI TV LỚP HỌC: ĐÃ SẴN SÀNG</span>
            </div>
            <span className="text-xs text-slate-300 font-mono italic">
              Hoạt động: <b className="text-amber-300">{lastAction}</b>
            </span>
          </div>

          {/* TAB 1: QR HỌC SINH */}
          {activeTabMode === 'student' && (
            <div className="max-w-md mx-auto bg-emerald-50/70 p-5 rounded-3xl border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <span className="font-cartoon font-black text-sm text-emerald-950 flex items-center gap-1.5">
                  <span>🎒</span> BÀN TRẢ LỜI CỦA HỌC SINH / TỔ
                </span>
                <select
                  value={studentTeam}
                  onChange={(e) => setStudentTeam(e.target.value)}
                  className="p-1.5 text-xs font-cartoon font-bold bg-white rounded-xl border border-emerald-300 text-emerald-950 focus:outline-none"
                >
                  <option>Tổ 1 - Sóc Nâu</option>
                  <option>Tổ 2 - Ong Vàng</option>
                  <option>Tổ 3 - Họa Mi</option>
                  <option>Tổ 4 - Voi Con</option>
                </select>
              </div>

              {/* Big Buzzer Button */}
              <button
                onClick={handleStudentBuzzer}
                className="w-full btn-3d btn-3d-rose py-4 rounded-3xl flex items-center justify-center gap-3 text-white font-cartoon font-black text-lg shadow-xl ring-4 ring-rose-300"
              >
                <Bell className="w-7 h-7 animate-bounce" />
                <span>BẤM CHUÔNG TRẢ LỜI NGAY! 🔔</span>
              </button>

              {/* 4 Choices: A, B, C, D */}
              <div>
                <span className="text-xs font-cartoon font-bold text-slate-600 block mb-2 text-center uppercase tracking-wider">
                  Chọn đáp án bài toán trên TV:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleStudentPickOption(opt)}
                      className={`py-3.5 rounded-2xl font-cartoon font-black text-xl transition-all shadow-md active:scale-95 border-2 ${
                        studentAnswer === opt
                          ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                          : 'bg-white hover:bg-emerald-100 text-emerald-950 border-emerald-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hand raise & Cheer buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    playSound.click();
                    setLastAction(`✋ ${studentTeam} đang giơ tay phát biểu ý kiến!`);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-white border border-emerald-300 text-emerald-900 font-cartoon font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:bg-emerald-100"
                >
                  <Hand className="w-4 h-4 text-amber-500" />
                  <span>Giơ tay phát biểu</span>
                </button>

                <button
                  onClick={handleStudentCheer}
                  className="py-2.5 px-3 rounded-2xl bg-pink-100 hover:bg-pink-200 border border-pink-300 text-pink-900 font-cartoon font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Thả tim cổ vũ</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REMOTE ĐO GÓC TV TƯƠNG TÁC */}
          {activeTabMode === 'interactive' && (
            <div className="max-w-md mx-auto bg-amber-50/80 p-5 rounded-3xl border-2 border-amber-300 space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-cartoon font-black text-sm text-amber-950 flex items-center gap-1.5">
                  <span>📐</span> ĐIỀU KHIỂN THƯỚC ĐO GÓC TRÊN TV
                </span>
                <button
                  onClick={() => {
                    playSound.click();
                    setActiveTab('interactive-practice');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-cartoon text-xs font-bold shadow-sm"
                >
                  Mở tab Đo góc
                </button>
              </div>

              {/* Angle Protractor Quick Rotation Controller */}
              <div className="space-y-2">
                <span className="text-xs font-cartoon font-bold text-amber-900 block text-center uppercase">
                  Xoay thước đo góc trên TV:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      playSound.click();
                      dispatchRemoteAction('ROTATE_PROTRACTOR', { delta: -15 });
                      setLastAction('Xoay thước ngược chiều 15°');
                    }}
                    className="py-3 rounded-2xl bg-white border-2 border-amber-300 font-cartoon font-black text-amber-950 text-sm shadow-sm active:scale-95"
                  >
                    ↺ -15°
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      dispatchRemoteAction('ROTATE_PROTRACTOR', { delta: -5 });
                      setLastAction('Xoay thước ngược chiều 5°');
                    }}
                    className="py-3 rounded-2xl bg-white border-2 border-amber-300 font-cartoon font-black text-amber-950 text-sm shadow-sm active:scale-95"
                  >
                    ↺ -5°
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      dispatchRemoteAction('ROTATE_PROTRACTOR', { delta: 5 });
                      setLastAction('Xoay thước thuận chiều 5°');
                    }}
                    className="py-3 rounded-2xl bg-white border-2 border-amber-300 font-cartoon font-black text-amber-950 text-sm shadow-sm active:scale-95"
                  >
                    +5° ↻
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      dispatchRemoteAction('ROTATE_PROTRACTOR', { delta: 15 });
                      setLastAction('Xoay thước thuận chiều 15°');
                    }}
                    className="py-3 rounded-2xl bg-white border-2 border-amber-300 font-cartoon font-black text-amber-950 text-sm shadow-sm active:scale-95"
                  >
                    +15° ↻
                  </button>
                </div>
              </div>

              {/* Snap to vertex & Show answer */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    playSound.pop();
                    dispatchRemoteAction('SNAP_PROTRACTOR');
                    setLastAction('Đặt tâm thước vào đỉnh góc');
                  }}
                  className="btn-3d btn-3d-blue py-3 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md"
                >
                  <span className="font-cartoon font-bold text-sm">🎯 VÀO ĐỈNH GÓC</span>
                  <span className="text-[10px] opacity-90">Hít tâm thước chuẩn xác</span>
                </button>

                <button
                  onClick={() => {
                    playSound.click();
                    dispatchRemoteAction('TOGGLE_ANSWER');
                    setLastAction('Hiện / Ẩn đáp án đo góc');
                  }}
                  className="btn-3d btn-3d-amber py-3 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md text-amber-950"
                >
                  <span className="font-cartoon font-bold text-sm">👁️ HIỆN / ẨN ĐÁP ÁN</span>
                  <span className="text-[10px] opacity-90">Hiển thị số đo chuẩn</span>
                </button>
              </div>

              {/* Next exercise & Lock gestures */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    playSound.click();
                    dispatchRemoteAction('NEXT_EXERCISE');
                    setLastAction('Chuyển bài tập tiếp theo');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-white border border-amber-400 text-amber-950 font-cartoon font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Chuyển bài tiếp theo</span>
                </button>

                <button
                  onClick={() => {
                    playSound.pop();
                    dispatchRemoteAction('TOGGLE_LOCK');
                    setLastAction('Bật/Tắt khóa thao tác học sinh');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-white border border-amber-400 text-amber-950 font-cartoon font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Khóa / Mở thao tác</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REMOTE GIÁO VIÊN */}
          {activeTabMode === 'teacher' && (
            <div className="max-w-md mx-auto bg-slate-100 p-4 rounded-3xl border-2 border-slate-300 space-y-3">
              <div className="text-center pb-1">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider font-cartoon">
                  📱 BÀN ĐIỀU KHIỂN CẦM TAY DÀNH CHO GIÁO VIÊN
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() =>
                    triggerAction('Khen ngợi: Chính xác!', () => {
                      playSound.success();
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                    })
                  }
                  className="btn-3d btn-3d-green py-3 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-cartoon font-bold text-sm">KHEN NGỢI 🎉</span>
                  <span className="text-[10px] opacity-90">Bắn pháo hoa + Khen</span>
                </button>

                <button
                  onClick={() =>
                    triggerAction('Nhắc nhở: Thử lại nhé!', () => {
                      playSound.tryAgain();
                    })
                  }
                  className="btn-3d btn-3d-amber py-3 px-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md"
                >
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-cartoon font-bold text-sm">GỢI Ý 💡</span>
                  <span className="text-[10px] opacity-90">Bấm chuông thử lại</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() =>
                    triggerAction('Mở Đồ dùng dạy học', () => {
                      playSound.click();
                      setActiveTab('tools');
                    })
                  }
                  className="p-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-slate-700 font-bold text-xs flex flex-col items-center gap-1 shadow-sm active:bg-blue-50"
                >
                  <span className="text-lg">🧮</span>
                  <span>Đồ dùng</span>
                </button>

                <button
                  onClick={() =>
                    triggerAction('Mở 5 Hoạt động mẫu', () => {
                      playSound.click();
                      setActiveTab('activities');
                    })
                  }
                  className="p-2.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-400 text-slate-700 font-bold text-xs flex flex-col items-center gap-1 shadow-sm active:bg-emerald-50"
                >
                  <span className="text-lg">✨</span>
                  <span>5 Hoạt động</span>
                </button>

                <button
                  onClick={() =>
                    triggerAction('Mở Trợ lý Toán AI', () => {
                      playSound.click();
                      setActiveTab('ai-assistant');
                    })
                  }
                  className="p-2.5 rounded-xl bg-white border border-slate-300 hover:border-purple-400 text-slate-700 font-bold text-xs flex flex-col items-center gap-1 shadow-sm active:bg-purple-50"
                >
                  <span className="text-lg">🤖</span>
                  <span>Trợ lý AI</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() =>
                    triggerAction('Mở Bài học SGK', () => {
                      playSound.click();
                      setActiveTab('lessons');
                    })
                  }
                  className="py-2.5 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>📚 Bài học Toán 4</span>
                </button>

                <button
                  onClick={() =>
                    triggerAction('Bật/Tắt Toàn màn hình TV', () => {
                      playSound.pop();
                      setTvMode(prev => !prev);
                    })
                  }
                  className="py-2.5 px-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Chiếu TV (Full)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE & INSTRUCTIONS */}
          {activeTabMode === 'info' && (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Canvas Graphic */}
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-200 flex flex-col items-center shrink-0">
                <svg
                  className="w-48 h-48 text-slate-900"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="26" height="26" fill="black" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="black" rx="1" />

                  <rect x="69" y="5" width="26" height="26" fill="black" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="black" rx="1" />

                  <rect x="5" y="69" width="26" height="26" fill="black" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="black" rx="1" />

                  {/* Pattern dots */}
                  <rect x="36" y="8" width="6" height="6" fill="black" />
                  <rect x="46" y="8" width="6" height="6" fill="black" />
                  <rect x="56" y="8" width="6" height="6" fill="black" />
                  <rect x="36" y="18" width="6" height="6" fill="black" />
                  <rect x="48" y="24" width="6" height="6" fill="black" />
                  <rect x="36" y="38" width="6" height="6" fill="black" />
                  <rect x="48" y="38" width="6" height="6" fill="black" />
                  <rect x="60" y="38" width="6" height="6" fill="black" />
                  <rect x="72" y="38" width="6" height="6" fill="black" />
                  <rect x="84" y="38" width="6" height="6" fill="black" />
                  <rect x="8" y="48" width="6" height="6" fill="black" />
                  <rect x="20" y="48" width="6" height="6" fill="black" />
                  <rect x="36" y="48" width="6" height="6" fill="black" />
                  <rect x="48" y="48" width="6" height="6" fill="black" />
                  <rect x="60" y="48" width="6" height="6" fill="black" />
                  <rect x="72" y="48" width="6" height="6" fill="black" />
                  <rect x="84" y="48" width="6" height="6" fill="black" />
                  <rect x="36" y="60" width="6" height="6" fill="black" />
                  <rect x="48" y="60" width="6" height="6" fill="black" />
                  <rect x="60" y="60" width="6" height="6" fill="black" />
                  <rect x="36" y="72" width="6" height="6" fill="black" />
                  <rect x="48" y="72" width="6" height="6" fill="black" />
                  <rect x="60" y="84" width="6" height="6" fill="black" />
                  <rect x="72" y="84" width="6" height="6" fill="black" />
                  <rect x="84" y="84" width="6" height="6" fill="black" />
                  <rect x="72" y="66" width="6" height="6" fill="black" />
                  <rect x="84" y="72" width="6" height="6" fill="black" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-slate-500 mt-2">
                  ID: MATH4AI-CLASS-TV4A
                </span>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-cartoon font-black text-slate-800 text-sm uppercase tracking-wide">
                  Cách học sinh và giáo viên kết nối:
                </h4>
                <ol className="text-xs text-slate-600 space-y-2 font-semibold">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>Học sinh hoặc giáo viên dùng camera điện thoại quét mã QR ở bên cạnh.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>Chọn chế độ <b>"Học sinh"</b> để bấm chuông & chọn A-B-C-D, hoặc chọn <b>"Giáo viên"</b> để điều khiển TV.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>Tất cả tín hiệu bấm chuông, chọn bài và bắn pháo hoa hiển thị trực tiếp trên TV 16:9 của lớp học!</span>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
