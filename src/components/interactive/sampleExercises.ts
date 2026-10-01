import { AngleExercise } from './types';

export const SAMPLE_ANGLE_EXERCISES: AngleExercise[] = [
  {
    id: 'ex-1-nhon-60',
    title: 'Bài 1: Đo góc ABC (Đỉnh B; cạnh BA, BC)',
    source: 'SGK Toán 4 – Kết nối tri thức (Trang 34)',
    description: 'Dùng thước đo góc để đo góc đỉnh B; cạnh BA, BC. Đặt tâm thước vào đỉnh B và vạch 0° trùng với tia BC.',
    angleType: 'nhọn',
    vertex: {
      label: 'B',
      x: 380,
      y: 340,
    },
    arm1: {
      label: 'C',
      angleDeg: 0, // Cạnh BC nằm ngang sang phải
      length: 260,
    },
    arm2: {
      label: 'A',
      angleDeg: -60, // Cạnh BA chếch lên 60°
      length: 250,
    },
    correctAngle: 60,
    tolerance: 3,
    options: [45, 60, 90, 120],
    hint: 'Đặt tâm thước đo góc trùng với đỉnh B. Xoay thước sao cho vạch số 0 của thước nằm trùng trên cạnh BC. Nhìn xem cạnh BA đi qua vạch số bao nhiêu.',
    explanation: 'Góc đỉnh B; cạnh BA, BC có số đo là 60°. Vì 60° < 90° nên đây là góc nhọn.',
  },
  {
    id: 'ex-2-vuong-90',
    title: 'Bài 2: Đo góc MON (Đỉnh O; cạnh OM, ON)',
    source: 'SGK Toán 4 – Cánh Diều (Trang 38)',
    description: 'Dùng thước đo góc kiểm tra góc đỉnh O; cạnh OM, ON xem có phải là góc vuông không và số đo là bao nhiêu độ.',
    angleType: 'vuông',
    vertex: {
      label: 'O',
      x: 380,
      y: 350,
    },
    arm1: {
      label: 'N',
      angleDeg: 0, // Cạnh ON nằm ngang
      length: 260,
    },
    arm2: {
      label: 'M',
      angleDeg: -90, // Cạnh OM thẳng đứng lên trên
      length: 250,
    },
    correctAngle: 90,
    tolerance: 3,
    options: [60, 85, 90, 100],
    hint: 'Góc vuông có hai cạnh vuông góc với nhau và có số đo bằng 90°. Có thể dùng ê-ke hoặc thước đo góc để kiểm tra.',
    explanation: 'Góc đỉnh O; cạnh OM, ON có số đo bằng 90°. Đây chính là góc vuông.',
  },
  {
    id: 'ex-3-tu-120',
    title: 'Bài 3: Đo góc XEY (Đỉnh E; cạnh EX, EY)',
    source: 'SGK Toán 4 – Chân Trời Sáng Tạo (Trang 28)',
    description: 'Dùng thước đo góc để đo góc đỉnh E; cạnh EX, EY. Hãy đọc kỹ vòng số đo tương ứng từ vạch 0° của cạnh EY.',
    angleType: 'tù',
    vertex: {
      label: 'E',
      x: 480,
      y: 350,
    },
    arm1: {
      label: 'Y',
      angleDeg: 0, // Cạnh EY sang phải
      length: 250,
    },
    arm2: {
      label: 'X',
      angleDeg: -120, // Cạnh EX chếch sang trái trên
      length: 240,
    },
    correctAngle: 120,
    tolerance: 3,
    options: [60, 110, 120, 135],
    hint: 'Góc lớn hơn góc vuông và nhỏ hơn góc bẹt là góc tù. Vì cạnh EY nằm ở vạch 0° vòng trong, hãy đọc số đo theo vòng trong đến cạnh EX.',
    explanation: 'Góc đỉnh E; cạnh EX, EY có số đo bằng 120°. Vì 120° > 90° và < 180° nên đây là góc tù.',
  },
  {
    id: 'ex-4-bet-180',
    title: 'Bài 4: Đo góc MPN (Đỉnh P; cạnh PM, PN)',
    source: 'SGK Toán 4 – Kết nối tri thức (Trang 35)',
    description: 'Quan sát và đo góc tạo bởi hai tia đối nhau PM và PN cùng xuất phát từ gốc P.',
    angleType: 'bẹt',
    vertex: {
      label: 'P',
      x: 450,
      y: 340,
    },
    arm1: {
      label: 'N',
      angleDeg: 0, // Sang phải
      length: 260,
    },
    arm2: {
      label: 'M',
      angleDeg: -180, // Sang trái
      length: 260,
    },
    correctAngle: 180,
    tolerance: 3,
    options: [90, 120, 160, 180],
    hint: 'Góc bẹt bằng 2 góc vuông. Hai cạnh của góc bẹt tạo thành một đường thẳng.',
    explanation: 'Góc đỉnh P; cạnh PM, PN có số đo bằng 180°. Đây là góc bẹt (bằng 2 lần góc vuông: 90° x 2 = 180°).',
  },
  {
    id: 'ex-5-nghieng-45',
    title: 'Bài 5: Đo góc xoay nghiêng EDF (Đỉnh D; cạnh DE, DF)',
    source: 'SGK Toán 4 – Luyện tập nâng cao',
    description: 'Cạnh DF của góc bị nghiêng 25° so với phương ngang. Em cần xoay thước đo góc để vạch 0° trùng với cạnh DF rồi đọc số đo cạnh DE.',
    angleType: 'nhọn',
    vertex: {
      label: 'D',
      x: 390,
      y: 350,
    },
    arm1: {
      label: 'F',
      angleDeg: -25, // Cạnh DF nghiêng 25°
      length: 260,
    },
    arm2: {
      label: 'E',
      angleDeg: -70, // Cạnh DE nghiêng 70° (góc = 70 - 25 = 45°)
      length: 250,
    },
    correctAngle: 45,
    tolerance: 3,
    options: [35, 45, 55, 70],
    hint: 'Đặt tâm thước vào đỉnh D. Dùng vòng xoay hoặc nút xoay trên thước để xoay vạch 0° của thước nghiêng 25° trùng khớp với cạnh DF. Sau đó đọc số đo tại tia DE.',
    explanation: 'Số đo góc EDF là 45° (70° - 25° = 45°). Đây là một góc nhọn đẹp mắt.',
  },
  {
    id: 'ex-6-mai-nha-135',
    title: 'Bài 6: Đo góc mái nhà ngói truyền thống (Đỉnh S; cạnh SA, SB)',
    source: 'SGK Toán 4 – Ứng dụng thực tế cuộc sống',
    description: 'Mái nhà ngói có chóp đỉnh S tạo bởi hai mái dốc SA và SB. Hãy dùng thước đo góc để xác định độ mở góc của mái nhà.',
    angleType: 'tù',
    vertex: {
      label: 'S',
      x: 450,
      y: 220,
    },
    arm1: {
      label: 'B',
      angleDeg: 25, // dốc xuống phải
      length: 260,
    },
    arm2: {
      label: 'A',
      angleDeg: 155, // dốc xuống trái (góc = 155 - 25 = 130° hoặc 135°)
      length: 260,
    },
    correctAngle: 130,
    tolerance: 3,
    options: [90, 115, 130, 150],
    hint: 'Hãy lật ngược thước đo góc hoặc xoay thước sao cho tâm thước đặt vào chóp đỉnh S, vạch 0° trùng với đường dốc SB.',
    explanation: 'Góc mái nhà có độ mở là 130°. Mái dốc vừa phải giúp thoát nước mưa tốt và chống bão.',
  },
];
