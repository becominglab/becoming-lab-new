"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xlggbvej", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("送信に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">送信しました</h1>
          <p className="text-gray-600">ご連絡ありがとうございます。近日中にお返事いたします。</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ヘッダー */}
      <section className="pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-8">
          <p className="text-xs tracking-widest text-gray-400 mb-4">CONTACT</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Contact</h1>
          <p className="text-gray-500">申し込みではありません。対話の入口です。</p>
        </div>
      </section>

      {/* フォーム */}
      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* お名前 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                お名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-[#1B6B7A]"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-[#1B6B7A]"
              />
            </div>

            {/* 興味のあること */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">興味のあること</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="checkbox" name="interest" value="語り部の会" className="w-4 h-4" />
                  語り部の会
                </label>
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="checkbox" name="interest" value="コーチング" className="w-4 h-4" />
                  コーチング
                </label>
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="checkbox" name="interest" value="神夫養成講座" className="w-4 h-4" />
                  神夫養成講座
                </label>
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="checkbox" name="interest" value="コミュニティ" className="w-4 h-4" />
                  コミュニティ
                </label>
                <label className="flex items-center gap-3 text-gray-600">
                  <input type="checkbox" name="interest" value="その他" className="w-4 h-4" />
                  その他
                </label>
              </div>
            </div>

            {/* メッセージ */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                メッセージ
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-[#1B6B7A]"
              ></textarea>
            </div>

            {/* 送信ボタン */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1B6B7A] text-white px-8 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "送信中..." : "送信する"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
