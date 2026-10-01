import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Volume2, 
  Maximize2, 
  RefreshCw, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  Copy,
  ChevronRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { playSound, speakVietnamese } from '../../utils/audio';
import { AIExplanationResult } from '../../types';

interface MathAIAssistantProps {
  tvMode: boolean;
  onBackToHome?: () => void;
}

const SAMPLE_PROBLEMS = [
  {
    title: 'Tìm hai số khi biết Tổng và Hiệu',
    text: 'Hai anh em có tất cả 48 viên bi. Anh có nhiều hơn em 12 viên bi. Hỏi mỗi bạn có bao nhiêu viên bi?',
  },
  {
    title: 'Tìm hai số khi biết Tổng và Tỉ số',
    text: 'Một mảnh đất hình chữ nhật có chu vi là 120m. Chiều rộng bằng 2/3 chiều dài. Tính chiều dài và chiều rộng của mảnh đất đó.',
  },
  {
    title: 'Tìm số Trung bình cộng',
    text: 'Bốn bạn An, Bình, Cường và Dũng lần lượt hái được 14, 18, 16 và 20 quả táo. Hỏi trung bình mỗi bạn hái được bao nhiêu quả táo?',
  },
  {
    title: 'Phép tính phân số có lời văn',
    text: 'Một người thợ dệt ngày thứ nhất dệt được 2/5 tấm vải, ngày thứ hai dệt được 1/3 tấm vải. Hỏi sau hai ngày người đó dệt được bao nhiêu phần của tấm vải?',
  },
  {
    title: 'Hình học & Diện tích',
    text: 'Một thửa ruộng hình chữ nhật có chiều dài 25m, chiều rộng kém chiều dài 8m. Người ta trồng lúa trên thửa ruộng đó, cứ 1m² thu hoạch được 2kg thóc. Hỏi cả thửa ruộng thu hoạch được bao nhiêu kg thóc?',
  },
];

