"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "magic">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("メールアドレスを入力してください。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        setMessage("認証サービスが設定されていません。管理者にお問い合わせください。");
        setLoading(false);
        return;
      }
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("パスワードリセットメールを送信しました。メールをご確認ください。");
      }
    } catch {
      setMessage("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { createClient } = await import("@supabase/supabase-js");

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setMessage("認証サービスが設定されていません。管理者にお問い合わせください。");
        setLoading(false);
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
          setMessage(error.message);
        } else {
          setMessage(
            "ログインリンクをメールで送信しました。メールのリンクをタップしてログインしてください。"
          );
        }
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          setMessage(
            "確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。"
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage(
            error.message === "Invalid login credentials"
              ? "メールアドレスまたはパスワードが正しくありません。"
              : error.message
          );
        } else {
          window.location.href = "/home";
        }
      }
    } catch {
      setMessage("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="pt-32 pb-8">
        <div className="max-w-md mx-auto px-8">
          <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">
            {mode === "magic" ? "MAGIC LINK" : mode === "login" ? "LOGIN" : "SIGN UP"}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "magic" ? "メールでログイン" : mode === "login" ? "ログイン" : "アカウント作成"}
          </h1>
          <p className="text-sm text-stone-500">
            {mode === "magic"
              ? "パスワード不要。メールに届くリンクをタップするだけでログインできます。"
              : mode === "login"
                ? "becoming lab にログインして、挑戦を記録しましょう。"
                : "becoming lab に参加して、挑戦の物語を始めましょう。"}
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-md mx-auto px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A] text-sm"
                placeholder="you@example.com"
              />
            </div>

            {mode !== "magic" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1B6B7A] focus:ring-1 focus:ring-[#1B6B7A] text-sm"
                  placeholder="6文字以上"
                />
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.includes("送信しました")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B6B7A] text-white rounded-lg hover:bg-[#155a67] transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading
                ? "処理中..."
                : mode === "magic"
                  ? "ログインリンクを送信"
                  : mode === "login"
                    ? "ログイン"
                    : "アカウントを作成"}
            </button>

            {mode === "login" && (
              <div className="flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors disabled:opacity-50"
                >
                  パスワードを忘れた方
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("magic"); setMessage(""); }}
                  className="text-xs text-[#1B6B7A] hover:opacity-70 transition-opacity font-medium"
                >
                  メールでログイン（Magic Link）
                </button>
              </div>
            )}

            {mode === "magic" && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setMessage(""); }}
                  className="text-xs text-stone-400 hover:text-[#1B6B7A] transition-colors"
                >
                  パスワードでログインに戻る
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-stone-200 text-center">
            {mode === "login" ? (
              <p className="text-sm text-stone-500">
                アカウントをお持ちでない方は{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}
                  className="text-[#1B6B7A] hover:opacity-70 transition-opacity font-medium"
                >
                  新規登録
                </button>
              </p>
            ) : (
              <p className="text-sm text-stone-500">
                既にアカウントをお持ちの方は{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                  className="text-[#1B6B7A] hover:opacity-70 transition-opacity font-medium"
                >
                  ログイン
                </button>
              </p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-stone-200">
            <Link
              href="/"
              className="text-sm text-[#1B6B7A] hover:opacity-70 transition-opacity"
            >
              ← トップに戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
