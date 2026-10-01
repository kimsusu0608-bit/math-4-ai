export type AngleClassification = 'nhọn' | 'vuông' | 'tù' | 'bẹt';

export interface AngleExercise {
  id: string;
  title: string;
  source: string; // e.g. "SGK Toán 4 - Kết nối tri thức", "Chân trời sáng tạo", "Cánh diều"
  description: string;
  angleType: AngleClassification;
  vertex: {
    label: string;
    x: number; // in pixels relative to 900x560 canvas
    y: number;
  };
  arm1: {
    label: string;
    angleDeg: number; // direction angle in degrees (0 = right, 90 = down, etc. or standard cartesian)
    length: number;
  };
  arm2: {
    label: string;
    angleDeg: number;
    length: number;
  };
  correctAngle: number; // e.g. 60
  tolerance: number; // ±3 degrees tolerance
  options: number[];
  hint: string;
  explanation: string;
  imageBackground?: string; // Optional textbook page image
}

export interface ProtractorState {
  x: number;
  y: number;
  rotation: number; // degrees
  scale: number;
  opacity: number;
  visible: boolean;
}

export interface VirtualToolItem {
  id: 'protractor' | 'ruler' | 'setsquare';
  name: string;
  icon: string;
  active: boolean;
}
