import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "Becoming Labのプライバシーポリシー。個人情報の取り扱いについて。",
};

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-accent mb-4">PRIVACY POLICY</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary">
            プライバシーポリシー
          </h1>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-8">
            Becoming Lab（以下「当社」）は、お客様の個人情報の保護に努めております。
            本プライバシーポリシーでは、当社が収集する個人情報の種類、利用目的、管理方法等について説明いたします。
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">1. 収集する個人情報</h2>
            <p className="text-gray-600 mb-4">
              当社は、以下の個人情報を収集することがあります。
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>お問い合わせ内容</li>
              <li>その他、サービス提供に必要な情報</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">2. 個人情報の利用目的</h2>
            <p className="text-gray-600 mb-4">
              当社は、収集した個人情報を以下の目的で利用いたします。
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>サービスの提供・運営</li>
              <li>お問い合わせへの対応</li>
              <li>イベント・セミナーのご案内</li>
              <li>新サービス・キャンペーンのご案内</li>
              <li>サービス改善のための分析</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">3. 個人情報の第三者提供</h2>
            <p className="text-gray-600">
              当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>お客様の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために必要な場合</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">4. 個人情報の管理</h2>
            <p className="text-gray-600">
              当社は、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス、紛失、破損、改ざん、漏洩などを防止するため、
              セキュリティシステムの維持・管理体制の整備など、必要な措置を講じ、安全対策を実施いたします。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">5. Cookie（クッキー）の使用</h2>
            <p className="text-gray-600">
              当社のウェブサイトでは、お客様の利便性向上のためCookieを使用しています。
              Cookieはお客様のブラウザに保存される小さなテキストファイルで、
              ウェブサイトの利用状況を分析するために使用されます。
              お客様はブラウザの設定によりCookieを拒否することができますが、
              その場合、一部のサービスがご利用いただけない場合があります。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">6. 個人情報の開示・訂正・削除</h2>
            <p className="text-gray-600">
              お客様がご自身の個人情報の開示・訂正・削除を希望される場合は、
              下記のお問い合わせ先までご連絡ください。本人確認を行った上で、
              適切に対応いたします。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">7. プライバシーポリシーの変更</h2>
            <p className="text-gray-600">
              当社は、必要に応じて本プライバシーポリシーを変更することがあります。
              変更後のプライバシーポリシーは、当ウェブサイトに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">8. お問い合わせ先</h2>
            <p className="text-gray-600 mb-4">
              個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
            </p>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 font-medium">Becoming Lab</p>
              <p className="text-gray-600">メール: contact@becominglab.jp</p>
            </div>
          </section>

          <p className="text-sm text-gray-500 text-right">
            制定日：2026年1月1日
            <br />
            最終更新日：2026年1月1日
          </p>
        </div>
      </div>
    </section>
  );
}
