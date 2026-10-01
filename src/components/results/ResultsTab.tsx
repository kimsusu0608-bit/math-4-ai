import React from 'react';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Download, 
  Share2,
  Users,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ResultsTabProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ tvMode, onBackToHome }) => {
  const [studentList, setStudentList] = React.useState([
    { name: 'Nguyễn Minh An', topic: 'Tìm hai số khi biết Tổng và Hiệu', score: 10, star: 5, badge: 'Chiến Binh Toán Học 🌟' },
    { name: 'Trần Bảo Ngọc', topic: 'Phân số và Phép tính', score: 10, star: 5, badge: 'Thần Đồng Phân Số 🥧' },
    { name: 'Lê Hoàng Nam', topic: 'Đo lường & Diện tích', score: 9.5, star: 5, badge: 'Bậc Thầy Đo Lường 📏' },
    { name: 'Phạm Quỳnh Anh', topic: 'Góc & Hình bình hành', score: 9.5, star: 5, badge: 'Kiến Trúc Sư Nhí 📐' },
    { name: 'Vũ Đức Minh', topic: 'Số tự nhiên hàng triệu', score: 9, star: 4, badge: 'Thợ Săn Triệu Phú 🔢' },
    { name: 'Đỗ Thảo Vy', topic: 'Biểu đồ cột & Thống kê', score: 9, star: 4, badge: 'Chuyên Gia Dữ Liệu 📊' },
  ]);

  const handleCelebrate = () => {
    playSound.fanfare();
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const handleAddRandomHonor = () => {
    playSound.success();
    confetti({ particleCount: 70, spread: 60 });
    const sampleNames = ['Hoàng Gia Bảo', 'Vũ Mai Linh', 'Bùi Tuấn Kiệt', 'Đặng Thùy Dương', 'Lê Khánh Huyền'];
    const sampleTopics = ['Góc vuông & góc nhọn', 'Bốn phép tính số tự nhiên', 'Quy đồng mẫu số', 'Bảng đơn vị khối lượng'];
    const nextName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const nextTopic = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];

    setStudentList(prev => [
      { name: nextName, topic: nextTopic, score: 10, star: 5, badge: 'Học Sinh Xuất Sắc ⭐' },
      ...prev,
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 select-none animate-fade-in space-y-4">
      {/* Top Navigation Row */}
      {onBackToHome && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              playSound.pop();
              onBackToHome();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 font-cartoon font-bold text-xs text-slate-700 shadow-sm transition-all hover:scale-102"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600" />
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>

          <button
            onClick={handleAddRandomHonor}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-cartoon font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Khen thưởng học sinh tại lớp</span>
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
              KẾT QUẢ & BẢNG VINH DANH LỚP 4
            </h2>
          </div>
          <p className="text-teal-100 text-sm font-semibold max-w-2xl">
            Tuyên dương các bạn học sinh xuất sắc, ghi nhận tiến độ rèn luyện và trao huy hiệu học tập trực tiếp trên màn hình TV!
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className={`btn-3d btn-3d-amber rounded-2xl font-cartoon font-black shadow-xl flex items-center gap-2 ${
            tvMode ? 'py-4 px-8 text-base ring-2 ring-amber-300' : 'py-3 px-6 text-sm'
          }`}
        >
          <Sparkles className="w-6 h-6 text-amber-950 animate-spin" />
          <span className="text-amber-950">VINH DANH CẢ LỚP 🎉</span>
        </button>
      </div>

      {/* Class Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md text-center">
          <span className="text-3xl">👥</span>
          <div className="font-mono font-black text-3xl text-slate-800 mt-1">36</div>
          <p className="text-xs font-cartoon font-bold text-slate-500 uppercase mt-0.5">Sĩ số lớp 4A</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md text-center">
          <span className="text-3xl">⭐</span>
          <div className="font-mono font-black text-3xl text-amber-500 mt-1">9.4</div>
          <p className="text-xs font-cartoon font-bold text-slate-500 uppercase mt-0.5">Điểm trung bình</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md text-center">
          <span className="text-3xl">🎯</span>
          <div className="font-mono font-black text-3xl text-emerald-600 mt-1">98%</div>
          <p className="text-xs font-cartoon font-bold text-slate-500 uppercase mt-0.5">Tỉ lệ hoàn thành</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md text-center">
          <span className="text-3xl">🏅</span>
          <div className="font-mono font-black text-3xl text-purple-600 mt-1">28</div>
          <p className="text-xs font-cartoon font-bold text-slate-500 uppercase mt-0.5">Huy hiệu đạt được</p>
        </div>
      </div>

      {/* Honor Roll List */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-cartoon font-black text-slate-800 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>DANH SÁCH HỌC SINH ĐIỂM CAO TRONG TUẦN</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 font-mono">Cập nhật: Tuần 4 - Học kỳ I</span>
        </div>

        <div className="divide-y divide-slate-100">
          {studentList.map((st, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-cartoon font-black text-sm shadow-sm ${
                  idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-orange-300 text-orange-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {idx + 1}
                </div>

                <div>
                  <h4 className="font-cartoon font-black text-base text-slate-900">
                    {st.name}
                  </h4>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-0.5">
                    <span>Chủ đề: <b>{st.topic}</b></span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {st.badge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: st.star }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-mono font-black text-base shadow">
                  {st.score} đ
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
