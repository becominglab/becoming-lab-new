"use client";

export default function PhaseBar({
  phases,
  currentPhase,
}: {
  phases: string[];
  currentPhase: number;
}) {
  return (
    <div className="sn-phase-bar sn-glass-subtle">
      <div className="sn-phase-steps">
        {phases.map((_, i) => (
          <div
            key={i}
            className={`sn-phase-step ${
              i < currentPhase
                ? "completed"
                : i === currentPhase
                ? "active"
                : ""
            }`}
          />
        ))}
      </div>
      <div className="sn-phase-info">
        <span className="sn-phase-current">{phases[currentPhase]}</span>
        <span className="sn-phase-number">
          {currentPhase + 1} / {phases.length}
        </span>
      </div>
    </div>
  );
}
