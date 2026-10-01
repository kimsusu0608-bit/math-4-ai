import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Volume2,
  Clock,
  Ruler,
  PieChart,
  HelpCircle as QuestionIcon,
  Smile,
  Frown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, speakVietnamese } from '../../utils/audio';

interface SampleActivitiesProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

export const SampleActivities: React.FC<SampleActivitiesProps> = ({ tvMode, onBackToHome }) => {
  const [currentActivity, setCurrentActivity] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; hint?: string } | null>(null);

  // Activity 1 State: Phân số (Pizza / Băng giấy 3/4)
  const [act1Slices, setAct1Slices] = useState<boolean[]>([true, true, false, false]); // target: exactly 3 true
  const act1Total = 4;

  // Activity 2 State: Que tính 24 + 18 = 42
  const [act2Tens, setAct2Tens] = useState<number>(3); // tens bundles
  const [act2Ones, setAct2Ones] = useState<number>(8); // single sticks (target: 4 tens, 2 ones OR 42 total)

  // Activity 3 State: Đồng hồ 16h45
  const [act3Hours, setAct3Hours] = useState<number>(4);
  const [act3Minutes, setAct3Minutes] = useState<number>(20); // target: 4h45 or 16h45

  // Activity 4 State: Đo thước bút chì (12cm)
  const [act4RulerX, setAct4RulerX] = useState<number>(40); // align ruler
  const [act4Answer, setAct4Answer] = useState<string>('');

  // Activity 5 State: Bài toán Tổng - Hiệu
  const [act5Choice, setAct5Choice] = useState<number | null>(null);

  const resetCurrentActivity = () => {
    playSound.pop();
    setFeedback(null);
    if (currentActivity === 1) setAct1Slices([false, false, false, false]);
    else if (currentActivity === 2) { setAct2Tens(0); setAct2Ones(0); }
    else if (currentActivity === 3) { setAct3Hours(12); setAct3Minutes(0); }
    else if (currentActivity === 4) setAct4Answer('');
    else if (currentActivity === 5) setAct5Choice(null);
  };

  const activitiesList = [
    { id: 1, title: '1. Biểu diễn phân số bằng hình ảnh', icon: '🥧', badge: 'Phân số' },
    { id: 2, title: '2. Que tính thực hiện phép tính', icon: '🥖', badge: 'Số học' },
    { id: 3, title: '3. Xem giờ bằng đồng hồ', icon: '⏰', badge: 'Thời gian' },
    { id: 4, title: '4. Đo độ dài bằng thước', icon: '📏', badge: 'Đo lường' },
    { id: 5, title: '5. Chọn đáp án bài toán lớp 4', icon: '📝', badge: 'Toán có lời văn' },
  ];

  const switchActivity = (id: number) => {
    playSound.click();
    setCurrentActivity(id);
    setFeedback(null);
  };

  // Check Activity 1: 3/4
  const checkAct1 = () => {
    const selectedCount = act1Slices.filter(Boolean).length;
    if (selectedCount === 3) {
      playSound.success();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác! Con đã tô màu đúng 3 phần trên 4 phần để biểu diễn phân số 3/4 chiếc bánh rồi! 🎉',
      });
    } else {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: `Phân số 3/4 có tử số là 3 (cần lấy 3 phần), mẫu số là 4 (chia làm 4 phần bằng nhau). Hiện tại con đang chọn ${selectedCount} phần. Hãy điều chỉnh lại nhé! 💡`,
      });
    }
  };

  // Check Activity 2: 24 + 18 = 42
  const checkAct2 = () => {
    const total = act2Tens * 10 + act2Ones;
    if (total === 42) {
      playSound.success();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác! 24 + 18 = 42 que tính! Con đã gom que tính và bó chục rất chuẩn xác! 🎉',
      });
    } else {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: `Tổng số que tính của con hiện tại là ${total} que. Đề bài yêu cầu tính 24 + 18. Hãy tính nhẩm: 4 que + 8 que = 12 que (được 1 bó chục và 2 que lẻ) rồi cộng vào nhé! 💡`,
      });
    }
  };

  // Check Activity 3: 4h45 or 16h45
  const checkAct3 = () => {
    if (act3Minutes === 45 && (act3Hours === 4 || act3Hours === 16)) {
      playSound.success();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác! Lúc 16 giờ 45 phút (4 giờ 45 phút chiều), kim phút chỉ đúng số 9 (45 phút) và kim giờ gần tới số 5! 🎉',
      });
    } else {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: '16 giờ tương ứng với 4 giờ chiều. Kim phút muốn chỉ 45 phút thì cần quay đến số mấy trên đồng hồ? (Mỗi số cách nhau 5 phút: 5, 10, 15... 45). Hãy bấm chỉnh lại nhé! 💡',
      });
    }
  };

  // Check Activity 4: 12 cm
  const checkAct4 = () => {
    const clean = act4Answer.trim().replace('cm', '').trim();
    if (clean === '12') {
      playSound.success();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác! Chiếc bút chì dài đúng 12 cm! Con đọc vạch thước đo rất chuẩn! 🎉',
      });
    } else {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: 'Hãy nhìn đầu bên trái của bút chì đặt tại vạch số 0, sau đó nhìn sang đầu nhọn bên phải của bút chì xem gióng xuống vạch số mấy trên thước nhé! 💡',
      });
    }
  };

  // Check Activity 5: Tổng 36, Hiệu 4 -> Nữ = (36 + 4) : 2 = 20
  const checkAct5 = () => {
    if (act5Choice === null) {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: 'Em hãy chọn một trong bốn đáp án A, B, C, D trước khi bấm kiểm tra nhé! 💡',
      });
      return;
    }

    if (act5Choice === 1) {
      // Option B: 20 học sinh nữ
      playSound.success();
      confetti({ particleCount: 85, spread: 80, origin: { y: 0.6 } });
      setFeedback({
        isCorrect: true,
        message: 'Chính xác! Số học sinh nữ là: (36 + 4) : 2 = 20 (học sinh). Đây là bài toán Tìm hai số khi biết Tổng và Hiệu (Số lớn = (Tổng + Hiệu) : 2). 🎉',
      });
    } else {
      playSound.tryAgain();
      setFeedback({
        isCorrect: false,
        message: 'Thử lại nhé!',
        hint: 'Đây là dạng toán "Tìm hai số khi biết Tổng và Hiệu". Số học sinh nữ nhiều hơn nên đóng vai trò là Số lớn. Công thức: Số lớn = (Tổng + Hiệu) : 2. Hãy tính lại: (36 + 4) : 2 = ? 💡',
      });
    }
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
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>

          <span className="text-xs font-cartoon font-bold text-slate-500">
            Hoạt động tương tác {currentActivity} / 5
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">🌟</span>
              <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
                5 HOẠT ĐỘNG TOÁN TƯƠNG TÁC MẪU
              </h2>
            </div>
            <p className="text-emerald-100 text-sm font-semibold max-w-2xl">
              Được thiết kế chuẩn phương pháp sư phạm GDPT 2018: Trả lời đúng nhận pháo hoa vui vẻ, trả lời sai nhận gợi ý tư duy mà không bị lộ đáp án!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/30 self-stretch md:self-auto justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span className="font-cartoon font-bold text-sm">
              Hoạt động {currentActivity} / 5
            </span>
          </div>
        </div>
      </div>

      {/* Activity Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {activitiesList.map((act) => {
          const isActive = currentActivity === act.id;
          return (
            <button
              key={act.id}
              onClick={() => switchActivity(act.id)}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-102 ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <div className="text-2xl mb-1">{act.icon}</div>
              <div className="font-cartoon font-bold text-xs sm:text-sm leading-tight line-clamp-2">
                {act.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Activity Work Area */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-8 min-h-[480px] flex flex-col justify-between">
        {/* ================= ACTIVITY 1 ================= */}
        {currentActivity === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-cartoon">
                  Hoạt động 1: Phân số
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 mt-0.5">
                  Biểu diễn phân số 3/4 bằng hình ảnh
                </h3>
              </div>
              <button
                onClick={() => speakVietnamese('Hãy tô màu để biểu diễn phân số ba phần tư chiếc bánh.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                title="Đọc đề bài"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base text-slate-600 font-semibold">
              🎯 <b>Yêu cầu:</b> Một chiếc bánh pizza được chia đều thành 4 phần bằng nhau. Em hãy bấm chuột vào các miếng bánh để tô màu đúng <b>3/4 chiếc bánh</b> nhé!
            </p>

            {/* Interactive Pizza Display */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
              {/* Circular Pizza */}
              <div className="relative w-56 h-56 rounded-full border-4 border-amber-600 bg-amber-100 overflow-hidden shadow-2xl flex items-center justify-center">
                {/* 4 Quadrants */}
                <div
                  onClick={() => {
                    playSound.click();
                    const n = [...act1Slices];
                    n[0] = !n[0];
                    setAct1Slices(n);
                  }}
                  className={`absolute top-0 right-0 w-1/2 h-1/2 cursor-pointer transition-colors border-l-2 border-b-2 border-amber-500/60 flex items-center justify-center font-black font-cartoon ${
                    act1Slices[0] ? 'bg-amber-400 text-amber-950 shadow-inner' : 'bg-amber-50/60 hover:bg-amber-200/50 text-slate-400'
                  }`}
                >
                  {act1Slices[0] ? '🍕 Đã lấy' : 'Trống'}
                </div>

                <div
                  onClick={() => {
                    playSound.click();
                    const n = [...act1Slices];
                    n[1] = !n[1];
                    setAct1Slices(n);
                  }}
                  className={`absolute bottom-0 right-0 w-1/2 h-1/2 cursor-pointer transition-colors border-l-2 border-t-2 border-amber-500/60 flex items-center justify-center font-black font-cartoon ${
                    act1Slices[1] ? 'bg-amber-400 text-amber-950 shadow-inner' : 'bg-amber-50/60 hover:bg-amber-200/50 text-slate-400'
                  }`}
                >
                  {act1Slices[1] ? '🍕 Đã lấy' : 'Trống'}
                </div>

                <div
                  onClick={() => {
                    playSound.click();
                    const n = [...act1Slices];
                    n[2] = !n[2];
                    setAct1Slices(n);
                  }}
                  className={`absolute bottom-0 left-0 w-1/2 h-1/2 cursor-pointer transition-colors border-r-2 border-t-2 border-amber-500/60 flex items-center justify-center font-black font-cartoon ${
                    act1Slices[2] ? 'bg-amber-400 text-amber-950 shadow-inner' : 'bg-amber-50/60 hover:bg-amber-200/50 text-slate-400'
                  }`}
                >
                  {act1Slices[2] ? '🍕 Đã lấy' : 'Trống'}
                </div>

                <div
                  onClick={() => {
                    playSound.click();
                    const n = [...act1Slices];
                    n[3] = !n[3];
                    setAct1Slices(n);
                  }}
                  className={`absolute top-0 left-0 w-1/2 h-1/2 cursor-pointer transition-colors border-r-2 border-b-2 border-amber-500/60 flex items-center justify-center font-black font-cartoon ${
                    act1Slices[3] ? 'bg-amber-400 text-amber-950 shadow-inner' : 'bg-amber-50/60 hover:bg-amber-200/50 text-slate-400'
                  }`}
                >
                  {act1Slices[3] ? '🍕 Đã lấy' : 'Trống'}
                </div>

                {/* Center marker */}
                <div className="w-5 h-5 rounded-full bg-amber-800 z-10 shadow" />
              </div>

              {/* Current fraction display */}
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 flex flex-col items-center justify-center min-w-[200px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phân số hiện tại:
                </span>
                <div className="flex flex-col items-center font-mono font-black text-3xl text-emerald-600 bg-white px-6 py-3 rounded-2xl border-2 border-emerald-300 shadow-md">
                  <span>{act1Slices.filter(Boolean).length}</span>
                  <div className="w-12 h-1 bg-emerald-600 my-1 rounded" />
                  <span>4</span>
                </div>
                <span className="text-xs font-semibold text-slate-600 mt-3">
                  (Đã chọn {act1Slices.filter(Boolean).length} trên 4 phần)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACTIVITY 2 ================= */}
        {currentActivity === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-cartoon">
                  Hoạt động 2: Số học & Bốn phép tính
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 mt-0.5">
                  Dùng que tính thực hiện phép tính: 24 + 18
                </h3>
              </div>
              <button
                onClick={() => speakVietnamese('Dùng que tính để thực hiện phép tính hai mươi bốn cộng mười tám.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base text-slate-600 font-semibold">
              🎯 <b>Yêu cầu:</b> Hãy thêm bớt các <b>bó 10 que</b> và <b>que tính lẻ</b> sao cho tổng số que tính trên bàn bằng đúng kết quả của phép tính <b>24 + 18</b>.
            </p>

            <div className="bg-amber-50/70 p-6 rounded-3xl border-2 border-amber-200 flex flex-col items-center justify-center">
              {/* Counters & visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
                {/* Tens bundles */}
                <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center">
                  <span className="font-cartoon font-bold text-sm text-amber-900 mb-2">
                    🥖 BÓ 10 QUE (HÀNG CHỤC)
                  </span>
                  <div className="flex gap-2 min-h-[70px] items-center">
                    {Array.from({ length: act2Tens }).map((_, i) => (
                      <div key={i} className="px-2 py-1 bg-amber-200 rounded-lg border border-amber-400 text-xs font-black text-amber-900 shadow">
                        Bó 10
                      </div>
                    ))}
                    {act2Tens === 0 && <span className="text-xs text-slate-400">Chưa có bó nào</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => {
                        playSound.click();
                        setAct2Tens(Math.max(0, act2Tens - 1));
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-lg text-amber-950">
                      {act2Tens} bó (= {act2Tens * 10})
                    </span>
                    <button
                      onClick={() => {
                        playSound.click();
                        setAct2Tens(act2Tens + 1);
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Single sticks */}
                <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center">
                  <span className="font-cartoon font-bold text-sm text-amber-900 mb-2">
                    🥢 QUE TÍNH LẺ (HÀNG ĐƠN VỊ)
                  </span>
                  <div className="flex gap-1 flex-wrap min-h-[70px] items-center justify-center max-w-[180px]">
                    {Array.from({ length: act2Ones }).map((_, i) => (
                      <div key={i} className="w-1.5 h-12 bg-amber-500 rounded-full shadow-sm" />
                    ))}
                    {act2Ones === 0 && <span className="text-xs text-slate-400">Chưa có que lẻ nào</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => {
                        playSound.click();
                        setAct2Ones(Math.max(0, act2Ones - 1));
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-lg text-amber-950">
                      {act2Ones} que lẻ
                    </span>
                    <button
                      onClick={() => {
                        playSound.click();
                        setAct2Ones(act2Ones + 1);
                      }}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total readout */}
              <div className="mt-5 px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-cartoon font-bold text-base shadow flex items-center gap-2">
                <span>Tổng số que tính trên bàn:</span>
                <span className="text-xl font-mono text-amber-300 font-black">
                  {act2Tens * 10 + act2Ones} que
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACTIVITY 3 ================= */}
        {currentActivity === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-cartoon">
                  Hoạt động 3: Đọc và chỉnh giờ
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 mt-0.5">
                  Xem giờ bằng đồng hồ kim: 16 giờ 45 phút
                </h3>
              </div>
              <button
                onClick={() => speakVietnamese('Hãy chỉnh kim đồng hồ chỉ đúng mười sáu giờ bốn mươi lăm phút.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base text-slate-600 font-semibold">
              🎯 <b>Yêu cầu:</b> Lớp 4A tan học lúc <b>16 giờ 45 phút</b> (tức 4 giờ 45 phút chiều). Em hãy dùng các nút điều chỉnh bên dưới để quay đồng hồ chỉ đúng thời điểm này nhé!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-3">
              {/* Clock Face */}
              <div className="relative w-56 h-56 rounded-full border-4 border-slate-900 bg-amber-50 shadow-2xl flex items-center justify-center">
                {/* 12 numbers */}
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                  const angle = (n * 30 - 90) * (Math.PI / 180);
                  const r = 82;
                  const x = Math.round(112 + r * Math.cos(angle));
                  const y = Math.round(112 + r * Math.sin(angle));
                  return (
                    <span
                      key={n}
                      style={{ left: `${x}px`, top: `${y}px` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-sm font-black font-mono text-slate-900"
                    >
                      {n}
                    </span>
                  );
                })}

                {/* Hour Hand */}
                <div
                  style={{
                    transform: `rotate(${((act3Hours % 12) * 30) + (act3Minutes * 0.5)}deg)`,
                  }}
                  className="absolute w-2.5 h-16 bg-slate-900 rounded-full origin-bottom bottom-1/2 transition-transform duration-200 shadow"
                />

                {/* Minute Hand */}
                <div
                  style={{ transform: `rotate(${act3Minutes * 6}deg)` }}
                  className="absolute w-1.5 h-22 bg-indigo-600 rounded-full origin-bottom bottom-1/2 transition-transform duration-200 shadow"
                />

                <div className="w-4 h-4 bg-rose-600 rounded-full z-10 shadow" />
              </div>

              {/* Adjust Controls */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Giờ đang hiển thị:
                </span>
                <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl font-mono font-black text-2xl shadow">
                  {String(act3Hours).padStart(2, '0')}:{String(act3Minutes).padStart(2, '0')}
                </div>

                <div className="grid grid-cols-2 gap-2 w-full mt-2">
                  <button
                    onClick={() => {
                      playSound.click();
                      setAct3Hours(h => (h + 1) % 24);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-cartoon font-bold text-xs"
                  >
                    +1 Giờ
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      setAct3Hours(h => (h - 1 + 24) % 24);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 font-cartoon font-bold text-xs"
                  >
                    -1 Giờ
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      setAct3Minutes(m => (m + 5) % 60);
                    }}
                    className="py-2 px-3 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-cartoon font-bold text-xs"
                  >
                    +5 Phút
                  </button>
                  <button
                    onClick={() => {
                      playSound.click();
                      setAct3Minutes(m => (m + 15) % 60);
                    }}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-cartoon font-bold text-xs"
                  >
                    +15 Phút
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACTIVITY 4 ================= */}
        {currentActivity === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-cartoon">
                  Hoạt động 4: Đo độ dài
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 mt-0.5">
                  Đo độ dài chiếc bút chì bằng thước kẻ
                </h3>
              </div>
              <button
                onClick={() => speakVietnamese('Đo độ dài chiếc bút chì bằng thước kẻ và điền kết quả vào ô trống.')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base text-slate-600 font-semibold">
              🎯 <b>Yêu cầu:</b> Quan sát thước đo đặt bên dưới chiếc bút chì và nhập độ dài đo được (đơn vị <b>cm</b>) vào ô trả lời.
            </p>

            <div className="bg-amber-50/50 p-6 rounded-3xl border-2 border-amber-200 flex flex-col items-center">
              {/* Pencil graphic (exactly 12 units wide) */}
              <div className="relative w-full max-w-xl mb-4 pl-8">
                <div className="text-xs font-bold text-slate-500 mb-1">Vật thể cần đo: Chiếc bút chì màu</div>
                <div className="flex items-center h-10 w-[384px] relative">
                  {/* Eraser end */}
                  <div className="w-8 h-8 bg-rose-400 rounded-l-md border border-rose-500 shrink-0" />
                  {/* Metal band */}
                  <div className="w-3 h-8 bg-slate-400 shrink-0" />
                  {/* Body */}
                  <div className="flex-1 h-8 bg-amber-400 border-y border-amber-600 flex items-center justify-center font-bold text-amber-950 text-xs">
                    MATH 4 PENCIL
                  </div>
                  {/* Tip */}
                  <div className="w-0 h-0 border-y-[16px] border-y-transparent border-l-[32px] border-l-amber-200 relative shrink-0">
                    <div className="absolute top-[-4px] left-[-32px] w-0 h-0 border-y-[4px] border-y-transparent border-l-[8px] border-l-slate-900" />
                  </div>
                </div>
              </div>

              {/* Ruler graphic (0-15cm, exactly matching 32px per cm -> 12cm = 384px) */}
              <div className="w-full max-w-xl pl-8">
                <div className="relative h-14 bg-gradient-to-b from-yellow-100 to-amber-200 rounded-xl border-2 border-amber-500 flex shadow-inner overflow-hidden">
                  {Array.from({ length: 16 }).map((_, cm) => (
                    <div key={cm} className="w-[32px] relative border-r border-slate-700/80 h-full shrink-0">
                      <span className="absolute top-1 left-1 text-[11px] font-black font-mono text-slate-900 select-none">
                        {cm}
                      </span>
                      <div className="absolute bottom-0 right-0 w-[1.5px] h-6 bg-slate-900" />
                      {cm < 15 && (
                        <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer input & Quick Choices */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-cartoon font-bold text-sm text-slate-700">
                    Chiều dài chiếc bút chì là:
                  </span>
                  <input
                    type="number"
                    value={act4Answer}
                    onChange={(e) => setAct4Answer(e.target.value)}
                    placeholder="Nhập..."
                    className="w-24 px-3 py-2 rounded-xl border-2 border-slate-300 font-mono font-bold text-center text-lg focus:border-rose-500 focus:outline-none"
                  />
                  <span className="font-bold text-slate-800 text-base">cm</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-semibold hidden md:inline">Hoặc bấm chọn:</span>
                  {['8', '10', '12', '15'].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        playSound.click();
                        setAct4Answer(val);
                      }}
                      className={`px-3 py-1.5 rounded-xl border-2 font-mono font-bold text-xs transition-all ${
                        act4Answer === val
                          ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-105'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {val} cm
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACTIVITY 5 ================= */}
        {currentActivity === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 font-cartoon">
                  Hoạt động 5: Dạng toán kinh điển lớp 4
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-800 mt-0.5">
                  Bài toán: Tìm hai số khi biết Tổng và Hiệu
                </h3>
              </div>
              <button
                onClick={() =>
                  speakVietnamese(
                    'Lớp 4A có ba mươi sáu học sinh. Số học sinh nữ nhiều hơn số học sinh nam là bốn bạn. Hỏi lớp 4A có bao nhiêu học sinh nữ?'
                  )
                }
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Problem card */}
            <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 shadow-inner">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h4 className="font-cartoon font-bold text-lg text-purple-950 mb-1">
                    Đề bài:
                  </h4>
                  <p className="text-base text-slate-800 font-semibold leading-relaxed">
                    Lớp 4A có tất cả <b>36 học sinh</b>. Số học sinh nữ nhiều hơn số học sinh nam là <b>4 bạn</b>. Hỏi lớp 4A có bao nhiêu học sinh nữ?
                  </p>
                </div>
              </div>

              {/* Line diagram clue visual */}
              <div className="mt-4 p-3 bg-white rounded-2xl border border-purple-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-purple-900 font-cartoon">Sơ đồ đoạn thẳng gợi ý:</div>
                <div className="flex items-center gap-2">
                  <span className="w-20 font-bold">Nữ (Số lớn):</span>
                  <div className="h-4 bg-purple-400 rounded w-48 border border-purple-500" />
                  <div className="h-4 bg-rose-400 rounded w-12 border border-rose-500 text-[10px] text-white font-bold flex items-center justify-center">
                    +4
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 font-bold">Nam (Số bé):</span>
                  <div className="h-4 bg-purple-400 rounded w-48 border border-purple-500" />
                  <span className="text-[11px] font-mono font-bold text-slate-700 ml-2">Tổng: 36 bạn</span>
                </div>
              </div>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 0, label: 'A. 16 học sinh nữ' },
                { id: 1, label: 'B. 20 học sinh nữ' },
                { id: 2, label: 'C. 18 học sinh nữ' },
                { id: 3, label: 'D. 22 học sinh nữ' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    playSound.click();
                    setAct5Choice(opt.id);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left font-cartoon font-bold text-base transition-all ${
                    act5Choice === opt.id
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-102 ring-2 ring-purple-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Area & Bottom Check Controls */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200">
          {/* Feedback message banner if checked */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border-2 mb-4 animate-bounce-short flex items-start gap-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-cartoon font-black text-base">
                  {feedback.message}
                </div>
                {feedback.hint && (
                  <div className="text-sm font-semibold mt-1 text-slate-700">
                    {feedback.hint}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentActivity > 1) switchActivity(currentActivity - 1);
              }}
              disabled={currentActivity === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-sm disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bài trước</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentActivity === 1) checkAct1();
                  else if (currentActivity === 2) checkAct2();
                  else if (currentActivity === 3) checkAct3();
                  else if (currentActivity === 4) checkAct4();
                  else if (currentActivity === 5) checkAct5();
                }}
                className="btn-3d btn-3d-green py-3 px-8 rounded-2xl font-cartoon font-black text-base shadow-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>KIỂM TRA ĐÁP ÁN</span>
              </button>

              <button
                onClick={resetCurrentActivity}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-sm transition-colors flex items-center gap-1.5"
                title="Làm lại hoạt động này"
              >
                <RotateCcw className="w-4 h-4" />
                <span>LÀM LẠI</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (currentActivity < 5) switchActivity(currentActivity + 1);
              }}
              disabled={currentActivity === 5}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-sm disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Bài sau</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
