import React, { useRef, useState } from 'react';
import { 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Move, 
  PlusCircle, 
  Image as ImageIcon,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { AngleExercise } from './types';

interface TextbookViewerProps {
  customImage: string | null;
  onUploadImage: (dataUrl: string) => void;
  onSaveNewExercise: (ex: AngleExercise) => void;
  isMarkingMode: boolean;
  setIsMarkingMode: (val: boolean) => void;
  tvMode?: boolean;
}

export const TextbookViewer: React.FC<TextbookViewerProps> = ({
  customImage,
  onUploadImage,
  onSaveNewExercise,
  isMarkingMode,
  setIsMarkingMode,
  tvMode = false,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; startX: number; startY: number }>({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  });

  // Marking mode points: [Vertex, Arm1Point, Arm2Point]
  const [markedPoints, setMarkedPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [exerciseTitle, setExerciseTitle] = useState<string>('Bài tập đo góc từ trang sách giáo khoa');
  const [manualAngle, setManualAngle] = useState<number | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle local image or PDF file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound.pop();

    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUploadImage(event.target.result);
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.includes('pdf')) {
      // For PDF, convert or display via object or render page
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          onUploadImage(event.target.result);
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    playSound.click();
    setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    playSound.click();
    setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))));
  };

  const handleResetZoom = () => {
    playSound.click();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan controls
  const handlePanPointerDown = (e: React.PointerEvent) => {
    if (isMarkingMode) return;
    setIsPanning(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: pan.x,
      startY: pan.y,
    };
  };

  const handlePanPointerMove = (e: React.PointerEvent) => {
    if (!isPanning || isMarkingMode) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    setPan({
      x: Math.round(panStartRef.current.startX + dx),
      y: Math.round(panStartRef.current.startY + dy),
    });
  };

  const handlePanPointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Click on textbook image in Marking Mode
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMarkingMode || markedPoints.length >= 3) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Relative to container content
    const clickX = Math.round((e.clientX - rect.left - pan.x) / zoom);
    const clickY = Math.round((e.clientY - rect.top - pan.y) / zoom);

    playSound.pop();
    const newPoints = [...markedPoints, { x: clickX, y: clickY }];
    setMarkedPoints(newPoints);

    if (newPoints.length === 3) {
      // Calculate angle between vectors (V -> P1) and (V -> P2)
      const V = newPoints[0];
      const A = newPoints[1];
      const B = newPoints[2];

      const v1 = { x: A.x - V.x, y: A.y - V.y };
      const v2 = { x: B.x - V.x, y: B.y - V.y };

      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.hypot(v1.x, v1.y);
      const mag2 = Math.hypot(v2.x, v2.y);

      if (mag1 > 0 && mag2 > 0) {
        const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
        const calcDeg = Math.round((Math.acos(cosAngle) * 180) / Math.PI);
        setManualAngle(calcDeg);
      }
    }
  };

  // Complete and save new custom angle exercise
  const handleConfirmSave = () => {
    if (markedPoints.length < 3 || manualAngle === null) return;
    playSound.success();

    const V = markedPoints[0];
    const A = markedPoints[1];
    const B = markedPoints[2];

    const angleA = Math.atan2(A.y - V.y, A.x - V.x) * (180 / Math.PI);
    const angleB = Math.atan2(B.y - V.y, B.x - V.x) * (180 / Math.PI);

    let angleType: 'nhọn' | 'vuông' | 'tù' | 'bẹt' = 'nhọn';
    if (manualAngle === 90) angleType = 'vuông';
    else if (manualAngle > 90 && manualAngle < 180) angleType = 'tù';
    else if (manualAngle === 180) angleType = 'bẹt';

    const newEx: AngleExercise = {
      id: `custom-ex-${Date.now()}`,
      title: exerciseTitle,
      source: 'Bài tập tải lên từ SGK lớp học',
      description: `Dùng thước đo góc để đo góc tạo bởi các đỉnh vừa đánh dấu trên trang sách.`,
      angleType,
      vertex: {
        label: 'V',
        x: V.x,
        y: V.y,
      },
      arm1: {
        label: 'A',
        angleDeg: Math.round(angleA),
        length: Math.round(Math.hypot(A.x - V.x, A.y - V.y)),
      },
      arm2: {
        label: 'B',
        angleDeg: Math.round(angleB),
        length: Math.round(Math.hypot(B.x - V.x, B.y - V.y)),
      },
      correctAngle: manualAngle,
      tolerance: 4,
      options: [
        manualAngle,
        Math.max(15, manualAngle - 15),
        manualAngle + 20,
        manualAngle + 30,
      ].sort((a, b) => a - b),
      hint: `Đặt tâm thước đúng vào đỉnh V, vạch 0° trùng với tia VA rồi đọc số đo tia VB.`,
      explanation: `Góc đo được có số đo là ${manualAngle}° (${angleType}).`,
      imageBackground: customImage || undefined,
    };

    onSaveNewExercise(newEx);
    setIsMarkingMode(false);
    setMarkedPoints([]);
    setManualAngle(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-300 shadow-inner">
      {/* Top Toolbar */}
      <div className="bg-slate-900/95 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 z-20 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cartoon font-bold text-sm sm:text-base text-amber-300">
              TRANG SÁCH GIÁO KHOA TOÁN 4 TRÊN TV
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold">
              Tải ảnh/PDF trang bài tập • Phóng to, di chuyển và thực hành trực tiếp
            </p>
          </div>
        </div>

        {/* Action Buttons for Teacher */}
        <div className="flex items-center flex-wrap gap-2">
          {/* File Input */}
          <input
            key={fileInputKey}
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-3d btn-3d-blue py-2 px-3.5 rounded-xl font-cartoon font-bold text-xs flex items-center gap-1.5 shadow-md"
            title="Tải lên ảnh hoặc PDF bài tập trong SGK"
          >
            <Upload className="w-4 h-4" />
            <span>TẢI ẢNH / PDF SGK</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200"
              title="Thu nhỏ trang"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-xs text-amber-300 font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-200"
              title="Phóng to trang"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white ml-1 border-l border-slate-700"
              title="Đặt lại kích thước chuẩn"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teacher Angle Marking Mode Toggle */}
          <button
            onClick={() => {
              playSound.pop();
              setIsMarkingMode(!isMarkingMode);
              setMarkedPoints([]);
              setManualAngle(null);
            }}
            className={`btn-3d py-2 px-3.5 rounded-xl font-cartoon font-bold text-xs flex items-center gap-1.5 shadow-md ${
              isMarkingMode ? 'btn-3d-rose text-white ring-2 ring-rose-300' : 'btn-3d-amber text-amber-950'
            }`}
            title="Đánh dấu góc trong sách giáo khoa để tạo bài tập mới"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isMarkingMode ? 'HỦY TẠO GÓC' : 'TẠO BÀI TỪ TRANG SÁCH'}</span>
          </button>
        </div>
      </div>

      {/* Marking Instructions Bar if Teacher is creating an angle */}
      {isMarkingMode && (
        <div className="bg-amber-400 text-amber-950 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-cartoon font-bold z-20 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-mono">
              {markedPoints.length + 1}
            </span>
            <span>
              {markedPoints.length === 0 && '👉 Bước 1: Chạm vào ĐỈNH của góc trong trang sách.'}
              {markedPoints.length === 1 && '👉 Bước 2: Chạm vào một điểm trên CẠNH THỨ NHẤT của góc.'}
              {markedPoints.length === 2 && '👉 Bước 3: Chạm vào một điểm trên CẠNH THỨ HAI của góc.'}
              {markedPoints.length === 3 && '🎉 Đã xác định góc! Kiểm tra số đo và bấm LƯU BÀI TẬP.'}
            </span>
          </div>

          {markedPoints.length === 3 && manualAngle !== null && (
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-mono">
                Số đo: <b className="text-amber-300">{manualAngle}°</b>
              </span>
              <button
                onClick={handleConfirmSave}
                className="btn-3d btn-3d-green py-1.5 px-3 rounded-lg text-white font-cartoon text-xs flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>LƯU BÀI NÀY</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Canvas / Image Viewing Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePanPointerDown}
        onPointerMove={handlePanPointerMove}
        onPointerUp={handlePanPointerUp}
        onClick={handleContainerClick}
        className={`relative flex-1 w-full overflow-hidden select-none ${
          isMarkingMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{ touchAction: 'none' }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.08s ease-out',
          }}
          className="relative min-w-[900px] min-h-[580px] p-8 flex items-center justify-center"
        >
          {customImage ? (
            /* Uploaded Image or PDF render */
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-300 bg-white">
              <img
                src={customImage}
                alt="Trang sách giáo khoa"
                className="max-w-[840px] max-h-[520px] object-contain pointer-events-none select-none"
              />

              {/* Render Marked Points if in marking mode */}
              {markedPoints.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Lines between vertex and arms */}
                  {markedPoints[1] && (
                    <line
                      x1={markedPoints[0].x}
                      y1={markedPoints[0].y}
                      x2={markedPoints[1].x}
                      y2={markedPoints[1].y}
                      stroke="#e11d48"
                      strokeWidth="3"
                      strokeDasharray="4 3"
                    />
                  )}
                  {markedPoints[2] && (
                    <line
                      x1={markedPoints[0].x}
                      y1={markedPoints[0].y}
                      x2={markedPoints[2].x}
                      y2={markedPoints[2].y}
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeDasharray="4 3"
                    />
                  )}
                </svg>
              )}

              {markedPoints.map((pt, idx) => (
                <div
                  key={idx}
                  style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center border-2 border-white shadow-lg pointer-events-none"
                >
                  {idx === 0 ? 'V' : idx === 1 ? 'A' : 'B'}
                </div>
              ))}
            </div>
          ) : (
            /* Built-in Authentic Grade 4 Textbook Sample Graphic */
            <div className="w-[840px] h-[520px] bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 flex flex-col justify-between select-none">
              {/* Textbook Header */}
              <div className="border-b-2 border-amber-400 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-cartoon font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    SÁCH GIÁO KHOA TOÁN 4 • BÀI 16
                  </span>
                  <h2 className="text-2xl font-black font-cartoon text-slate-900 mt-1">
                    GÓC NHỌN, GÓC TÙ, GÓC BẸT – THỰC HÀNH ĐO GÓC
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-400 block">Trang 34 - 35</span>
                  <span className="text-xs font-bold text-emerald-600">Chuẩn GDPT 2018</span>
                </div>
              </div>

              {/* 3 Illustrative Angle Examples on Textbook page */}
              <div className="grid grid-cols-3 gap-4 my-2">
                {/* Fig 1: Góc nhọn */}
                <div className="p-4 bg-blue-50/70 rounded-2xl border-2 border-blue-200 flex flex-col items-center">
                  <span className="text-xs font-bold font-cartoon text-blue-900 mb-1">
                    Hình 1: Góc nhọn ABC (60°)
                  </span>
                  <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                    <line x1="30" y1="100" x2="170" y2="100" stroke="#1e40af" strokeWidth="3" />
                    <line x1="30" y1="100" x2="100" y2="20" stroke="#1e40af" strokeWidth="3" />
                    <circle cx="30" cy="100" r="4" fill="#e11d48" />
                    <text x="18" y="112" fill="#e11d48" fontSize="13" fontWeight="bold">B</text>
                    <text x="175" y="105" fill="#1e40af" fontSize="13" fontWeight="bold">C</text>
                    <text x="105" y="20" fill="#1e40af" fontSize="13" fontWeight="bold">A</text>
                    <path d="M 60 100 A 30 30 0 0 0 50 78" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="65" y="85" fill="#d97706" fontSize="11" fontWeight="bold">60°</text>
                  </svg>
                  <p className="text-[11px] text-slate-600 text-center font-semibold mt-1">
                    Góc nhọn bé hơn góc vuông
                  </p>
                </div>

                {/* Fig 2: Góc vuông */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 flex flex-col items-center">
                  <span className="text-xs font-bold font-cartoon text-emerald-900 mb-1">
                    Hình 2: Góc vuông MON (90°)
                  </span>
                  <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                    <line x1="40" y1="100" x2="160" y2="100" stroke="#047857" strokeWidth="3" />
                    <line x1="40" y1="100" x2="40" y2="15" stroke="#047857" strokeWidth="3" />
                    <rect x="40" y="82" width="18" height="18" fill="none" stroke="#e11d48" strokeWidth="2" />
                    <circle cx="40" cy="100" r="4" fill="#e11d48" />
                    <text x="25" y="112" fill="#e11d48" fontSize="13" fontWeight="bold">O</text>
                    <text x="168" y="105" fill="#047857" fontSize="13" fontWeight="bold">N</text>
                    <text x="45" y="18" fill="#047857" fontSize="13" fontWeight="bold">M</text>
                  </svg>
                  <p className="text-[11px] text-slate-600 text-center font-semibold mt-1">
                    Góc vuông bằng 90°
                  </p>
                </div>

                {/* Fig 3: Góc tù */}
                <div className="p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-200 flex flex-col items-center">
                  <span className="text-xs font-bold font-cartoon text-purple-900 mb-1">
                    Hình 3: Góc tù XEY (120°)
                  </span>
                  <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                    <line x1="120" y1="100" x2="190" y2="100" stroke="#6d28d9" strokeWidth="3" />
                    <line x1="120" y1="100" x2="40" y2="30" stroke="#6d28d9" strokeWidth="3" />
                    <circle cx="120" cy="100" r="4" fill="#e11d48" />
                    <text x="122" y="115" fill="#e11d48" fontSize="13" fontWeight="bold">E</text>
                    <text x="194" y="105" fill="#6d28d9" fontSize="13" fontWeight="bold">Y</text>
                    <text x="25" y="30" fill="#6d28d9" fontSize="13" fontWeight="bold">X</text>
                    <path d="M 150 100 A 30 30 0 0 0 100 82" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="110" y="75" fill="#d97706" fontSize="11" fontWeight="bold">120°</text>
                  </svg>
                  <p className="text-[11px] text-slate-600 text-center font-semibold mt-1">
                    Góc tù lớn hơn góc vuông
                  </p>
                </div>
              </div>

              {/* Textbook Footer & Tip */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-300 flex items-center justify-between text-xs text-amber-950 font-semibold">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>💡 <b>Quy tắc đo góc:</b> Đặt tâm thước trùng với đỉnh góc, một cạnh của góc nằm trên vạch số 0 của thước, đọc số đo theo cạnh còn lại.</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">NXB Giáo Dục Việt Nam</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
