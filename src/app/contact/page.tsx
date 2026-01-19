"use client";

import { useState } from "react";

const contactTypes = [
  { value: "seminar", label: "体験セミナー", emoji: "🎓" },
  { value: "coaching", label: "無料相談", emoji: "💬" },
  { value: "corporate", label: "企業研修", emoji: "🏢" },
  { value: "other", label: "その他", emoji: "📝" },
];

const sources = [
  { value: "", label: "選択してください" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "X（Twitter）" },
  { value: "youtube", label: "YouTube" },
  { value: "search", label: "検索エンジン" },
  { value: "referral", label: "知人の紹介" },
  { value: "triathlon", label: "トライアスロン関連" },
  { value: "other", label: "その他" },
];

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState("seminar");

  return (
    <section className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-accent mb-4">CONTACT</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-6">
            お問い合わせ
          </h1>
          <p className="text-gray-600">
            体験セミナー、無料相談、その他のお問い合わせは
            <br />
            下記フォームよりお気軽にご連絡ください。
          </p>
        </div>

        <form
          action="https://formspree.io/f/xlggbvej"
          method="POST"
          className="space-y-8"
        >
          {/* お問い合わせ種別 */}
          <div>
            <label className="block text-sm font-medium text-primary mb-3">
              お問い合わせ種別
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {contactTypes.map((type) => (
                <label key={type.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={selectedType === type.value}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-4 border border-gray-200 rounded-xl text-center peer-checked:border-accent peer-checked:bg-accent/5 hover:border-gray-300 transition-colors">
                    <span className="text-2xl block mb-1">{type.emoji}</span>
                    <span className="text-sm">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* お名前 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
              お名前 <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              placeholder="山田 太郎"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              メールアドレス <span className="text-accent">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              placeholder="example@email.com"
            />
          </div>

          {/* 電話番号（任意） */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
              電話番号（任意）
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              placeholder="090-1234-5678"
            />
          </div>

          {/* 知ったきっかけ */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-primary mb-2">
              Becoming Labを知ったきっかけ
            </label>
            <select
              id="source"
              name="source"
              className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors bg-white"
            >
              {sources.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
              お問い合わせ内容 <span className="text-accent">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors resize-none"
              placeholder="お問い合わせ内容をご記入ください"
            ></textarea>
          </div>

          {/* プライバシーポリシー同意 */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacy"
                required
                className="mt-1 w-5 h-5 border-gray-300 rounded text-accent focus:ring-accent"
              />
              <span className="text-sm text-gray-600">
                <a href="/privacy" className="text-accent underline">
                  プライバシーポリシー
                </a>
                に同意します
              </span>
            </label>
          </div>

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white py-5 rounded-xl font-medium text-lg hover:bg-secondary transition-colors"
            >
              送信する
            </button>
          </div>
        </form>

        {/* 補足情報 */}
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <h2 className="font-bold text-primary mb-4">お問い合わせにあたって</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              通常2〜3営業日以内にご返信いたします
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              体験セミナーの日程は、お申し込み後に調整いたします
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              無理な勧誘は一切いたしません
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              ご質問だけでもお気軽にどうぞ
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
