export type AppTab = 
  | 'home' 
  | 'lessons' 
  | 'tools' 
  | 'activities'
  | 'interactive-practice'
  | 'games' 
  | 'ai-assistant' 
  | 'exercises' 
  | 'results';

export type ToolType = 
  | 'sticks'           // Que tính
  | 'number_cards'     // Thẻ số
  | 'number_board'     // Bảng số
  | 'clock'            // Đồng hồ
  | 'ruler'            // Thước đo
  | 'vietnam_money'    // Tiền Việt Nam
  | 'square'           // Hình vuông
  | 'rectangle'        // Hình chữ nhật
  | 'circle'           // Hình tròn
  | 'fraction'         // Phân số
  | 'angles'           // Góc (thước đo góc / eke)
  | 'cube_3d'          // Hình hộp chữ nhật
  | 'bar_chart';       // Biểu đồ

export interface ManipulativeItem {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  data: Record<string, any>;
}

export interface ActivityStep {
  id: number;
  title: string;
  instruction: string;
  type: 'fraction' | 'sticks' | 'clock' | 'ruler' | 'quiz';
  targetValue: any;
  hint: string;
  completed?: boolean;
}

export interface LessonTopic {
  id: string;
  title: string;
  theme: string; // 'Số học' | 'Hình học' | 'Đo lường' | 'Thống kê'
  icon: string;
  color: string;
  summary: string;
  keyPoints: string[];
  sampleQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface AIExplanationResult {
  problemTitle: string;
  given: string[];
  question: string;
  diagramDescription: string;
  method: string;
  steps: {
    stepNumber: number;
    stepTitle: string;
    explanation: string;
    calculation?: string;
    resultNote?: string;
  }[];
  finalAnswer: string;
  teacherTip: string;
  similarPracticeQuestion?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  topic: string;
  score: number;
  total: number;
  date: string;
  badges: string[];
}
