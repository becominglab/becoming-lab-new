"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Save, Loader2, Camera } from "lucide-react";

const CHALLENGE_TAG_OPTIONS = [
  "ダイエット", "筋トレ", "ランニング", "読書", "瞑想",
  "早起き", "英語", "副業", "禁酒", "禁煙", "食事改善", "ストレッチ",
];

const PHASE_OPTIONS = [
  { value: "exploring", label: "模索中", desc: "何を始めるか考えている" },
  { value: "starting", label: "始めたて", desc: "〜7日目" },
  { value: "building", label: "軌道に乗ってきた", desc: "8〜30日目" },
  { value: "maintaining", label: "定着期", desc: "31日以上継続" },
];

const SEEKING_OPTIONS = [
  { value: "accountability", label: "仲間がほしい" },
  { value: "inspiration", label: "刺激がほしい" },
  { value: "advice", label: "先輩に聞きたい" },
  { value: "companionship", label: "一緒に頑張りたい" },
];

interface Profile {
  nickname: string;
  bio: string;
  challenge_tags: string[];
  update_phase: string;
  seeking: string | null;
  is_public: boolean;
  avatar_url?: string | null;
}

interface Props {
  initialProfile?: Profile | null;
  onSaved?: () => void;
}

export default function ProfileSetupForm({ initialProfile, onSaved }: Props) {
  const [nickname, setNickname] = useState(initialProfile?.nickname || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [tags, setTags] = useState<string[]>(initialProfile?.challenge_tags || []);
  const [phase, setPhase] = useState(initialProfile?.update_phase || "exploring");
  const [seeking, setSeeking] = useState(initialProfile?.seeking || "");
  const [isPublic, setIsPublic] = useState(initialProfile?.is_public !== false);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || "");
  const [avatarPreview, setAvatarPreview] = useState(initialProfile?.avatar_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // アップロード
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/sns/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setAvatarUrl(data.avatar_url);
      } else {
        setError(data.error || "画像のアップロードに失敗しました");
        setAvatarPreview(initialProfile?.avatar_url || "");
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("ニックネームを入力してください");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/sns/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          bio: bio.trim(),
          challenge_tags: tags,
          update_phase: phase,
          seeking: seeking || null,
          is_public: isPublic,
          avatar_url: avatarUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
        return;
      }

      onSaved?.();
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const initial = nickname?.[0] || "?";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* アバター */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            {avatarPreview ? (
              <Image src={avatarPreview} alt="アバター" fill className="object-cover" />
            ) : (
              <span className="text-2xl font-bold text-teal-700">{initial}</span>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                <Loader2 size={20} className="animate-spin text-white" />
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center shadow hover:bg-teal-700 transition-colors"
          >
            <Camera size={13} />
          </button>
        </div>
        <p className="text-xs text-stone-400">タップして写真を変更（5MB以内）</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      {/* ニックネーム */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          ニックネーム <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={30}
          placeholder="表示名を入力"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-stone-400 mt-1">{nickname.length}/30</p>
      </div>

      {/* 自己紹介 */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          ひとこと自己紹介
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={100}
          rows={2}
          placeholder="どんな挑戦をしていますか？"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <p className="text-xs text-stone-400 mt-1">{bio.length}/100</p>
      </div>

      {/* 挑戦タグ */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          挑戦タグ
        </label>
        <div className="flex flex-wrap gap-2">
          {CHALLENGE_TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                tags.includes(tag)
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 更新フェーズ */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          更新フェーズ
        </label>
        <div className="space-y-2">
          {PHASE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                phase === opt.value
                  ? "border-teal-500 bg-teal-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="phase"
                value={opt.value}
                checked={phase === opt.value}
                onChange={(e) => setPhase(e.target.value)}
                className="accent-teal-600"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">{opt.label}</p>
                <p className="text-xs text-stone-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 求めるつながり */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          求めるつながり（任意）
        </label>
        <div className="flex flex-wrap gap-2">
          {SEEKING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSeeking(seeking === opt.value ? "" : opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                seeking === opt.value
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 公開設定 */}
      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-stone-700">プロフィールを公開</p>
          <p className="text-xs text-stone-500">他のユーザーから見えるようになります</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isPublic ? "bg-teal-600" : "bg-stone-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isPublic ? "translate-x-5" : ""
            }`}
          />
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving || uploadingAvatar}
        className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {initialProfile ? "プロフィールを更新" : "プロフィールを作成"}
      </button>
    </form>
  );
}
