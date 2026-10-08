import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CircularRiskScoreProps {
  score: number;
  riskLevel?: string;
  size?: number;
}

export const CircularRiskScore: React.FC<CircularRiskScoreProps> = ({
  score,
  riskLevel,
  size = 140,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s <= 30) {
      return {
        gradientId: 'grad-emerald',
        start: '#10b981',
        end: '#06b6d4',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        glow: 'shadow-glow-emerald',
        icon: ShieldCheck,
      };
    }
    if (s <= 60) {
      return {
        gradientId: 'grad-amber',
        start: '#f59e0b',
        end: '#eab308',
        text: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        glow: 'shadow-glow-amber',
        icon: AlertTriangle,
      };
    }
    if (s <= 80) {
      return {
        gradientId: 'grad-orange',
        start: '#f97316',
        end: '#fb923c',
        text: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        glow: 'shadow-glow-amber',
        icon: AlertTriangle,
      };
    }
    return {
      gradientId: 'grad-rose',
      start: '#f43f5e',
      end: '#e11d48',
      text: 'text-rose-400',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      glow: 'shadow-glow-rose',
      icon: ShieldAlert,
    };
  };

  const colorInfo = getColor(score);
  const derivedLevel =
    riskLevel ||
    (score <= 30 ? 'Low Risk' : score <= 60 ? 'Medium Risk' : score <= 80 ? 'High Risk' : 'Critical Risk');
  const Icon = colorInfo.icon;

  return (
    <div className="flex flex-col items-center justify-center p-4 relative group">
      {/* Background radial glow */}
      <div
        className={`absolute w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none ${colorInfo.bg}`}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={colorInfo.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorInfo.start} />
              <stop offset="100%" stopColor={colorInfo.end} />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${colorInfo.gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${colorInfo.start}88)`,
            }}
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold font-mono tracking-tighter ${colorInfo.text}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-semibold">
            / 100
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div
        className={`mt-3 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border} ${colorInfo.glow}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{derivedLevel}</span>
      </div>
    </div>
  );
};
