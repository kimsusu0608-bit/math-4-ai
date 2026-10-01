import React from 'react';
import { 
  Layers, 
  BookOpen, 
  MousePointer, 
  Sparkles, 
  Gamepad2, 
  ClipboardList, 
  Bot, 
  Tv, 
  QrCode, 
  ArrowDown, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { AppTab } from '../../types';
import { playSound } from '../../utils/audio';

interface ClassroomFlowchartProps {
  setActiveTab: (tab: AppTab) => void;
  setTvMode: (val: boolean) => void;
  openQrModal: (mode?: 'student' | 'teacher') => void;
}

export const ClassroomFlowchart: React.FC<ClassroomFlowchartProps> = ({
  setActiveTab,
  setTvMode,
  openQrModal,
}) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-8 animate-fade-in space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h3 className="font-cartoon font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              SƠ ĐỒ TIẾN TRÌNH TIẾT DẠY TOÁN 4 – MATH 4 AI
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            Quy trình sư phạm hoàn chỉnh từ Đồ dùng, Bài học đến Trò chơi, Bài tập, AI và Chiếu TV / QR tương tác
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-cartoon font-bold self-start sm:self-auto">
          ⚡ Bấm vào từng bước để mở ngay
        </div>
      </div>

      {/* Interactive Flow Diagram */}
      <div className="max-w-4xl mx-auto flex flex-col items-center py-2 select-none">
        {/* 1. ROOT: MATH 4 AI */}
        <div 
          onClick={() => {
            playSound.pop();
            setActiveTab('home');
          }}
          className="group cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-3xl shadow-xl hover:scale-105 transition-all text-center border-4 border-amber-300 ring-4 ring-blue-200"
        >
          <div className="text-[10px] uppercase tracking-widest font-mono text-amber-200 font-bold">
            TRUNG TÂM ĐIỀU HÀNH
          </div>
          <div className="font-cartoon font-black text-2xl tracking-wide flex items-center justify-center gap-2">
            <span>📐</span>
            <span>MATH 4 AI</span>
          </div>
        </div>

        {/* Stem arrow down */}
        <div className="w-0.5 h-6 bg-slate-300 my-1" />

        {/* Branch Split */}
        <div className="w-full max-w-xl relative flex justify-center items-center">
          {/* Horizontal crossbar */}
          <div className="w-3/4 h-0.5 bg-slate-300 absolute top-0" />
        </div>

        {/* Two Pillars: Left (Đồ dùng -> Kéo thả) & Right (Bài học -> Hoạt động) */}
        <div className="w-full max-w-2xl grid grid-cols-2 gap-4 sm:gap-10 pt-4">
          {/* LEFT BRANCH: ĐỒ DÙNG -> KÉO THẢ */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-0.5 h-4 bg-slate-300 -mt-4" />
            
            {/* Đồ dùng Node */}
            <div 
              onClick={() => {
                playSound.click();
                setActiveTab('tools');
              }}
              className="w-full group cursor-pointer bg-gradient-to-br from-amber-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-all border-2 border-amber-300 text-center"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧮</div>
              <div className="font-cartoon font-black text-sm sm:text-base">ĐỒ DÙNG</div>
              <div className="text-[11px] text-amber-100 font-semibold">13 Đồ dùng ảo SGK</div>
            </div>

            <ArrowDown className="w-5 h-5 text-amber-500 animate-bounce" />

            {/* Kéo - thả Node */}
            <div 
              onClick={() => {
                playSound.click();
                setActiveTab('tools');
              }}
              className="w-full group cursor-pointer bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 p-3.5 rounded-2xl shadow-md hover:scale-105 transition-all text-center"
            >
              <div className="flex items-center justify-center gap-1.5 font-cartoon font-black text-xs sm:text-sm">
                <MousePointer className="w-4 h-4 text-amber-600" />
                <span>KÉO – THẢ CHUỘT</span>
              </div>
              <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                Xoay, phóng to, thay đổi số
              </div>
            </div>
          </div>

          {/* RIGHT BRANCH: BÀI HỌC -> HOẠT ĐỘNG */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-0.5 h-4 bg-slate-300 -mt-4" />

            {/* Bài học Node */}
            <div 
              onClick={() => {
                playSound.click();
                setActiveTab('lessons');
              }}
              className="w-full group cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-all border-2 border-blue-300 text-center"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📚</div>
              <div className="font-cartoon font-black text-sm sm:text-base">BÀI HỌC</div>
              <div className="text-[11px] text-blue-100 font-semibold">Chuẩn GDPT 2018</div>
            </div>

            <ArrowDown className="w-5 h-5 text-blue-500 animate-bounce" />

            {/* Hoạt động Node */}
            <div 
              onClick={() => {
                playSound.click();
                setActiveTab('activities');
              }}
              className="w-full group cursor-pointer bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-950 p-3.5 rounded-2xl shadow-md hover:scale-105 transition-all text-center"
            >
              <div className="flex items-center justify-center gap-1.5 font-cartoon font-black text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>5 HOẠT ĐỘNG MẪU</span>
              </div>
              <div className="text-[10px] text-blue-800 font-semibold mt-0.5">
                Phân số, que tính, giờ, thước
              </div>
            </div>
          </div>
        </div>

        {/* Convergence crossbar & arrow */}
        <div className="w-full max-w-xl relative flex justify-center items-center mt-3">
          <div className="w-3/4 h-0.5 bg-slate-300" />
        </div>
        <div className="w-0.5 h-5 bg-slate-300" />
        <ArrowDown className="w-5 h-5 text-purple-600 mb-2" />

        {/* 3. TRÒ CHƠI TOÁN HỌC */}
        <div 
          onClick={() => {
            playSound.click();
            setActiveTab('games');
          }}
          className="w-full max-w-md group cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all border-2 border-purple-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">🎮</span>
            <div className="text-left">
              <div className="font-cartoon font-black text-sm sm:text-base">TRÒ CHƠI TOÁN HỌC</div>
              <div className="text-[11px] text-purple-100 font-semibold">Chú Ong Tìm Mật & Đấu Trường Triệu Phú</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="w-0.5 h-4 bg-slate-300 my-1" />
        <ArrowDown className="w-4 h-4 text-teal-600" />

        {/* 4. BÀI TẬP */}
        <div 
          onClick={() => {
            playSound.click();
            setActiveTab('exercises');
          }}
          className="w-full max-w-md group cursor-pointer bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all border-2 border-teal-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">📝</span>
            <div className="text-left">
              <div className="font-cartoon font-black text-sm sm:text-base">BÀI TẬP RÈN LUYỆN</div>
              <div className="text-[11px] text-teal-100 font-semibold">Tự động chấm điểm & giải thích chi tiết</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="w-0.5 h-4 bg-slate-300 my-1" />
        <ArrowDown className="w-4 h-4 text-rose-600" />

        {/* 5. TRỢ LÝ TOÁN AI */}
        <div 
          onClick={() => {
            playSound.click();
            setActiveTab('ai-assistant');
          }}
          className="w-full max-w-md group cursor-pointer bg-gradient-to-r from-rose-500 to-red-600 text-white p-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all border-2 border-rose-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
            <div className="text-left">
              <div className="font-cartoon font-black text-sm sm:text-base">TRỢ LÝ TOÁN AI</div>
              <div className="text-[11px] text-rose-100 font-semibold">Vẽ sơ đồ đoạn thẳng & giải từng bước sư phạm</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="w-0.5 h-4 bg-slate-300 my-1" />
        <ArrowDown className="w-4 h-4 text-blue-600" />

        {/* 6. TV 16:9 */}
        <div 
          onClick={() => {
            playSound.pop();
            setTvMode(true);
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
          }}
          className="w-full max-w-md group cursor-pointer bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all border-2 border-amber-400 flex items-center justify-between ring-2 ring-slate-400"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:scale-110 transition-transform">📺</span>
            <div className="text-left">
              <div className="font-cartoon font-black text-sm sm:text-base text-amber-300">
                CHẾ ĐỘ TV 16:9 (HDMI)
              </div>
              <div className="text-[11px] text-slate-300 font-semibold">
                Toàn màn hình, chữ lớn, nút lớn, không cuộn ngang
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-black font-cartoon">
            BẬT (F)
          </span>
        </div>

        <div className="w-0.5 h-4 bg-slate-300 my-1" />
        <ArrowDown className="w-4 h-4 text-emerald-600" />

        {/* 7. QR HỌC SINH */}
        <div 
          onClick={() => {
            playSound.click();
            openQrModal('student');
          }}
          className="w-full max-w-md group cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-all border-4 border-amber-400 flex items-center justify-between ring-4 ring-emerald-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
              📱
            </div>
            <div className="text-left">
              <div className="font-cartoon font-black text-base text-amber-200">
                QR HỌC SINH TƯƠNG TÁC
              </div>
              <div className="text-xs text-emerald-100 font-semibold">
                Quét mã để bấm chuông & chọn đáp án A, B, C, D
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black font-cartoon shadow">
            MỞ QR ➔
          </span>
        </div>
      </div>
    </div>
  );
};
