import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw,
  Award,
  ArrowLeft
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ExercisesTabProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

interface QuestionItem {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const EXERCISES_LIST: QuestionItem[] = [
  {
    id: 1,
    topic: 'Số có nhiều chữ số',
    question: 'Lớp triệu của số 245.890.123 gồm những chữ số nào?',
    options: ['1, 2, 3', '8, 9, 0', '2, 4, 5', '2, 4, 5, 8'],
    correct: 2,
    explanation: 'Lớp đơn vị: 123; Lớp nghìn: 890; Lớp triệu: 245.',
  },
  {
    id: 2,
    topic: 'Tìm hai số khi biết Tổng và Hiệu',
    question: 'Hai số có tổng bằng 90, hiệu bằng 10. Số lớn là:',
    options: ['40', '45', '50', '55'],
    correct: 2,
    explanation: 'Số lớn = (Tổng + Hiệu) : 2 = (90 + 10) : 2 = 50.',
  },
  {
    id: 3,
    topic: 'Phân số',
    question: 'Phân số nào dưới đây bằng phân số 2/3?',
    options: ['4/9', '6/9', '8/15', '10/12'],
    correct: 1,
    explanation: 'Cả tử và mẫu nhân với 3: 2x3=6, 3x3=9 -> 6/9.',
  },
  {
    id: 4,
    topic: 'Hình học',
    question: 'Hình thoi có hai đường chéo dài 8cm và 6cm. Diện tích hình thoi là:',
    options: ['48 cm²', '24 cm²', '28 cm²', '14 cm²'],
    correct: 1,
    explanation: 'Diện tích hình thoi S = (m x n) : 2 = (8 x 6) : 2 = 24 cm².',
  },
  {
    id: 5,
    topic: 'Đo lường',
    question: '5 tấn 8 tạ = ............. tạ?',
    options: ['580 tạ', '58 tạ', '508 tạ', '85 tạ'],
    correct: 1,
    explanation: '5 tấn = 50 tạ. 50 tạ + 8 tạ = 58 tạ.',
  },
  {
    id: 6,
    topic: 'Trung bình cộng',
    question: 'Số trung bình cộng của 35, 45 và 70 là:',
    options: ['45', '50', '55', '60'],
    correct: 1,
    explanation: 'Tổng = 35 + 45 + 70 = 150. Trung bình cộng = 150 : 3 = 50.',
  },
];

export const ExercisesTab: React.FC<ExercisesTabProps> = ({ tvMode, onBackToHome }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelect = (qId: number, optIdx: number) => {
    playSound.click();
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    EXERCISES_LIST.forEach((q) => {
      if (answers[q.id] === q.correct) correctCount++;
    });

    setScore(correctCount);
    setSubmitted(true);

    if (correctCount >= 4) {
      playSound.success();
      confetti({ particleCount: 80, spread: 80 });
    } else {
      playSound.tryAgain();
    }
  };

  const handleReset = () => {
    playSound.pop();
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 select-none animate-fade-in space-y-4">
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
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>

          <span className="text-xs font-cartoon font-bold text-slate-500">
            Hệ thống bài tập tự chấm điểm
          </span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">📝</span>
            <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
              BỘ BÀI TẬP RÈN LUYỆN TOÁN 4
            </h2>
          </div>
          <p className="text-indigo-100 text-sm font-semibold max-w-2xl">
            Các câu hỏi chọn lọc bao quát toàn bộ chương trình lớp 4. Tự động chấm điểm và giải thích chi tiết từng câu.
          </p>
        </div>

        <div className="bg-white/20 px-4 py-2 rounded-2xl border border-white/30 text-xs font-bold font-cartoon flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Đã làm: {Object.keys(answers).length} / {EXERCISES_LIST.length} câu</span>
        </div>
      </div>

      {/* Submitted Result Scorecard */}
      {submitted && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black shadow-inner">
              🏆
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-100 font-cartoon">
                KẾT QUẢ ĐẠT ĐƯỢC:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-cartoon">
                Đúng {score} / {EXERCISES_LIST.length} câu ({Math.round((score / EXERCISES_LIST.length) * 10)} điểm)
              </h3>
              <p className="text-xs text-amber-100 font-semibold mt-0.5">
                {score >= 5 ? 'Tuyệt vời! Con đã nắm rất vững kiến thức Toán 4! 🎉' : 'Con hãy xem lại các câu chưa đúng và làm lại nhé! 💡'}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-2xl bg-white text-amber-950 font-cartoon font-black text-sm shadow-md hover:bg-amber-50 transition-colors"
          >
            LÀM LẠI TỪ ĐẦU
          </button>
        </div>
      )}

      {/* Exercise Questions List */}
      <div className="space-y-4">
        {EXERCISES_LIST.map((q, idx) => {
          const userChoice = answers[q.id];
          const isCorrect = userChoice === q.correct;
          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl border-2 transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-cartoon">
                  Câu {idx + 1} • {q.topic}
                </span>
                {submitted && (
                  <span className={`text-xs font-bold font-cartoon px-2 py-0.5 rounded-full ${
                    isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {isCorrect ? 'Chính xác! ✓' : 'Chưa đúng ✗'}
                  </span>
                )}
              </div>

              <h4 className={`font-black text-slate-900 mb-3 ${
                tvMode ? 'text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg'
              }`}>
                {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isPicked = userChoice === optIdx;
                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`rounded-2xl border-2 text-left font-cartoon font-bold transition-all ${
                        tvMode ? 'p-4 text-base' : 'p-3 text-xs sm:text-sm'
                      } ${
                        isPicked
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </button>
                  );
                })}
              </div>

              {/* Show explanation after submit */}
              {submitted && (
                <div className={`mt-3 rounded-2xl border border-slate-200 font-semibold bg-white/90 ${
                  tvMode ? 'p-4 text-sm sm:text-base' : 'p-3 text-xs'
                }`}>
                  <b className="text-indigo-900 font-cartoon">Giải thích:</b> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button bar */}
      <div className="mt-6 flex justify-center">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className={`btn-3d btn-3d-green rounded-2xl font-cartoon font-black shadow-xl flex items-center gap-2 disabled:opacity-50 ${
              tvMode ? 'py-4 px-12 text-lg ring-2 ring-emerald-300' : 'py-3 px-10 text-base'
            }`}
          >
            <CheckCircle2 className={tvMode ? 'w-6 h-6' : 'w-5 h-5'} />
            <span>NỘP BÀI VÀ CHẤM ĐIỂM</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className={`btn-3d btn-3d-blue rounded-2xl font-cartoon font-black shadow-xl flex items-center gap-2 ${
              tvMode ? 'py-4 px-10 text-lg ring-2 ring-blue-300' : 'py-3 px-8 text-base'
            }`}
          >
            <RotateCcw className={tvMode ? 'w-6 h-6' : 'w-5 h-5'} />
            <span>LÀM LẠI BỘ BÀI TẬP</span>
          </button>
        )}
      </div>
    </div>
  );
};
