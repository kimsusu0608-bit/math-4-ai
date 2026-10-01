import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  RotateCw, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Volume2, 
  HelpCircle,
  Maximize2,
  Trash2,
  Check,
  ChevronRight,
  Crosshair
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AngleExercise, ProtractorState } from './types';
import { SAMPLE_ANGLE_EXERCISES } from './sampleExercises';
import { ProtractorTool } from './ProtractorTool';
import { RulerTool } from './RulerTool';
import { SetSquareTool } from './SetSquareTool';
import { AngleExerciseView } from './AngleExerciseView';
import { TextbookViewer } from './TextbookViewer';
import { playSound, speakVietnamese } from '../../utils/audio';

interface InteractivePracticeTabProps {
  tvMode: boolean;
  onBackToHome: () => void;
  openQrModal: (mode?: 'student' | 'teacher') => void;
}

export const InteractivePracticeTab: React.FC<InteractivePracticeTabProps> = ({
  tvMode,
  onBackToHome,
  openQrModal,
}) => {
  // Mode: 'exercise' (direct angle practice) or 'textbook' (full textbook page with upload & marking)
  const [activeSubMode, setActiveSubMode] = useState<'exercise' | 'textbook'>('exercise');

  // Exercises list (includes sample exercises + any custom marked ones)
  const [exercises, setExercises] = useState<AngleExercise[]>(SAMPLE_ANGLE_EXERCISES);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);

  const currentExercise = exercises[currentExerciseIdx] || exercises[0];

  // Virtual Tool States
  const [protractorState, setProtractorState] = useState<ProtractorState>({
    x: 200,
    y: 420,
    rotation: 0,
    scale: 1.15,
    opacity: 0.9,
    visible: true,
  });

  const [isRulerVisible, setIsRulerVisible] = useState<boolean>(false);
  const [isSetSquareVisible, setIsSetSquareVisible] = useState<boolean>(false);

  // Teacher Controls
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Student Interaction & Checking
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [inputAngle, setInputAngle] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'correct' | 'incorrect' | 'needs_protractor';
    message: string;
  }>({ status: 'idle', message: '' });

  // Custom textbook image state
  const [customTextbookImage, setCustomTextbookImage] = useState<string | null>(null);
  const [isMarkingMode, setIsMarkingMode] = useState<boolean>(false);

  // Score & History
  const [score, setScore] = useState<number>(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  // Reset tool positions when switching exercise
  const resetProtractorPosition = () => {
    playSound.pop();
    setProtractorState((prev) => ({
      ...prev,
      x: 180,
      y: 440,
      rotation: 0,
      visible: true,
      opacity: 0.9,
    }));
    setShowAnswer(false);
    setSelectedAngle(null);
    setInputAngle('');
    setFeedback({ status: 'idle', message: '' });
  };

  // Switch to next or previous exercise
  const handleNextExercise = () => {
    playSound.click();
    const nextIdx = (currentExerciseIdx + 1) % exercises.length;
    setCurrentExerciseIdx(nextIdx);
    resetProtractorPosition();
  };

  const handlePrevExercise = () => {
    playSound.click();
    const prevIdx = currentExerciseIdx <= 0 ? exercises.length - 1 : currentExerciseIdx - 1;
    setCurrentExerciseIdx(prevIdx);
    resetProtractorPosition();
  };

  // Automatic Snap Protractor into Perfect Alignment (for demonstration or teacher assistance)
  const handleSnapToAngleDemo = () => {
    playSound.fanfare();
    setProtractorState((prev) => ({
      ...prev,
      x: currentExercise.vertex.x,
      y: currentExercise.vertex.y,
      rotation: currentExercise.arm1.angleDeg,
      visible: true,
    }));
    setShowAnswer(true);
  };

  // Handle Student Check Answer
  const handleCheckAnswer = () => {
    const chosenValue = selectedAngle !== null ? selectedAngle : Number(inputAngle);

    if (isNaN(chosenValue) || chosenValue <= 0) {
      playSound.tryAgain();
      setFeedback({
        status: 'incorrect',
        message: 'Em vui lòng chọn hoặc nhập số đo góc trước khi bấm kiểm tra nhé!',
      });
      return;
    }

    // Check if protractor was actually placed near vertex (distance <= 65px)
    const dist = Math.hypot(
      protractorState.x - currentExercise.vertex.x,
      protractorState.y - currentExercise.vertex.y
    );

    if (dist > 75 && !showAnswer) {
      playSound.tryAgain();
      setFeedback({
        status: 'needs_protractor',
        message: `⚠️ Em hãy kéo thước đo góc đến đỉnh ${currentExercise.vertex.label} và đặt tâm thước trùng với đỉnh góc để đo nhé!`,
      });
      return;
    }

    // Evaluate answer with tolerance
    const diff = Math.abs(chosenValue - currentExercise.correctAngle);
    if (diff <= currentExercise.tolerance) {
      // CORRECT!
      playSound.success();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (!solvedIds.includes(currentExercise.id)) {
        setSolvedIds((prev) => [...prev, currentExercise.id]);
        setScore((s) => s + 10);
      }

      setFeedback({
        status: 'correct',
        message: `🎉 CHÍNH XÁC! Góc ${currentExercise.title.split(':')[1] || ''} có số đo đúng là ${currentExercise.correctAngle}° (${currentExercise.angleType.toUpperCase()}). Em làm rất tốt!`,
      });

      // Text-to-speech encouragement
      speakVietnamese(`Chính xác! Góc có số đo là ${currentExercise.correctAngle} độ.`);
    } else {
      // INCORRECT - Friendly encouragement without revealing answer immediately
      playSound.tryAgain();
      setFeedback({
        status: 'incorrect',
        message: `Hãy kiểm tra lại vị trí thước hoặc vạch số đo. Đảm bảo một cạnh nằm trên vạch 0° của thước nhé!`,
      });
    }
  };

  // Quick preset angle pick
  const handleSelectOption = (deg: number) => {
    if (isLocked) return;
    playSound.click();
    setSelectedAngle(deg);
    setInputAngle(deg.toString());
  };

  // Add new exercise created from textbook image
  const handleSaveNewExercise = (newEx: AngleExercise) => {
    playSound.fanfare();
    setExercises((prev) => [...prev, newEx]);
    setCurrentExerciseIdx(exercises.length); // point to new exercise
    setActiveSubMode('exercise');
    resetProtractorPosition();
  };

  // Listen to remote control commands broadcast from QR Remote
  useEffect(() => {
    const handleRemoteEvent = (e: CustomEvent) => {
      const { action, payload } = e.detail || {};
      if (action === 'ROTATE_PROTRACTOR') {
        setProtractorState((p) => ({
          ...p,
          rotation: (p.rotation + (payload?.delta || 15)) % 360,
        }));
      } else if (action === 'SNAP_PROTRACTOR') {
        setProtractorState((p) => ({
          ...p,
          x: currentExercise.vertex.x,
          y: currentExercise.vertex.y,
          visible: true,
        }));
      } else if (action === 'TOGGLE_ANSWER') {
        setShowAnswer((prev) => !prev);
      } else if (action === 'TOGGLE_LOCK') {
        setIsLocked((prev) => !prev);
      } else if (action === 'NEXT_EXERCISE') {
        handleNextExercise();
      }
    };

    window.addEventListener('math4ai_remote_action' as any, handleRemoteEvent as any);
    return () => {
      window.removeEventListener('math4ai_remote_action' as any, handleRemoteEvent as any);
    };
  }, [currentExerciseIdx, exercises]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 select-none space-y-4 animate-fade-in">
      {/* TOP HEADER: Module Title & Mode Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-amber-300 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center text-3xl shadow-lg ring-3 ring-amber-300 shrink-0">
            📐
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black font-cartoon text-slate-900 tracking-tight">
                THỰC HÀNH TƯƠNG TÁC – THƯỚC ĐO GÓC
              </h2>
              <span className="text-xs font-bold font-cartoon px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-sm">
                TV Cảm Ứng Lớp 4
              </span>
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ⭐ Điểm: {score} ({solvedIds.length}/{exercises.length} bài)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Chạm và kéo thước đo góc ảo, xoay vạch 0° trùng cạnh góc để đọc số đo trên màn hình TV
            </p>
          </div>
        </div>

        {/* 2 Main Tabs: BÀI TẬP ĐO GÓC & TRANG SÁCH GIÁO KHOA */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
          <button
            onClick={() => {
              playSound.click();
              setActiveSubMode('exercise');
            }}
            className={`py-2 px-4 rounded-xl font-cartoon font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeSubMode === 'exercise'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>BÀI TẬP ĐO GÓC ({exercises.length})</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              setActiveSubMode('textbook');
            }}
            className={`py-2 px-4 rounded-xl font-cartoon font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeSubMode === 'textbook'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>TRANG SÁCH GIÁO KHOA (ẢNH/PDF)</span>
          </button>
        </div>
      </div>

      {/* EXERCISE SUB-NAV BAR (When in exercise mode) */}
      {activeSubMode === 'exercise' && (
        <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevExercise}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95"
              title="Bài tập trước đó"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
                  {currentExerciseIdx + 1}/{exercises.length}
                </span>
                <h3 className="font-cartoon font-bold text-sm sm:text-base text-white">
                  {currentExercise.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">{currentExercise.source}</p>
            </div>

            <button
              onClick={handleNextExercise}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95"
              title="Bài tập tiếp theo"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Exercise Chips Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {exercises.map((ex, idx) => {
              const isCurrent = idx === currentExerciseIdx;
              const isSolved = solvedIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    playSound.click();
                    setCurrentExerciseIdx(idx);
                    resetProtractorPosition();
                  }}
                  className={`w-9 h-9 rounded-xl font-cartoon font-black text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md'
                      : isSolved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={ex.title}
                >
                  {isSolved ? '✓' : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN INTERACTIVE WORKSPACE (16:9 CONTAINER) */}
      <div className="relative w-full h-[580px] bg-white rounded-3xl shadow-2xl border-4 border-slate-300 overflow-hidden select-none">
        {/* Lock Overlay if Teacher Locked student interaction */}
        {isLocked && (
          <div className="absolute top-4 right-4 z-40 bg-rose-600/90 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 font-cartoon font-bold text-sm border-2 border-white backdrop-blur-sm animate-pulse">
            <Lock className="w-5 h-5" />
            <span>GIÁO VIÊN ĐANG KHÓA THAO TÁC HỌC SINH</span>
          </div>
        )}

        {/* Workspace Content */}
        {activeSubMode === 'exercise' ? (
          <div className="relative w-full h-full">
            {/* Geometric Angle Renderer */}
            <AngleExerciseView
              exercise={currentExercise}
              showAnswer={showAnswer}
              tvMode={tvMode}
            />

            {/* Hint Box (if toggled) */}
            {showHint && (
              <div className="absolute top-4 left-4 z-30 max-w-md bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 shadow-xl text-xs text-amber-950 font-semibold space-y-1 animate-fade-in">
                <div className="flex items-center justify-between text-amber-800 font-cartoon font-black">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>HƯỚNG DẪN ĐO GÓC SƯ PHẠM</span>
                  </span>
                  <button onClick={() => setShowHint(false)} className="text-slate-400 hover:text-slate-700">
                    ✕
                  </button>
                </div>
                <p>{currentExercise.hint}</p>
                <p className="text-[11px] text-amber-800 italic pt-1 border-t border-amber-200">
                  {currentExercise.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Textbook Page View & Marking */
          <TextbookViewer
            customImage={customTextbookImage}
            onUploadImage={(img) => setCustomTextbookImage(img)}
            onSaveNewExercise={handleSaveNewExercise}
            isMarkingMode={isMarkingMode}
            setIsMarkingMode={setIsMarkingMode}
            tvMode={tvMode}
          />
        )}

        {/* VIRTUAL TOOLS (LAYERED ON TOP) */}
        {/* 1. Protractor Tool (Thước đo góc ảo) */}
        <ProtractorTool
          state={protractorState}
          onChange={setProtractorState}
          targetVertex={activeSubMode === 'exercise' ? currentExercise.vertex : undefined}
          isLocked={isLocked}
          tvMode={tvMode}
        />

        {/* 2. Optional Virtual 20cm Ruler */}
        <RulerTool
          visible={isRulerVisible}
          onClose={() => setIsRulerVisible(false)}
          isLocked={isLocked}
        />

        {/* 3. Optional Virtual Set Square (Ê-ke) */}
        <SetSquareTool
          visible={isSetSquareVisible}
          onClose={() => setIsSetSquareVisible(false)}
          isLocked={isLocked}
        />
      </div>

      {/* STUDENT ANSWER & VERIFICATION PANEL (Designed for Classroom Touch TV) */}
      {activeSubMode === 'exercise' && (
        <div className="bg-white rounded-3xl p-5 shadow-xl border-3 border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left: Prompt & Preset Options */}
          <div className="space-y-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center font-cartoon text-sm">
                ?
              </span>
              <span className="font-cartoon font-black text-slate-800 text-base sm:text-lg">
                Góc {currentExercise.title.split(':')[1]?.replace('Đo góc ', '') || 'trên'} có số đo là bao nhiêu độ?
              </span>
            </div>

            {/* Quick Option Buttons */}
            <div className="flex items-center flex-wrap gap-2.5">
              {currentExercise.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isLocked}
                  className={`py-3 px-5 rounded-2xl font-cartoon font-black text-lg transition-all shadow-md active:scale-95 border-2 ${
                    selectedAngle === opt
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-300 scale-105'
                      : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-300'
                  }`}
                >
                  {opt}°
                </button>
              ))}

              {/* Stepper adjustment */}
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-300 ml-2">
                <button
                  onClick={() => {
                    const cur = selectedAngle || currentExercise.correctAngle || 60;
                    handleSelectOption(Math.max(5, cur - 5));
                  }}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-200 font-bold text-sm text-slate-700 active:scale-90"
                  title="Giảm 5 độ"
                >
                  -5°
                </button>
                <span className="px-3 font-mono font-black text-base text-slate-900">
                  {selectedAngle !== null ? `${selectedAngle}°` : '...°'}
                </span>
                <button
                  onClick={() => {
                    const cur = selectedAngle || currentExercise.correctAngle || 60;
                    handleSelectOption(Math.min(180, cur + 5));
                  }}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-200 font-bold text-sm text-slate-700 active:scale-90"
                  title="Tăng 5 độ"
                >
                  +5°
                </button>
              </div>
            </div>
          </div>

          {/* Right: Big "KIỂM TRA KẾT QUẢ" Button */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={handleCheckAnswer}
              disabled={isLocked}
              className="w-full md:w-auto btn-3d btn-3d-green py-4 px-8 rounded-3xl font-cartoon font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 ring-4 ring-emerald-300 active:scale-95"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>KIỂM TRA KẾT QUẢ</span>
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK BANNER (If Checked) */}
      {feedback.status !== 'idle' && (
        <div
          className={`p-4 rounded-3xl border-3 flex items-center justify-between gap-3 shadow-lg animate-fade-in ${
            feedback.status === 'correct'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
              : feedback.status === 'needs_protractor'
              ? 'bg-amber-50 text-amber-950 border-amber-400'
              : 'bg-rose-50 text-rose-950 border-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.status === 'correct' ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-7 h-7 text-amber-600 shrink-0" />
            )}
            <p className="font-cartoon font-bold text-sm sm:text-base leading-relaxed">
              {feedback.message}
            </p>
          </div>

          {feedback.status === 'correct' && (
            <button
              onClick={handleNextExercise}
              className="btn-3d btn-3d-blue py-2 px-4 rounded-xl font-cartoon font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              <span>BÀI TIẾP THEO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* TEACHER TV CONTROL BAR (Extra-Large Touch-Friendly Controls as Requested) */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-3 border-slate-700 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 font-cartoon font-black text-xs sm:text-sm text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>CHẾ ĐỘ GIÁO VIÊN TRÊN MÀN HÌNH TV (TEACHER TV CONTROLS)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Tối ưu màn hình cảm ứng 16:9 • Nút bấm lớn không trượt
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. Hiện / Ẩn Đáp án */}
          <button
            onClick={() => {
              playSound.click();
              setShowAnswer(!showAnswer);
            }}
            className={`p-3 rounded-2xl font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              showAnswer
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-amber-400" />}
            <span>{showAnswer ? 'ẨN ĐÁP ÁN' : 'HIỆN ĐÁP ÁN'}</span>
          </button>

          {/* 2. Đặt lại thước */}
          <button
            onClick={resetProtractorPosition}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Đặt thước đo góc về vị trí ban đầu"
          >
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <span>ĐẶT LẠI THƯỚC</span>
          </button>

          {/* 3. Khóa / Mở Thao Tác Học Sinh */}
          <button
            onClick={() => {
              playSound.pop();
              setIsLocked(!isLocked);
            }}
            className={`p-3 rounded-2xl font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isLocked
                ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
            <span>{isLocked ? 'MỞ THAO TÁC' : 'KHÓA THAO TÁC'}</span>
          </button>

          {/* 4. Thước thẳng (20cm) */}
          <button
            onClick={() => {
              playSound.click();
              setIsRulerVisible(!isRulerVisible);
            }}
            className={`p-3 rounded-2xl font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isRulerVisible
                ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="text-xl">📏</span>
            <span>{isRulerVisible ? 'ẨN THƯỚC THẲNG' : 'THƯỚC THẲNG'}</span>
          </button>

          {/* 5. Ê-ke góc vuông */}
          <button
            onClick={() => {
              playSound.click();
              setIsSetSquareVisible(!isSetSquareVisible);
            }}
            className={`p-3 rounded-2xl font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isSetSquareVisible
                ? 'bg-yellow-500 text-slate-950 ring-2 ring-yellow-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span className="text-xl">📐</span>
            <span>{isSetSquareVisible ? 'ẨN Ê-KE' : 'Ê-KE VUÔNG'}</span>
          </button>

          {/* 6. Minh họa đo mẫu (Snap Demo) */}
          <button
            onClick={handleSnapToAngleDemo}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Tự động đặt thước đo mẫu vào góc để học sinh quan sát"
          >
            <Crosshair className="w-5 h-5 text-amber-300" />
            <span>MẪU ĐO CHUẨN</span>
          </button>

          {/* 7. Đọc đề bài (TTS Tiếng Việt) */}
          <button
            onClick={() => {
              playSound.pop();
              speakVietnamese(currentExercise.description);
            }}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-cartoon font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Đọc to đề bài bằng giọng tiếng Việt"
          >
            <Volume2 className="w-5 h-5 text-teal-400" />
            <span>ĐỌC ĐỀ BÀI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
