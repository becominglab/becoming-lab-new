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
  /** 展開状態で最初から表示する (FABからの呼び出しなど) */
  defaultExpanded?: boolean;
  /** 折りたたみ状態のプレースホルダー文言 */
  collapsedPlaceholder?: string;
}

export default function PostComposer({
  onPosted,
  initialPrompt,
  defaultExpanded,
  collapsedPlaceholder = "今日の更新・宣言・達成を記録する...",
}: Props) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const challengeTitle = searchParams.get("challenge");
  const challengeProgress = searchParams.get("progress");

  const defaultDid = challengeTitle
    ? `「${challengeTitle}」進捗${challengeProgress ? ` ${challengeProgress}%` : ""}`
    : "";

  const [expanded, setExpanded] = useState(!!(challengeTitle || initialPrompt || defaultExpanded));
  const [did, setDid] = useState(defaultDid);
  const [learned, setLearned] = useState("");
  const [tomorrow, setTomorrow] = useState("");
  const [postType, setPostType] = useState<"update" | "declaration" | "milestone">("update");
  const [declarationText, setDeclarationText] = useState("");
  const [milestoneLabel, setMilestoneLabel] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [tagFocused, setTagFocused] = useState(false);
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

  useEffect(() => {
    fetch("/api/sns/trending-tags")
      .then((r) => r.json())
      .then((d) => {
        const tags = (d.tags || []).map((t: { tag: string }) => t.tag);
        setTagSuggestions(tags.length > 0 ? tags.slice(0, 8) : ["運動", "英語", "読書", "ダイエット", "早起き", "瞑想"]);
      })
      .catch(() => setTagSuggestions(["運動", "英語", "読書", "ダイエット", "早起き", "瞑想"]));
  }, []);

  const parsedTags = tagInput
    .split(/[\s,　]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  const addTagSuggestion = (tag: string) => {
    if (parsedTags.includes(tag) || parsedTags.length >= 5) return;
    setTagInput((prev) => {
      const existing = prev.trim();
      return existing ? `${existing} ${tag}` : tag;
    });
  };

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
    if (postType === "update" && !did.trim()) return;
    if (postType === "declaration" && !declarationText.trim()) return;
    if (postType === "milestone" && !milestoneLabel.trim()) return;
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
          post_type: postType,
          content: postType === "update"
            ? { did: did.trim(), learned: learned.trim() || null, tomorrow: tomorrow.trim() || null }
            : postType === "declaration"
            ? { content: declarationText.trim() }
            : { label: milestoneLabel.trim() },
          tags: parsedTags,
          image_url: uploadedImageUrl || null,
        }),
      });

      if (res.ok) {
        setDid("");
        setLearned("");
        setTomorrow("");
        setDeclarationText("");
        setMilestoneLabel("");
        setPostType("update");
        setTagInput("");
        removeImage();
        setExpanded(false);
        setDraftRestored(false);
        clearDraft();
        showToast("投稿しました！", "success");
        // フィードに再取得を通知
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("sns:post-created"));
        }
        onPosted?.();
        // バッジ獲得チェック（非同期・非ブロッキング）
        fetch("/api/sns/badges/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories: ["social", "story"] }),
        })
          .then((r) => r.json())
          .then((d) => {
            const earned: Array<{ name: string; icon: string }> = d.newly_earned || [];
            earned.slice(0, 2).forEach((badge, i) => {
              setTimeout(() => {
                showToast(`🏅 バッジ獲得！「${badge.icon}${badge.name}」`, "success");
              }, i * 1500);
            });
          })
          .catch(() => {});
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
        className="w-full p-4 bg-white rounded-xl border border-stone-200 text-left text-sm text-stone-400 hover:border-teal-300 hover:bg-stone-50 hover:text-stone-500 transition-all flex items-center gap-3 group"
      >
        <span className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-base flex-shrink-0 group-hover:bg-teal-100 transition-colors">
          ✏️
        </span>
        <span className="flex-1">{collapsedPlaceholder}</span>
        <span className="text-xs text-stone-300 group-hover:text-teal-400 transition-colors">タップして記録</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-teal-200 p-4 space-y-3">
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

      {/* 投稿タイプ選択 */}
      <div className="flex gap-1.5">
        {([
          { type: "update", label: "更新", emoji: "📝" },
          { type: "declaration", label: "宣言", emoji: "💪" },
          { type: "milestone", label: "達成", emoji: "🏆" },
        ] as const).map(({ type, label, emoji }) => (
          <button
            key={type}
            type="button"
            onClick={() => setPostType(type)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              postType === type
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* タイプ別フォーム */}
      {postType === "update" && (
        <>
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
            <p className={`text-xs text-right ${did.length > 120 ? "text-orange-500" : "text-stone-400"}`}>{did.length}/140</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-teal-700 mb-1">気づき（任意）</label>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              maxLength={140}
              rows={2}
              placeholder="気づいたこと、学んだこと"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {learned.length > 0 && (
              <p className={`text-xs text-right mt-0.5 ${learned.length > 120 ? "text-orange-500" : "text-stone-400"}`}>{learned.length}/140</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">明日やること（任意）</label>
            <textarea
              value={tomorrow}
              onChange={(e) => setTomorrow(e.target.value)}
              maxLength={140}
              rows={1}
              placeholder="次のアクション"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {tomorrow.length > 0 && (
              <p className={`text-xs text-right mt-0.5 ${tomorrow.length > 120 ? "text-orange-500" : "text-stone-400"}`}>{tomorrow.length}/140</p>
            )}
          </div>
        </>
      )}

      {postType === "declaration" && (
        <div>
          <label className="block text-xs font-medium text-blue-600 mb-1">
            宣言する内容 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={declarationText}
            onChange={(e) => setDeclarationText(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder="例: 今月中に英語の勉強を毎日30分続けます！"
            className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <p className={`text-xs text-right mt-0.5 ${declarationText.length > 120 ? "text-orange-500" : "text-stone-400"}`}>{declarationText.length}/140</p>
          <p className="text-xs text-blue-400 mt-1">💡 宣言は仲間に見える公開投稿になります</p>
        </div>
      )}

      {postType === "milestone" && (
        <div>
          <label className="block text-xs font-medium text-amber-600 mb-1">
            達成したこと <span className="text-red-400">*</span>
          </label>
          <input
            value={milestoneLabel}
            onChange={(e) => setMilestoneLabel(e.target.value)}
            maxLength={60}
            placeholder="例: 30日間連続ランニング達成！"
            className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoFocus
          />
          <p className={`text-xs text-right mt-0.5 ${milestoneLabel.length > 50 ? "text-orange-500" : "text-stone-400"}`}>{milestoneLabel.length}/60</p>
          <p className="text-xs text-amber-500 mt-1">🏆 マイルストーンは特別な達成として記録されます</p>
        </div>
      )}

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
          onFocus={() => setTagFocused(true)}
          onBlur={() => setTimeout(() => setTagFocused(false), 150)}
          placeholder="運動 英語 読書"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {/* タグサジェスト */}
        {tagFocused && tagSuggestions.length > 0 && parsedTags.length < 5 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tagSuggestions
              .filter((t) => !parsedTags.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); addTagSuggestion(tag); }}
                  className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  +#{tag}
                </button>
              ))}
          </div>
        )}
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
        disabled={
          posting || uploadingImage ||
          (postType === "update" && !did.trim()) ||
          (postType === "declaration" && !declarationText.trim()) ||
          (postType === "milestone" && !milestoneLabel.trim())
        }
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
