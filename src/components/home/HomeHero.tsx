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
  Sparkles,
  ArrowRight,
  MousePointer,
  ChevronRight
} from 'lucide-react';
import { AppTab } from '../../types';
import { playSound } from '../../utils/audio';
import { ClassroomFlowchart } from './ClassroomFlowchart';

interface HomeHeroProps {
  setActiveTab: (tab: AppTab) => void;
  openQrModal: (mode?: 'student' | 'teacher') => void;
  setTvMode: (val: boolean) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  setActiveTab,
  openQrModal,
  setTvMode,
}) => {
  const cards = [
    {
      id: 'interactive-practice' as AppTab,
      number: '★',
      title: 'THỰC HÀNH TƯƠNG TÁC',
      icon: '📐',
      badge: 'Mới • TV Cảm Ứng',
      desc: 'Thước đo góc ảo chân thực, tải trang SGK (ảnh/PDF), tạo góc đo trực tiếp trên bài tập TV.',
      color: 'from-orange-500 via-amber-500 to-rose-500',
      btnColor: 'btn-3d-rose',
    },
    {
      id: 'lessons' as AppTab,
      number: '1',
      title: 'BÀI HỌC TOÁN 4',
      icon: '📚',
      badge: 'Chuẩn GDPT 2018',
      desc: 'Số tự nhiên hàng triệu, Tìm hai số khi biết Tổng - Hiệu, Phân số, Hình học & Đo lường.',
      color: 'from-blue-500 to-indigo-600',
      btnColor: 'btn-3d-blue',
    },
    {
      id: 'tools' as AppTab,
      number: '2',
      title: 'ĐỒ DÙNG DẠY HỌC',
      icon: '🧮',
      badge: '13 Đồ dùng ảo',
      desc: 'Que tính, Thẻ số, Bảng số, Đồng hồ, Thước đo, Tiền VN, Phân số, Góc, Khối 3D, Biểu đồ.',
      color: 'from-amber-500 to-orange-600',
      btnColor: 'btn-3d-amber',
    },
    {
      id: 'games' as AppTab,
      number: '3',
      title: 'TRÒ CHƠI TOÁN HỌC',
      icon: '🎮',
      badge: 'Học mà chơi',
      desc: 'Chú Ong Tìm Mật, Đấu Trường Triệu Phú Toán 4 với âm thanh và pháo hoa rực rỡ.',
      color: 'from-purple-500 to-violet-600',
      btnColor: 'btn-3d-purple',
    },
    {
      id: 'ai-assistant' as AppTab,
      number: '4',
      title: 'TRỢ LÝ TOÁN AI',
      icon: '🤖',
      badge: 'Sư phạm tiểu học',
      desc: 'Nhập đề toán bất kỳ, AI phân tích, vẽ sơ đồ đoạn thẳng và hướng dẫn từng bước.',
      color: 'from-rose-500 to-pink-600',
      btnColor: 'btn-3d-rose',
    },
    {
      id: 'exercises' as AppTab,
      number: '5',
      title: 'BÀI TẬP RÈN LUYỆN',
      icon: '📝',
      badge: 'Tự động chấm điểm',
      desc: 'Hệ thống câu hỏi trắc nghiệm và điền số, có phản hồi và gợi ý chi tiết.',
      color: 'from-teal-500 to-emerald-600',
      btnColor: 'btn-3d-green',
    },
    {
      id: 'results' as AppTab,
      number: '6',
      title: 'KẾT QUẢ & VINH DANH',
      icon: '📊',
      badge: 'Bảng vàng lớp học',
      desc: 'Thống kê thành tích, trao huy hiệu sao điểm và chúc mừng cả lớp trên TV.',
      color: 'from-cyan-500 to-blue-600',
      btnColor: 'btn-3d-blue',
    },
  ];

  const handleCardClick = (tab: AppTab) => {
    playSound.pop();
    setActiveTab(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 select-none animate-fade-in space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden border-4 border-white/20">
        {/* Playful background decorative shapes */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-6 right-20 text-6xl opacity-20 pointer-events-none select-none">
          📐 ➗ ✖️ ➕
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-amber-950 font-cartoon font-bold text-xs shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>MÀN HÌNH DẠY HỌC TƯƠNG TÁC LỚP 4 TRÊN TV</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-cartoon tracking-tight leading-tight">
            TRỢ LÝ TOÁN LỚP 4 <br />
            <span className="text-amber-300">MATH 4 AI</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 font-semibold leading-relaxed">
            Biến TV thông thường của lớp học thành màn hình dạy Toán tương tác sống động thông qua chuột và bàn phím máy tính. Tích hợp trọn bộ 13 đồ dùng dạy học ảo, trợ lý giải toán sư phạm và trò chơi sôi nổi!
          </p>

          {/* Quick Action CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                playSound.pop();
                setActiveTab('interactive-practice');
              }}
              className="btn-3d btn-3d-rose py-3.5 px-6 rounded-2xl font-cartoon font-black text-base shadow-xl flex items-center gap-2 ring-2 ring-rose-300"
            >
              <span className="text-xl">📐</span>
              <span>THỰC HÀNH TƯƠNG TÁC (ĐO GÓC TV)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                playSound.pop();
                setActiveTab('activities');
              }}
              className="btn-3d btn-3d-green py-3.5 px-6 rounded-2xl font-cartoon font-black text-base shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>5 HOẠT ĐỘNG MẪU TƯƠNG TÁC</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                playSound.click();
                setActiveTab('tools');
              }}
              className="btn-3d btn-3d-amber py-3.5 px-6 rounded-2xl font-cartoon font-black text-base shadow-xl flex items-center gap-2 text-amber-950"
            >
              <Layers className="w-5 h-5" />
              <span>MỞ ĐỒ DÙNG DẠY HỌC (13 ĐỒ DÙNG)</span>
            </button>

            <button
              onClick={() => {
                playSound.pop();
                setTvMode(true);
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="btn-3d btn-3d-amber py-3.5 px-6 rounded-2xl font-cartoon font-black text-base shadow-xl flex items-center gap-2 text-amber-950 hover:scale-105 transition-all ring-2 ring-amber-300"
            >
              <Tv className="w-5 h-5 text-amber-950" />
              <span>BẬT TRÌNH CHIẾU TV 16:9 (HDMI)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlight Pill */}
      <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
            <MousePointer className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-cartoon font-bold text-slate-700">
            Dễ dàng điều khiển từ xa bằng chuột máy tính hoặc bàn phím trên TV • Chữ to, sắc nét, tương phản cao
          </span>
        </div>

        <button
          onClick={() => openQrModal()}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 font-cartoon hover:underline"
        >
          <QrCode className="w-4 h-4" />
          <span>Điều khiển bằng điện thoại qua mã QR</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Pedagogical Architecture Flowchart Diagram */}
      <ClassroomFlowchart
        setActiveTab={setActiveTab}
        setTvMode={setTvMode}
        openQrModal={openQrModal}
      />

      {/* 6 Core Modules Grid as Requested */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 flex items-center gap-2">
            <span>🌟</span> 6 CHỨC NĂNG DẠY VÀ HỌC TOÁN 4
          </h2>
          <span className="text-xs font-bold text-slate-500 font-cartoon">
            Bấm vào từng mục để bắt đầu tiết học
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="group relative bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-400 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Header of card */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-xs font-cartoon font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center font-mono">
                    {card.number}
                  </span>
                  <h3 className="font-cartoon font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2.5 px-4 rounded-xl font-cartoon font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm ${card.btnColor}`}
              >
                <span>BẮT ĐẦU NGAY</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
