// フェーズラベル統一定数 — 全コンポーネントでここをimportすること
export const PHASE_LABELS: Record<string, string> = {
  exploring: "模索中",
  starting: "始めたて",
  building: "軌道に乗ってきた",
  maintaining: "定着期",
};

export const PHASE_COLORS: Record<string, string> = {
  exploring: "bg-stone-100 text-stone-600",
  starting: "bg-blue-50 text-blue-600",
  building: "bg-teal-50 text-teal-700",
  maintaining: "bg-amber-50 text-amber-700",
};
