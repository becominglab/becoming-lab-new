# Asahi Eiken 2 Coach

英検2級合格を目指す学習アプリ。弱点分析・中学英語の基礎固め・語彙強化・継続支援をスマホファーストで提供します。

## 技術スタック

- **フロント**: Next.js 15 (App Router) + TypeScript
- **スタイル**: Tailwind CSS 4
- **チャート**: Recharts
- **認証/DB/Storage**: Supabase
- **デプロイ**: Vercel
- **公開URL**: `https://becominglab.life/eng2`

## ページ構成

| パス | 機能 |
|------|------|
| `/eng2/login` | ログイン / デモモード |
| `/eng2/dashboard` | ホーム（今日やること・エール・苦手トップ3） |
| `/eng2/exam-log` | 過去問ミス記録 |
| `/eng2/analysis` | 苦手分析（グラフ・ランキング） |
| `/eng2/grammar-cards` | 中学英語カード（短冊式） |
| `/eng2/vocab` | 英検2級語彙デイリー20問 |
| `/eng2/parent` | 親向けダッシュボード |
| `/eng2/settings` | プロフィール・推しエール設定 |

## 1. ローカル起動手順

```bash
cd eng2
npm install
cp .env.example .env.local
# .env.local に Supabase の値を設定
npm run dev
```

`http://localhost:3000/eng2` でアクセスできます。

> **デモモード**: Supabase 未設定でもダミーデータで全画面動作します。ログイン画面の「デモモードで体験する」をクリックしてください。

## 2. Supabase プロジェクト作成手順

1. [supabase.com](https://supabase.com) でアカウント作成
2. 新規プロジェクト作成（リージョンは `Northeast Asia (Tokyo)` 推奨）
3. Project Settings → API から以下をコピー:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
4. Authentication → Providers → Email を有効化（「Confirm email」はオフ推奨）

## 3. SQL マイグレーション適用手順

Supabase ダッシュボードの SQL Editor で実行:

```bash
# supabase/migrations/001_initial.sql の内容をコピー＆ペーストして実行
```

または Supabase CLI を使う場合:

```bash
npx supabase db push
```

## 4. Seed 投入手順

SQL Editor で `supabase/seed.sql` の内容を実行します。

```bash
# CLI の場合
npx supabase db seed
```

## 5. Storage バケット作成

Supabase ダッシュボード → Storage → New Bucket:
- バケット名: `encouragement-images`
- Public: ON

## 6. Vercel プロジェクト作成手順

1. [vercel.com](https://vercel.com) にログイン
2. 「Add New Project」→ GitHub リポジトリをインポート
3. **Root Directory** を `eng2` に設定
4. Environment Variables に以下を設定:

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase の Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase の service_role key |

5. 「Deploy」をクリック

## 7. カスタムドメイン設定手順

### Vercel 側

1. Project Settings → Domains
2. `becominglab.life` を追加
3. Vercel が指示する DNS レコードをメモ

### DNS 側（ドメインレジストラ）

| タイプ | ホスト | 値 |
|--------|--------|-----|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

> **注意**: 既存の becominglab アプリと共存する場合は、Vercel のリライトルールまたはモノレポ設定が必要です。

## 8. `/eng2` 配下公開のための basePath 説明

`next.config.ts` で `basePath: '/eng2'` を設定しています。

```ts
const nextConfig: NextConfig = {
  basePath: '/eng2',
}
```

これにより:
- 全ルートが `/eng2/` 配下にマッピングされる
- `next/link` の `href="/dashboard"` は自動的に `/eng2/dashboard` になる
- 静的アセット (`/eng2/_next/...`) も正しく配信される
- `next/image` も basePath を自動考慮する

**注意点**:
- `<a>` タグで直書きする場合は `/eng2/` を含める必要がある
- API Routes も `/eng2/api/...` になる

## 9. 本番環境変数一覧

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase 匿名キー |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase サービスロールキー |

## 10. 動作確認チェックリスト

- [ ] `npm run build` が通る
- [ ] `npm run lint` が通る
- [ ] ログイン画面が表示される
- [ ] デモモードでダッシュボードに遷移できる
- [ ] ダッシュボードに今日やること・エール・苦手が表示される
- [ ] 過去問記録の追加・一覧表示ができる
- [ ] 苦手分析のグラフが表示される
- [ ] 文法カードの表裏切り替え・自己評価ができる
- [ ] 語彙20問の4択回答・結果表示ができる
- [ ] 親ダッシュボードの各項目が表示される
- [ ] 設定画面で推しエールの設定ができる
- [ ] BottomNav で全ページ遷移できる
- [ ] `/eng2/` 配下で全アセット・リンクが正常
- [ ] スマホ表示で崩れない
- [ ] 学習完了時のお祝いモーダルが表示される

## 本番デプロイ前チェックリスト

1. [ ] Supabase migration 適用済み
2. [ ] Supabase seed 投入済み
3. [ ] Storage バケット作成済み
4. [ ] Auth の Email/Password 有効化済み
5. [ ] Vercel 環境変数設定済み
6. [ ] `npm run build` 成功
7. [ ] DNS レコード設定済み
8. [ ] `https://becominglab.life/eng2` でアクセス確認
9. [ ] 全ページの画面遷移確認
10. [ ] スマホでの表示確認
