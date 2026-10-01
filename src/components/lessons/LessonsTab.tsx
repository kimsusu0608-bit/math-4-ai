import React, { useState } from 'react';
import { LESSONS_DATA } from '../../data/lessonsData';
import { LessonTopic } from '../../types';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { playSound, speakVietnamese } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface LessonsTabProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

export const LessonsTab: React.FC<LessonsTabProps> = ({ tvMode, onBackToHome }) => {
  const [selectedTopic, setSelectedTopic] = useState<LessonTopic>(LESSONS_DATA[0]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const currentTopicIdx = LESSONS_DATA.findIndex(t => t.id === selectedTopic.id);

  const handleSelectTopic = (topic: LessonTopic) => {
    playSound.click();
    setSelectedTopic(topic);
    setActiveQuestionIdx(0);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  const handlePrevTopic = () => {
    if (currentTopicIdx > 0) {
      handleSelectTopic(LESSONS_DATA[currentTopicIdx - 1]);
    }
  };

  const handleNextTopic = () => {
    if (currentTopicIdx < LESSONS_DATA.length - 1) {
      handleSelectTopic(LESSONS_DATA[currentTopicIdx + 1]);
    }
  };

  const currentQ = selectedTopic.sampleQuestions[activeQuestionIdx];

  const handleResetQuestion = () => {
    playSound.pop();
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      playSound.tryAgain();
      setAnswerFeedback({
        isCorrect: false,
        message: 'Em hãy chọn một đáp án trước khi bấm kiểm tra nhé! 💡',
      });
      return;
    }

    if (selectedAnswer === currentQ.correctIndex) {
      playSound.success();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setAnswerFeedback({
        isCorrect: true,
        message: `Chính xác! ${currentQ.explanation} 🎉`,
      });
    } else {
      playSound.tryAgain();
      setAnswerFeedback({
        isCorrect: false,
        message: 'Thử lại nhé! Hãy đọc lại phần Trọng tâm bài học ở trên để chọn phương án chuẩn xác nhất! 💡',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 select-none animate-fade-in space-y-4">
      {/* Top Breadcrumb & Return to Home button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            playSound.pop();
            if (onBackToHome) onBackToHome();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 font-cartoon font-bold text-xs text-slate-700 shadow-sm transition-all hover:scale-102"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </button>

        <span className="text-xs font-cartoon font-bold text-slate-500">
          Chủ đề {currentTopicIdx + 1} / {LESSONS_DATA.length}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">📚</span>
            <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
              BÀI HỌC TOÁN LỚP 4 CHUẨN SGK
            </h2>
          </div>
          <p className="text-blue-100 text-sm font-semibold max-w-2xl">
            Hệ thống kiến thức trọng tâm, sơ đồ trực quan và câu hỏi thực hành nhanh cho từng chủ đề trên TV lớp học.
          </p>
        </div>

        <button
          onClick={() => speakVietnamese(`Bài học: ${selectedTopic.title}. ${selectedTopic.summary}`)}
          className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 text-white font-cartoon font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
          <span>ĐỌC BÀI HỌC</span>
        </button>
      </div>

      {/* Main Grid: Sidebar topics + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Topic List */}
        <div className="md:col-span-4 space-y-2">
          <div className="font-cartoon font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 px-1">
            Danh mục chủ đề:
          </div>
          {LESSONS_DATA.map((top) => {
            const isSelected = selectedTopic.id === top.id;
            return (
              <button
                key={top.id}
                onClick={() => handleSelectTopic(top)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 ring-2 ring-blue-300'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <span className="text-2xl shrink-0">{top.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>
                    {top.theme}
                  </span>
                  <div className="font-cartoon font-bold text-sm truncate">
                    {top.title}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Lesson Content */}
        <div className="md:col-span-8 space-y-5">
          {/* Summary Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <span className="text-3xl">{selectedTopic.icon}</span>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-cartoon">
                  {selectedTopic.theme}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cartoon text-slate-900">
                  {selectedTopic.title}
                </h3>
              </div>
            </div>

            <p className="text-base text-slate-700 font-semibold leading-relaxed">
              {selectedTopic.summary}
            </p>

            {/* Key Points */}
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <h4 className="font-cartoon font-black text-sm uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>KIẾN THỨC TRỌNG TÂM CẦN NHỚ:</span>
              </h4>
              <ul className="space-y-2">
                {selectedTopic.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Question */}
            {currentQ && (
              <div className="pt-4 border-t-2 border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-cartoon font-black text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎯</span> CÂU HỎI THỬ THÁCH TRÊN MÀN HÌNH:
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Câu {activeQuestionIdx + 1} / {selectedTopic.sampleQuestions.length}
                  </span>
                </div>

                <div className={`rounded-2xl border border-slate-200 font-black text-slate-900 mb-3 bg-slate-50 ${
                  tvMode ? 'p-5 text-lg sm:text-xl shadow-sm' : 'p-4 text-sm sm:text-base'
                }`}>
                  {currentQ.question}
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  {currentQ.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        playSound.click();
                        setSelectedAnswer(optIdx);
                        setAnswerFeedback(null);
                      }}
                      className={`rounded-2xl border-2 text-left font-cartoon font-bold transition-all ${
                        tvMode ? 'p-4 text-base font-black' : 'p-3 text-xs sm:text-sm'
                      } ${
                        selectedAnswer === optIdx
                          ? 'bg-blue-600 text-white border-blue-700 shadow-lg ring-2 ring-blue-300'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {answerFeedback && (
                  <div
                    className={`rounded-2xl border-2 mb-3 font-bold font-cartoon flex items-start gap-2.5 ${
                      tvMode ? 'p-4 text-base' : 'p-3.5 text-xs sm:text-sm'
                    } ${
                      answerFeedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    {answerFeedback.isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <span>{answerFeedback.message}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCheckAnswer}
                      className={`btn-3d btn-3d-blue rounded-2xl font-cartoon font-black shadow-md ${
                        tvMode ? 'py-3.5 px-8 text-base ring-2 ring-blue-300' : 'py-2.5 px-6 text-sm'
                      }`}
                    >
                      KIỂM TRA CÂU TRẢ LỜI
                    </button>

                    <button
                      onClick={handleResetQuestion}
                      className={`rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold ${
                        tvMode ? 'px-5 py-3 text-sm' : 'px-4 py-2.5 text-xs'
                      }`}
                      title="Chọn lại từ đầu"
                    >
                      CHỌN LẠI
                    </button>
                  </div>

                  {/* Question Switcher */}
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={activeQuestionIdx === 0}
                      onClick={() => {
                        playSound.click();
                        setActiveQuestionIdx(prev => prev - 1);
                        setSelectedAnswer(null);
                        setAnswerFeedback(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-xs disabled:opacity-40"
                    >
                      Câu trước
                    </button>
                    <button
                      disabled={activeQuestionIdx === selectedTopic.sampleQuestions.length - 1}
                      onClick={() => {
                        playSound.click();
                        setActiveQuestionIdx(prev => prev + 1);
                        setSelectedAnswer(null);
                        setAnswerFeedback(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-cartoon font-bold text-xs disabled:opacity-40"
                    >
                      Câu sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom topic stepper */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentTopicIdx === 0}
              onClick={handlePrevTopic}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-cartoon font-bold text-xs disabled:opacity-40 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chủ đề trước</span>
            </button>

            <button
              disabled={currentTopicIdx === LESSONS_DATA.length - 1}
              onClick={handleNextTopic}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-cartoon font-bold text-xs disabled:opacity-40 shadow-sm"
            >
              <span>Chủ đề tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
