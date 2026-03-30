"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Send, ChevronUp, Loader2, Hash, X, Camera } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const DRAFT_KEY = "sns_post_draft";

interface DraftData {
  did: string;
  learned: string;
  tomorrow: string;
  tagInput: string;
}

interface Props {
  onPosted?: () => void;
  /** チェックインやチャレンジ連携時の初期プロンプト */
  initialPrompt?: string;
}

export default function PostComposer({ onPosted, initialPrompt }: Props) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const challengeTitle = searchParams.get("challenge");
  const challengeProgress = searchParams.get("progress");

  const defaultDid = challengeTitle
    ? `「${challengeTitle}」進捗${challengeProgress ? ` ${challengeProgress}%` : ""}`
    : "";

  const [expanded, setExpanded] = useState(!!(challengeTitle || initialPrompt));
  const [did, setDid] = useState(defaultDid);
  const [learned, setLearned] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 下書き復元（challengeTitle や initialPrompt がない場合のみ）
  useEffect(() => {
    if (challengeTitle || initialPrompt) return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft: DraftData = JSON.parse(saved);
        if (draft.did || draft.learned || draft.tomorrow || draft.tagInput) {
          setDid(draft.did || "");
          setLearned(draft.learned || "");
          setTomorrow(draft.tomorrow || "");
          setTagInput(draft.tagInput || "");
          setDraftRestored(true);
          setExpanded(true);
        }
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 下書き自動保存（500msデバウンス）
  useEffect(() => {
    if (!expanded || challengeTitle || initialPrompt) return;
    const timer = setTimeout(() => {
      try {
        const draft: DraftData = { did, learned, tomorrow, tagInput };
        if (did || learned || tomorrow || tagInput) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [did, learned, tomorrow, tagInput, expanded, challengeTitle, initialPrompt]);

  // initialPrompt が変わったら展開
  useEffect(() => {
    if (initialPrompt) setExpanded(true);
  }, [initialPrompt]);

  useEffect(() => {
    if (challengeTitle) setExpanded(true);
  }, [challengeTitle]);

  const parsedTags = tagInput
    .split(/[\s,　]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  const removeTag = (tag: string) => {
    const remaining = parsedTags.filter((t) => t !== tag);
    setTagInput(remaining.join(" "));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setImageFile(file);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/sns/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadedImageUrl(data.image_url);
      } else {
        showToast(data.error || "画像のアップロードに失敗しました", "error");
        setImagePreview(null);
        setImageFile(null);
      }
    } catch {
      showToast("画像のアップロードに失敗しました", "error");
      setImagePreview(null);
      setImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  const handleSubmit = async () => {
    if (!did.trim()) return;
    if (uploadingImage) {
      showToast("画像をアップロード中です。しばらくお待ちください", "info");
      return;
    }
    setPosting(true);

    try {
      const res = await fetch("/api/sns/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_type: "update",
          content: {
            did: did.trim(),
            learned: learned.trim() || null,
            tomorrow: tomorrow.trim() || null,
          },
          tags: parsedTags,
          image_url: uploadedImageUrl || null,
        }),
      });

      if (res.ok) {
        setDid("");
        setLearned("");
        setTomorrow("");
        setTagInput("");
        removeImage();
        setExpanded(false);
        setDraftRestored(false);
        clearDraft();
        showToast("投稿しました！", "success");
        onPosted?.();
      } else {
        const data = await res.json();
        showToast(data.error || "投稿に失敗しました", "error");
      }
    } catch {
      showToast("投稿に失敗しました。通信環境を確認してください", "error");
    } finally {
      setPosting(false);
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full p-4 bg-white rounded-xl border border-stone-200 text-left text-sm text-stone-400 hover:border-teal-200 hover:text-stone-500 transition-colors flex items-center gap-2"
      >
        <span className="text-lg">✏️</span>
        今日の更新を記録する...
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-teal-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-stone-800">きょうの更新</h3>
          {draftRestored && (
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-200">
              下書き復元
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
        >
          <ChevronUp size={18} />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          やったこと <span className="text-red-400">*</span>
        </label>
        <textarea
          value={did}
          onChange={(e) => setDid(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder={initialPrompt || "今日取り組んだことを書く"}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          autoFocus={!!challengeTitle}
        />
        <p className="text-xs text-stone-400 text-right">{did.length}/140</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          気づいたこと
        </label>
        <textarea
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder="気づきや学びがあれば"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-teal-700 mb-1">
          明日やること
        </label>
        <textarea
          value={tomorrow}
          onChange={(e) => setTomorrow(e.target.value)}
          maxLength={140}
          rows={2}
          placeholder="明日の一歩を宣言"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* 画像添付 */}
      <div>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={imagePreview}
              alt="添付画像"
              width={600}
              height={300}
              className="w-full h-48 object-cover rounded-xl"
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-600 px-2 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <Camera size={14} />
            写真を添付する
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* タグ入力 */}
      <div>
        <label className="text-xs font-medium text-stone-500 mb-1 flex items-center gap-1">
          <Hash size={11} />
          タグ（スペース区切り、最大5個）
        </label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="運動 英語 読書"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {parsedTags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-200">
                #{tag}
                <button onClick={() => removeTag(tag)} className="text-teal-400 hover:text-teal-700">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!did.trim() || posting || uploadingImage}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        {uploadingImage ? "画像をアップロード中..." : "投稿する"}
      </button>

      {/* 下書き破棄ボタン（下書き復元時のみ） */}
      {draftRestored && (
        <button
          onClick={() => {
            setDid("");
            setLearned("");
            setTomorrow("");
            setTagInput("");
            setDraftRestored(false);
            clearDraft();
          }}
          className="w-full text-xs text-stone-400 hover:text-red-400 transition-colors py-1"
        >
          下書きを破棄する
        </button>
      )}
    </div>
  );
}
