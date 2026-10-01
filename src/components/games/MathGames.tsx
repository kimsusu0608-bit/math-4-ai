import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  HelpCircle,
  Volume2,
  ArrowLeft,
  ArrowRight,
  Zap
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface MathGamesProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

export const MathGames: React.FC<MathGamesProps> = ({ tvMode, onBackToHome }) => {
  const [selectedGame, setSelectedGame] = useState<'bee' | 'millionaire'>('bee');

  // BEE GAME STATE
  const [beeScore, setBeeScore] = useState<number>(0);
  const [beeStreak, setBeeStreak] = useState<number>(0);
  const [beeQuestion, setBeeQuestion] = useState<{ expr: string; options: number[]; correct: number }>({
    expr: '25 × 4 = ?',
    options: [100, 80, 120, 90],
    correct: 100,
  });
  const [beeFeedback, setBeeFeedback] = useState<string | null>(null);

  // MILLIONAIRE GAME STATE
  const [milLevel, setMilLevel] = useState<number>(0);
  const [milFeedback, setMilFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [used5050, setUsed5050] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);

  const millionaireQuestions = [
    {
      q: 'Một thế kỷ bằng bao nhiêu năm?',
      options: ['10 năm', '50 năm', '100 năm', '1000 năm'],
      correct: 2,
      prize: '1.000 điểm',
    },
    {
      q: 'Phân số 15/20 rút gọn về tối giản là:',
      options: ['3/4', '5/6', '3/5', '1/2'],
      correct: 0,
      prize: '5.000 điểm',
    },
    {
      q: 'Góc có số đo lớn hơn góc vuông và bé hơn góc bẹt là:',
      options: ['Góc nhọn', 'Góc tù', 'Góc vuông', 'Góc bẹt'],
      correct: 1,
      prize: '20.000 điểm',
    },
    {
      q: 'Tổng của hai số là 100, hiệu là 20. Số bé là:',
      options: ['40', '60', '30', '50'],
      correct: 0,
      prize: '50.000 điểm',
    },
    {
      q: 'Một hình bình hành có độ dài đáy 15cm, chiều cao 8cm. Diện tích là:',
      options: ['60 cm²', '120 cm²', '46 cm²', '240 cm²'],
      correct: 1,
      prize: '100.000 ĐIỂM (VÔ ĐỊCH 🏆)',
    },
  ];

  // Generate new Bee question
  const nextBeeQuestion = () => {
    const list = [
      { expr: '25 × 4 = ?', options: [100, 80, 120, 90], correct: 100 },
      { expr: '120 : 6 = ?', options: [20, 30, 15, 25], correct: 20 },
      { expr: '3/5 + 1/5 = ? (Tử số là)', options: [4, 2, 5, 3], correct: 4 },
      { expr: '450 + 550 = ?', options: [1000, 900, 1100, 950], correct: 1000 },
      { expr: '1 tấn = ? kg', options: [1000, 100, 10, 10000], correct: 1000 },
      { expr: '15 × 6 = ?', options: [90, 80, 100, 95], correct: 90 },
      { expr: '72 : 8 = ?', options: [9, 8, 7, 6], correct: 9 },
    ];
    const rand = list[Math.floor(Math.random() * list.length)];
    setBeeQuestion(rand);
    setBeeFeedback(null);
  };

  const handleBeeAnswer = (val: number) => {
    if (val === beeQuestion.correct) {
      playSound.success();
      confetti({ particleCount: 50, spread: 50 });
      setBeeScore(s => s + 10);
      setBeeStreak(s => s + 1);
      setBeeFeedback('Chính xác! Ong nhặt thêm 1 giọt mật ngọt! 🍯');
      setTimeout(() => {
        nextBeeQuestion();
      }, 1200);
    } else {
      playSound.tryAgain();
      setBeeStreak(0);
      setBeeFeedback('Thử lại nhé! Chú ong tính nhẩm lại chút xíu nào! 💡');
    }
  };

  const handle5050 = () => {
    if (used5050) return;
    playSound.pop();
    setUsed5050(true);
    const cur = millionaireQuestions[milLevel];
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== cur.correct);
    // Shuffle and pick 2 to hide
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleMilAnswer = (idx: number) => {
    const cur = millionaireQuestions[milLevel];
    if (idx === cur.correct) {
      playSound.success();
      confetti({ particleCount: 70, spread: 70 });
      if (milLevel === millionaireQuestions.length - 1) {
        playSound.fanfare();
        setMilFeedback({
          isCorrect: true,
          text: 'XUẤT SẮC! CẢ LỚP ĐÃ GIÀNH CHIẾN THẮNG ĐỈNH CAO 100.000 ĐIỂM! 🏆🎉',
        });
      } else {
        setMilFeedback({
          isCorrect: true,
          text: `Chính xác! Bạn nhận được ${cur.prize}! Chuẩn bị sang câu tiếp theo!`,
        });
        setTimeout(() => {
          setMilLevel(l => l + 1);
          setMilFeedback(null);
          setHiddenOptions([]);
        }, 1600);
      }
    } else {
      playSound.tryAgain();
      setMilFeedback({
        isCorrect: false,
        text: 'Thử lại nhé! Hãy hội ý cùng bạn bè trong tổ để tìm đáp án chính xác! 💡',
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
            <ArrowLeft className="w-4 h-4 text-purple-600" />
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>

          <span className="text-xs font-cartoon font-bold text-slate-500">
            Trò chơi tương tác lớp 4
          </span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🎮</span>
            <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
              TRÒ CHƠI TOÁN HỌC 3D VUI NHỘN
            </h2>
          </div>
          <p className="text-purple-100 text-sm font-semibold max-w-2xl">
            Tạo không khí học tập sôi động trong lớp học! Thi đua cá nhân hoặc chia tổ bấm chuông thi đấu trực tiếp trên TV.
          </p>
        </div>

        {/* Game Mode switch */}
        <div className="flex gap-2 bg-white/20 p-1.5 rounded-2xl border border-white/30">
          <button
            onClick={() => {
              playSound.click();
              setSelectedGame('bee');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-cartoon font-bold text-xs transition-all ${
              selectedGame === 'bee' ? 'bg-amber-400 text-amber-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            🐝 Chú Ong Tìm Mật
          </button>
          <button
            onClick={() => {
              playSound.click();
              setSelectedGame('millionaire');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-cartoon font-bold text-xs transition-all ${
              selectedGame === 'millionaire' ? 'bg-amber-400 text-amber-950 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            🏆 Đấu Trường Triệu Phú
          </button>
        </div>
      </div>

      {/* GAME 1: CHÚ ONG TÌM MẬT */}
      {selectedGame === 'bee' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-6">
          <div className="flex items-center justify-between max-w-md mx-auto bg-amber-50 p-3 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐝</span>
              <span className="font-cartoon font-bold text-sm text-amber-900">
                CHÚ ONG TÍNH NHANH
              </span>
            </div>
            <div className="px-3 py-1 bg-amber-500 text-white rounded-xl font-mono font-black text-sm shadow">
              Điểm: {beeScore} 🍯
            </div>
          </div>

          {/* Current Question */}
          <div className="max-w-md mx-auto py-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-cartoon">
              Tính nhanh kết quả bông hoa mật:
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-purple-700 mt-2 p-4 bg-purple-50 rounded-3xl border-2 border-purple-200 shadow-inner">
              {beeQuestion.expr}
            </div>
          </div>

          {/* 4 Flower Choices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {beeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleBeeAnswer(opt)}
                className="group relative p-6 rounded-3xl bg-gradient-to-b from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-4 border-amber-400 shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🌸</span>
                <span className="text-2xl font-black font-mono text-amber-950">
                  {opt}
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase font-cartoon">
                  Bông hoa {idx + 1}
                </span>
              </button>
            ))}
          </div>

            {/* Reset & Skip controls for Bee game */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  playSound.pop();
                  setBeeScore(0);
                  setBeeStreak(0);
                  nextBeeQuestion();
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại từ đầu</span>
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  nextBeeQuestion();
                }}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-cartoon font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Đổi phép tính khác</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
      )}

      {/* GAME 2: ĐẤU TRƯỜNG TRIỆU PHÚ TOÁN 4 */}
      {selectedGame === 'millionaire' && (
        <div className="bg-slate-900 text-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl font-black shadow-lg">
                🏆
              </div>
              <div>
                <h3 className="font-cartoon font-black text-xl text-amber-300">
                  ĐẤU TRƯỜNG TRIỆU PHÚ TOÁN 4
                </h3>
                <p className="text-xs text-slate-400">
                  Chinh phục 5 nấc thang kiến thức để giành cúp vàng
                </p>
              </div>
            </div>

            {/* Lifeline 50:50 and Prize badge */}
            <div className="flex items-center gap-2">
              <button
                disabled={used5050}
                onClick={handle5050}
                className={`px-3 py-1.5 rounded-xl font-cartoon font-bold text-xs flex items-center gap-1 shadow transition-all ${
                  used5050
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 scale-102 ring-2 ring-amber-300'
                }`}
                title={used5050 ? 'Đã sử dụng trợ giúp 50:50' : 'Bấm để loại bỏ 2 phương án sai'}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{used5050 ? '50:50 (ĐÃ DÙNG)' : 'TRỢ GIÚP 50:50'}</span>
              </button>

              <div className="px-4 py-1.5 bg-amber-500/20 border border-amber-400/50 rounded-xl text-amber-300 font-mono font-bold text-sm">
                Mốc: {millionaireQuestions[milLevel]?.prize}
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="p-6 bg-slate-800 rounded-3xl border-2 border-indigo-500/50 shadow-inner text-center">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              CÂU HỎI SỐ {milLevel + 1} / 5
            </span>
            <h4 className="text-xl sm:text-2xl font-cartoon font-black text-white mt-2 leading-relaxed">
              {millionaireQuestions[milLevel]?.q}
            </h4>
          </div>

          {/* 4 Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {millionaireQuestions[milLevel]?.options.map((opt, idx) => {
              const isHidden = hiddenOptions.includes(idx);
              if (isHidden) {
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-800/40 border-2 border-slate-700/40 opacity-20 pointer-events-none"
                  >
                    <span className="text-slate-500 font-mono font-bold">--- (Đã loại) ---</span>
                  </div>
                );
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleMilAnswer(idx)}
                  className="p-4 rounded-2xl bg-slate-800 hover:bg-indigo-700 border-2 border-slate-600 hover:border-amber-400 font-cartoon font-bold text-base text-left transition-all flex items-center gap-3 active:scale-98 shadow-md"
                >
                  <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-slate-100">{opt}</span>
                </button>
              );
            })}
          </div>

          {milFeedback && (
            <div
              className={`p-4 rounded-2xl text-center font-cartoon font-bold text-base animate-bounce-short ${
                milFeedback.isCorrect ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'
              }`}
            >
              {milFeedback.text}
            </div>
          )}

          {/* Restart */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                playSound.pop();
                setMilLevel(0);
                setMilFeedback(null);
                setUsed5050(false);
                setHiddenOptions([]);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-cartoon font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi lại từ Câu 1</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