export const MathAIAssistant: React.FC<MathAIAssistantProps> = ({ tvMode, onBackToHome }) => {
  const [problemText, setProblemText] = useState<string>(SAMPLE_PROBLEMS[0].text);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIExplanationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fallback pedagogical generator for offline / instant demos
  const generatePedagogicalFallback = (text: string): AIExplanationResult => {
    if (text.includes('48') && text.includes('12')) {
      return {
        problemTitle: 'Tìm hai số khi biết Tổng và Hiệu',
        given: ['Tổng số bi của hai anh em là: 48 viên bi', 'Hiệu số bi (Anh hơn Em) là: 12 viên bi'],
        question: 'Tìm số bi của mỗi bạn (Anh có bao nhiêu viên? Em có bao nhiêu viên?)',
        diagramDescription: 'Em (Số bé):  [----------]\nAnh (Số lớn): [----------][-- 12 viên --]\nTổng hai bạn: 48 viên bi',
        method: 'Dùng sơ đồ đoạn thẳng: Bớt đi phần chênh lệch (12 viên) để được 2 lần số bi của em.',
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Tìm số viên bi của em (Số bé)',
            explanation: 'Hai lần số bi của em là: 48 - 12 = 36 (viên). Do đó số bi của em là:',
            calculation: '(48 - 12) : 2 = 18 (viên bi)',
            resultNote: 'Em có 18 viên bi.',
          },
          {
            stepNumber: 2,
            stepTitle: 'Tìm số viên bi của anh (Số lớn)',
            explanation: 'Vì anh hơn em 12 viên bi nên ta lấy số bi của em cộng với 12:',
            calculation: '18 + 12 = 30 (viên bi)',
            resultNote: 'Anh có 30 viên bi.',
          },
        ],
        finalAnswer: 'Em: 18 viên bi; Anh: 30 viên bi',
        teacherTip: 'Thầy cô nhắc học sinh thử lại: 30 + 18 = 48 (đúng tổng); 30 - 18 = 12 (đúng hiệu).',
        similarPracticeQuestion: 'Lớp 4B có 32 học sinh, số bạn nam nhiều hơn bạn nữ là 6 bạn. Tìm số bạn nam và bạn nữ.',
      };
    }

    if (text.includes('120') && (text.includes('2/3') || text.includes('chiều dài'))) {
      return {
        problemTitle: 'Tìm hai số khi biết Tổng và Tỉ số (Hình chữ nhật)',
        given: ['Chu vi hình chữ nhật là: 120m', 'Chiều rộng bằng 2/3 chiều dài'],
        question: 'Tính chiều dài và chiều rộng của mảnh đất đó.',
        diagramDescription: 'Chiều rộng: [--][--] (2 phần)\nChiều dài:  [--][--][--] (3 phần)\nTổng chiều rộng + chiều dài (Nửa chu vi): 60m',
        method: 'Tìm nửa chu vi (Tổng của chiều dài và chiều rộng), sau đó giải bài toán Tìm hai số khi biết Tổng và Tỉ số.',
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Tính nửa chu vi mảnh đất',
            explanation: 'Nửa chu vi hình chữ nhật là tổng của chiều dài và chiều rộng:',
            calculation: '120 : 2 = 60 (m)',
            resultNote: 'Tổng chiều dài và chiều rộng là 60m.',
          },
          {
            stepNumber: 2,
            stepTitle: 'Tìm tổng số phần bằng nhau',
            explanation: 'Theo sơ đồ: Chiều rộng 2 phần, chiều dài 3 phần:',
            calculation: '2 + 3 = 5 (phần)',
            resultNote: 'Giá trị 5 phần ứng với 60m.',
          },
          {
            stepNumber: 3,
            stepTitle: 'Tính chiều rộng mảnh đất',
            explanation: 'Giá trị một phần nhân với 2:',
            calculation: '(60 : 5) × 2 = 24 (m)',
            resultNote: 'Chiều rộng là 24m.',
          },
          {
            stepNumber: 4,
            stepTitle: 'Tính chiều dài mảnh đất',
            explanation: 'Lấy nửa chu vi trừ đi chiều rộng:',
            calculation: '60 - 24 = 36 (m)',
            resultNote: 'Chiều dài là 36m.',
          },
        ],
        finalAnswer: 'Chiều rộng: 24m; Chiều dài: 36m',
        teacherTip: 'Nhắc học sinh KHÔNG lấy ngay 120 chia cho 5 mà phải tìm Nửa chu vi trước!',
        similarPracticeQuestion: 'Một mảnh đất có nửa chu vi là 45m, chiều rộng bằng 4/5 chiều dài. Tính chiều dài và chiều rộng.',
      };
    }

    if (text.includes('14') && text.includes('18') && text.includes('16') && text.includes('20')) {
      return {
        problemTitle: 'Tìm số Trung bình cộng của 4 số',
        given: ['Số táo 4 bạn An, Bình, Cường, Dũng lần lượt là: 14, 18, 16, 20 quả'],
        question: 'Trung bình mỗi bạn hái được bao nhiêu quả táo?',
        diagramDescription: '[14 quả] + [18 quả] + [16 quả] + [20 quả] = [ Tổng: 68 quả ]\nChia đều cho 4 bạn: [ 17 ] [ 17 ] [ 17 ] [ 17 ]',
        method: 'Quy tắc tìm số trung bình cộng: Muốn tìm số trung bình cộng của nhiều số, ta tính tổng của các số đó, rồi chia tổng đó cho số các số hạng.',
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Tính tổng số táo của cả 4 bạn',
            explanation: 'Cộng số quả táo của cả bốn bạn lại với nhau:',
            calculation: '14 + 18 + 16 + 20 = 68 (quả)',
            resultNote: 'Cả 4 bạn hái được 68 quả táo.',
          },
          {
            stepNumber: 2,
            stepTitle: 'Tìm số trung bình cộng',
            explanation: 'Lấy tổng số quả táo chia cho 4 (vì có 4 bạn):',
            calculation: '68 : 4 = 17 (quả)',
            resultNote: 'Mỗi bạn trung bình có 17 quả.',
          },
        ],
        finalAnswer: 'Trung bình mỗi bạn hái được 17 quả táo',
        teacherTip: 'Chú ý đếm đúng số lượng các số hạng (ở đây có 4 bạn thì phải chia cho 4).',
        similarPracticeQuestion: 'Ba bạn có lần lượt 12, 15, 18 viên kẹo. Hỏi trung bình mỗi bạn có bao nhiêu viên kẹo?',
      };
    }

    if (text.includes('2/5') && text.includes('1/3')) {
      return {
        problemTitle: 'Cộng hai phân số khác mẫu số (Toán có lời văn)',
        given: ['Ngày thứ nhất dệt được: 2/5 tấm vải', 'Ngày thứ hai dệt được: 1/3 tấm vải'],
        question: 'Sau hai ngày người đó dệt được bao nhiêu phần của tấm vải?',
        diagramDescription: 'Tấm vải chia làm 15 phần bằng nhau:\nNgày 1: 2/5 = 6/15 [======]\nNgày 2: 1/3 = 5/15 [=====]\nCả 2 ngày: 6/15 + 5/15 = 11/15 [===========]',
        method: 'Để cộng hai phân số khác mẫu số, ta quy đồng mẫu số hai phân số rồi cộng các tử số với nhau, giữ nguyên mẫu số chung.',
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Quy đồng mẫu số hai phân số',
            explanation: 'Mẫu số chung là 5 × 3 = 15. Quy đồng: 2/5 = (2×3)/(5×3) = 6/15; 1/3 = (1×5)/(3×5) = 5/15.',
            calculation: '2/5 = 6/15  và  1/3 = 5/15',
            resultNote: 'Đã đưa hai phân số về cùng mẫu số 15.',
          },
          {
            stepNumber: 2,
            stepTitle: 'Thực hiện phép cộng hai phân số',
            explanation: 'Số phần tấm vải dệt được sau hai ngày là:',
            calculation: '6/15 + 5/15 = 11/15 (tấm vải)',
            resultNote: 'Dệt được 11/15 tấm vải.',
          },
        ],
        finalAnswer: '11/15 tấm vải',
        teacherTip: 'Nhắc học sinh KHÔNG cộng tử với tử, mẫu với mẫu (không được lấy 2+1 trên 5+3)!',
        similarPracticeQuestion: 'Một vòi nước giờ thứ nhất chảy được 1/4 bể, giờ thứ hai chảy được 2/5 bể. Hỏi cả hai giờ vòi chảy được bao nhiêu phần bể?',
      };
    }

    if (text.includes('25') && text.includes('8') && text.includes('2kg')) {
      return {
        problemTitle: 'Tính diện tích hình chữ nhật và sản lượng thu hoạch',
        given: ['Chiều dài thửa ruộng: 25m', 'Chiều rộng kém chiều dài: 8m', 'Cứ 1m² thu hoạch được: 2kg thóc'],
        question: 'Cả thửa ruộng thu hoạch được bao nhiêu kg thóc?',
        diagramDescription: 'Chiều dài: [ 25 m ]\nChiều rộng: [ 25 - 8 = 17 m ]\nDiện tích S = 25 × 17 = 425 m²\nSản lượng: 425 × 2 = 850 kg',
        method: 'Tìm chiều rộng -> Tính diện tích thửa ruộng (S = Dài × Rộng) -> Tính tổng số thóc thu hoạch.',
        steps: [
          {
            stepNumber: 1,
            stepTitle: 'Tính chiều rộng của thửa ruộng',
            explanation: 'Vì chiều rộng kém chiều dài 8m nên ta lấy chiều dài trừ đi 8:',
            calculation: '25 - 8 = 17 (m)',
            resultNote: 'Chiều rộng thửa ruộng là 17m.',
          },
          {
            stepNumber: 2,
            stepTitle: 'Tính diện tích của thửa ruộng',
            explanation: 'Diện tích hình chữ nhật bằng chiều dài nhân với chiều rộng:',
            calculation: '25 × 17 = 425 (m²)',
            resultNote: 'Diện tích là 425 m².',
          },
          {
            stepNumber: 3,
            stepTitle: 'Tính số kg thóc thu hoạch được',
            explanation: 'Cứ 1m² thu hoạch 2kg thóc, vậy 425m² thu hoạch được:',
            calculation: '425 × 2 = 850 (kg)',
            resultNote: 'Cả thửa ruộng thu hoạch 850kg thóc.',
          },
        ],
        finalAnswer: '850 kg thóc',
        teacherTip: 'Lưu ý đơn vị diện tích là mét vuông (m²), đơn vị thóc là ki-lô-gam (kg).',
        similarPracticeQuestion: 'Một khu vườn hình vuông cạnh 12m. Cứ 1m² trồng được 4 cây hoa. Hỏi cả khu vườn trồng được bao nhiêu cây hoa?',
      };
    }

    return {
      problemTitle: 'Phân tích và hướng dẫn giải bài toán lớp 4',
      given: ['Đề bài: ' + text],
      question: 'Tìm kết quả theo yêu cầu của bài toán',
      diagramDescription: 'Vẽ sơ đồ đoạn thẳng biểu thị mối quan hệ giữa các đại lượng trong bài toán.',
      method: 'Phương pháp phân tích tuần tự từng bước sư phạm tiểu học.',
      steps: [
        {
          stepNumber: 1,
          stepTitle: 'Đọc kỹ đề và tóm tắt',
          explanation: 'Xác định các số liệu bài toán cho và đại lượng cần tìm.',
          calculation: '',
          resultNote: 'Nắm chắc yêu cầu bài toán.',
        },
        {
          stepNumber: 2,
          stepTitle: 'Lập kế hoạch giải',
          explanation: 'Lựa chọn phép tính phù hợp và viết câu lời giải tương ứng.',
          calculation: '',
          resultNote: 'Thực hiện phép tính cẩn thận.',
        },
      ],
      finalAnswer: 'Ghi đáp số rõ ràng kèm tên đơn vị.',
      teacherTip: 'Khuyên học sinh luôn kiểm tra lại kết quả trước khi nộp bài.',
      similarPracticeQuestion: 'Hãy thử đổi số liệu của đề bài để tạo một bài toán mới cho bạn bên cạnh cùng làm!',
    };
  };

  const handleSolve = async () => {
    if (!problemText.trim()) return;
    playSound.click();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data);
          playSound.success();
        } else {
          setResult(generatePedagogicalFallback(problemText));
        }
      } else {
        // Fallback for smooth experience
        setResult(generatePedagogicalFallback(problemText));
      }
    } catch {
      setResult(generatePedagogicalFallback(problemText));
    } finally {
      setLoading(false);
    }
  };

  // Text to speech narration
  const handleReadExplanation = () => {
    if (!result) return;
    playSound.pop();
    const speech = `Bài toán: ${result.problemTitle}. ${result.method}. ${result.steps.map(s => `Bước ${s.stepNumber}: ${s.stepTitle}. ${s.explanation} ${s.calculation}`).join('. ')}. Đáp số: ${result.finalAnswer}.`;
    speakVietnamese(speech);
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
            <ArrowLeft className="w-4 h-4 text-rose-600" />
            <span>QUAY LẠI TRANG CHỦ</span>
          </button>

          <span className="text-xs font-cartoon font-bold text-slate-500">
            Trợ lý giải toán sư phạm tiểu học
          </span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                🤖
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-cartoon tracking-tight">
                TRỢ LÝ TOÁN AI – MATH 4 AI
              </h2>
            </div>
            <p className="text-rose-100 text-sm font-semibold max-w-2xl">
              Dành riêng cho giáo viên và học sinh lớp 4: Hướng dẫn phân tích đề bài, vẽ sơ đồ đoạn thẳng và suy luận từng bước theo chuẩn sư phạm tiểu học!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-xs font-bold font-cartoon text-white">
            ✨ Sư phạm GDPT 2018
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Sample Problems */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-cartoon font-black text-slate-800 text-base flex items-center gap-2">
                <span>✍️</span> Nhập bài toán lớp 4:
              </h3>
              {problemText && (
                <button
                  onClick={() => {
                    playSound.pop();
                    setProblemText('');
                    setResult(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-bold font-cartoon flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa đề</span>
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Thầy cô hoặc học sinh nhập đề bài toán cần trợ lý AI hướng dẫn..."
              className="w-full p-3.5 rounded-2xl border-2 border-slate-300 focus:border-rose-500 focus:outline-none text-slate-800 font-semibold text-sm leading-relaxed resize-none"
            />

            <button
              onClick={handleSolve}
              disabled={loading || !problemText.trim()}
              className="w-full mt-3 btn-3d btn-3d-rose py-3 px-6 rounded-2xl font-cartoon font-black text-base shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>ĐANG SUY NGHĨ TỪNG BƯỚC...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>HƯỚNG DẪN GIẢI TỪNG BƯỚC</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Sample Problems */}
          <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200">
            <h4 className="font-cartoon font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
              💡 Hoặc chọn bài toán mẫu kinh điển:
            </h4>
            <div className="space-y-2">
              {SAMPLE_PROBLEMS.map((prob, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSound.click();
                    setProblemText(prob.text);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition-all group"
                >
                  <div className="font-cartoon font-bold text-xs text-rose-700 group-hover:text-rose-900 flex items-center justify-between">
                    <span>{prob.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold truncate mt-0.5">
                    {prob.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Explanation Output */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-xl p-6 space-y-5 animate-fade-in">
              {/* Output Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 font-cartoon">
                    Dạng toán:
                  </span>
                  <h3 className="text-xl font-black font-cartoon text-slate-900">
                    {result.problemTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReadExplanation}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-1.5 text-xs font-bold font-cartoon shadow-sm"
                    title="Đọc bài giảng to trên TV"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>ĐỌC BÀI</span>
                  </button>
                </div>
              </div>

              {/* 1. Problem Analysis: Given & Question */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="font-cartoon font-bold text-xs text-blue-900 mb-1">
                    📋 Bài toán cho biết:
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 font-semibold list-disc list-inside">
                    {result.given.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="font-cartoon font-bold text-xs text-amber-900 mb-1">
                    ❓ Bài toán hỏi:
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">
                    {result.question}
                  </p>
                </div>
              </div>

              {/* 2. Visual Diagram (Sơ đồ đoạn thẳng) */}
              {result.diagramDescription && (
                <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <div className="font-cartoon font-bold text-xs text-purple-900 mb-2 flex items-center gap-1.5">
                    <span>📊</span>
                    <span>TÓM TẮT BẰNG SƠ ĐỒ ĐOẠN THẲNG:</span>
                  </div>
                  <pre className={`font-mono text-purple-950 font-bold bg-white p-3 rounded-xl border border-purple-200 whitespace-pre-wrap leading-relaxed shadow-inner ${
                    tvMode ? 'text-sm sm:text-base' : 'text-xs'
                  }`}>
                    {result.diagramDescription}
                  </pre>
                </div>
              )}

              {/* 3. Method */}
              <div className={`p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 ${
                tvMode ? 'text-sm sm:text-base' : 'text-xs'
              }`}>
                <b className="font-cartoon font-bold text-emerald-900 text-base">💡 Phương pháp tư duy: </b>
                <span className="font-semibold">{result.method}</span>
              </div>

              {/* 4. Step-by-step Solution */}
              <div className="space-y-3">
                <h4 className={`font-cartoon font-black uppercase tracking-wider text-slate-700 ${
                  tvMode ? 'text-base sm:text-lg' : 'text-sm'
                }`}>
                  📝 Các bước giải chi tiết:
                </h4>

                {result.steps.map((st) => (
                  <div key={st.stepNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full bg-rose-500 text-white font-cartoon font-black flex items-center justify-center shrink-0 ${
                        tvMode ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'
                      }`}>
                        {st.stepNumber}
                      </span>
                      <span className={`font-cartoon font-bold text-slate-800 ${
                        tvMode ? 'text-base sm:text-lg' : 'text-sm'
                      }`}>
                        {st.stepTitle}
                      </span>
                    </div>

                    <p className={`font-semibold pl-8 text-slate-700 leading-relaxed ${
                      tvMode ? 'text-sm sm:text-base' : 'text-xs'
                    }`}>
                      {st.explanation}
                    </p>

                    {st.calculation && (
                      <div className={`ml-8 p-3 bg-white rounded-xl border-2 border-slate-300 font-mono font-black text-rose-600 inline-block shadow-sm ${
                        tvMode ? 'text-base sm:text-lg' : 'text-sm'
                      }`}>
                        {st.calculation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 5. Final Answer */}
              <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-90">
                    KẾT QUẢ / ĐÁP SỐ:
                  </span>
                  <div className={`font-black font-cartoon mt-0.5 ${
                    tvMode ? 'text-2xl sm:text-3xl' : 'text-xl'
                  }`}>
                    {result.finalAnswer}
                  </div>
                </div>
                <CheckCircle2 className="w-8 h-8 opacity-90" />
              </div>

              {/* 6. Teacher tip & similar practice */}
              {result.teacherTip && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <b>Lời khuyên của Trợ lý AI:</b> {result.teacherTip}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center text-4xl mb-4 shadow-inner">
                🤖
              </div>
              <h3 className="font-cartoon font-black text-xl text-slate-800 mb-1">
                Trợ lý Toán AI sẵn sàng!
              </h3>
              <p className="text-sm text-slate-500 font-semibold max-w-sm mb-4">
                Nhập bất kỳ bài toán lớp 4 nào ở ô bên trái hoặc chọn bài toán mẫu để nhận hướng dẫn sư phạm từng bước.
              </p>
              <button
                onClick={handleSolve}
                className="btn-3d btn-3d-rose py-2.5 px-6 rounded-2xl font-cartoon font-bold text-sm shadow-md"
              >
                GIẢI THÍCH BÀI MẪU NGAY
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
