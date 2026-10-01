import React from 'react';
import { AngleExercise } from './types';

interface AngleExerciseViewProps {
  exercise: AngleExercise;
  showAnswer: boolean;
  tvMode?: boolean;
}

export const AngleExerciseView: React.FC<AngleExerciseViewProps> = ({
  exercise,
  showAnswer,
  tvMode = false,
}) => {
  const { vertex, arm1, arm2, correctAngle, angleType } = exercise;

  // Convert degrees to radians (cartesian with Y pointing down in SVG)
  const rad1 = (arm1.angleDeg * Math.PI) / 180;
  const rad2 = (arm2.angleDeg * Math.PI) / 180;

  const p1 = {
    x: vertex.x + arm1.length * Math.cos(rad1),
    y: vertex.y + arm1.length * Math.sin(rad1),
  };

  const p2 = {
    x: vertex.x + arm2.length * Math.cos(rad2),
    y: vertex.y + arm2.length * Math.sin(rad2),
  };

  // Label offsets
  const label1 = {
    x: vertex.x + (arm1.length + 30) * Math.cos(rad1),
    y: vertex.y + (arm1.length + 30) * Math.sin(rad1),
  };

  const label2 = {
    x: vertex.x + (arm2.length + 30) * Math.cos(rad2),
    y: vertex.y + (arm2.length + 30) * Math.sin(rad2),
  };

  // Arc path between arm1 and arm2 (radius ~ 65px)
  const arcR = 65;
  const arcP1 = {
    x: vertex.x + arcR * Math.cos(rad1),
    y: vertex.y + arcR * Math.sin(rad1),
  };
  const arcP2 = {
    x: vertex.x + arcR * Math.cos(rad2),
    y: vertex.y + arcR * Math.sin(rad2),
  };

  // Determine SVG arc sweep
  const arcSweep = correctAngle > 180 ? 1 : 0;
  const arcPath = `M ${arcP1.x} ${arcP1.y} A ${arcR} ${arcR} 0 0 0 ${arcP2.x} ${arcP2.y}`;

  // Mid angle for answer badge positioning
  const midAngleDeg = arm1.angleDeg - correctAngle / 2;
  const midRad = (midAngleDeg * Math.PI) / 180;
  const badgePos = {
    x: vertex.x + 95 * Math.cos(midRad),
    y: vertex.y + 95 * Math.sin(midRad),
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
      viewBox="0 0 920 580"
    >
      <defs>
        {/* Arrow marker for rays */}
        <marker
          id="rayArrowBlue"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1d4ed8" />
        </marker>

        <marker
          id="rayArrowGreen"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#047857" />
        </marker>

        <filter id="angleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f59e0b" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Grid dots background for classroom math notebook feel */}
      <pattern id="mathGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1.2" fill="#cbd5e1" opacity="0.6" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#mathGrid)" />

      {/* ANGLE RAYS (2 Cạnh của góc) */}
      {/* Ray 1 (e.g. BC) */}
      <line
        x1={vertex.x}
        y1={vertex.y}
        x2={p1.x}
        y2={p1.y}
        stroke="#1d4ed8"
        strokeWidth="4.5"
        strokeLinecap="round"
        markerEnd="url(#rayArrowBlue)"
      />

      {/* Ray 2 (e.g. BA) */}
      <line
        x1={vertex.x}
        y1={vertex.y}
        x2={p2.x}
        y2={p2.y}
        stroke="#047857"
        strokeWidth="4.5"
        strokeLinecap="round"
        markerEnd="url(#rayArrowGreen)"
      />

      {/* ANGLE ARC (Cung góc) */}
      {correctAngle === 90 ? (
        // Right angle square indicator for 90 degrees
        <g>
          <rect
            x={vertex.x}
            y={vertex.y - 28}
            width="28"
            height="28"
            fill="#fef08a"
            fillOpacity="0.4"
            stroke="#e11d48"
            strokeWidth="2.5"
          />
          <circle cx={vertex.x + 14} cy={vertex.y - 14} r="3" fill="#e11d48" />
        </g>
      ) : (
        <path
          d={arcPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          filter="url(#angleGlow)"
        />
      )}

      {/* VERTEX POINT (ĐỈNH GÓC) - HIGHLIGHTED TARGET */}
      <circle
        cx={vertex.x}
        cy={vertex.y}
        r="14"
        fill="#e11d48"
        stroke="#ffffff"
        strokeWidth="3.5"
        className="filter drop-shadow-md"
      />
      <circle cx={vertex.x} cy={vertex.y} r="4" fill="#ffffff" />

      {/* LABELS: Đỉnh và các cạnh */}
      {/* Vertex Label (e.g. 'B') */}
      <g>
        <circle cx={vertex.x - 22} cy={vertex.y + 24} r="16" fill="#0f172a" />
        <text
          x={vertex.x - 22}
          y={vertex.y + 29}
          textAnchor="middle"
          fill="#fde047"
          fontSize="17"
          fontWeight="900"
          fontFamily="Baloo 2, Nunito, sans-serif"
        >
          {vertex.label}
        </text>
      </g>

      {/* Arm 1 Label (e.g. 'C') */}
      <g>
        <circle cx={label1.x} cy={label1.y} r="16" fill="#1d4ed8" />
        <text
          x={label1.x}
          y={label1.y + 5}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="900"
          fontFamily="Baloo 2, Nunito, sans-serif"
        >
          {arm1.label}
        </text>
      </g>

      {/* Arm 2 Label (e.g. 'A') */}
      <g>
        <circle cx={label2.x} cy={label2.y} r="16" fill="#047857" />
        <text
          x={label2.x}
          y={label2.y + 5}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="16"
          fontWeight="900"
          fontFamily="Baloo 2, Nunito, sans-serif"
        >
          {arm2.label}
        </text>
      </g>

      {/* TEACHER "HIỆN ĐÁP ÁN" VISUAL OVERLAY */}
      {showAnswer && (
        <g className="animate-fade-in">
          {/* Answer Degree Bubble */}
          <rect
            x={badgePos.x - 55}
            y={badgePos.y - 22}
            width="110"
            height="44"
            rx="14"
            fill="#0f172a"
            stroke="#fbbf24"
            strokeWidth="3"
            filter="url(#angleGlow)"
          />
          <text
            x={badgePos.x}
            y={badgePos.y}
            textAnchor="middle"
            fill="#34d399"
            fontSize="18"
            fontWeight="900"
            fontFamily="Baloo 2, Nunito, sans-serif"
          >
            {correctAngle}°
          </text>
          <text
            x={badgePos.x}
            y={badgePos.y + 14}
            textAnchor="middle"
            fill="#fde047"
            fontSize="11"
            fontWeight="bold"
            fontFamily="Baloo 2, Nunito, sans-serif"
          >
            ({angleType.toUpperCase()})
          </text>
        </g>
      )}
    </svg>
  );
};
