'use client';

import { useEffect, useState } from 'react';

const steps = [
  {
    label: '会う',
    en: 'MEET',
    body: '挑戦の途中にいる人に会う。新しい仲間に会う。知らなかった価値観に会う。そして、まだ知らなかった自分自身に会う。',
  },
  {
    label: '整う',
    en: 'ALIGN',
    body: '誰かの正解ではなく、自分にとっての幸せを考える。忙しさの中で少しずつ見えなくなっていた、大切なものをもう一度確かめる。',
  },
  {
    label: '更新する',
    en: 'UPDATE',
    body: '考えて終わりにせず、自分で選んだ方向へ小さく一歩。そして、更新した自分で、また次の人に会う。',
  },
];

const R = 76;
const CX = 115;
const CY = 115;
const CIRC = 2 * Math.PI * R;
const SEG = CIRC / steps.length;

const pos = (i: number, radius = R) => {
  const a = (-90 + (360 / steps.length) * i) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
};

export default function Cycle() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [paused]);

  const s = steps[active];

  return (
    <div
      className="bc-cycle"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="bc-cycle-ring">
        <svg viewBox="0 0 230 230" aria-hidden="true">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--bc-mist)" strokeWidth="1" />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="var(--bc-teal)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${SEG * 0.86} ${CIRC}`}
            strokeDashoffset={-SEG * active}
            className="bc-cycle-arc"
            transform={`rotate(-90 ${CX} ${CY})`}
          />
          {steps.map((step, i) => {
            const p = pos(i);
            const lp = pos(i, R + 26);
            return (
              <g key={step.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === active ? 7 : 4}
                  fill={i === active ? 'var(--bc-teal)' : 'var(--bc-mist)'}
                  className="bc-cycle-dot"
                />
                <text
                  x={lp.x}
                  y={lp.y + 4}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight={i === active ? 600 : 400}
                  fill={i === active ? 'var(--bc-teal)' : '#9CB2BB'}
                  className="bc-cycle-label"
                >
                  {step.label}
                </text>
              </g>
            );
          })}
        </svg>

        {steps.map((step, i) => {
          const p = pos(i);
          return (
            <button
              key={step.label}
              type="button"
              className="bc-cycle-hit"
              style={{ left: `${(p.x / 230) * 100}%`, top: `${(p.y / 230) * 100}%` }}
              onClick={() => setActive(i)}
              aria-label={step.label}
              aria-current={i === active}
            />
          );
        })}
      </div>

      <div className="bc-cycle-body" aria-live="polite">
        <p className="bc-cycle-index">
          {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </p>
        <p key={`${s.label}-t`} className="bc-cycle-title">
          {s.label}
        </p>
        <p key={`${s.label}-e`} className="bc-cycle-en">
          {s.en}
        </p>
        <p key={`${s.label}-b`} className="bc-cycle-text">
          {s.body}
        </p>
      </div>
    </div>
  );
}
