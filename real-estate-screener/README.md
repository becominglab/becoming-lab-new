# Real Estate Screener — 東京23区 1棟不動産 投資判断システム

毎日、日本の主要な収益不動産掲載サイトを巡回し、東京23区の1棟不動産を取得。
独自のスコアリングロジック（**マスター投資家メソッド**）に基づき「買い推奨ベスト10」を自動生成するシステム。

## 特徴

- **マスター投資家スコア（100点満点）**: 利回り順ではなく、立地需要・収益性・融資適性・リスク耐性・価値創造余地・出口・独自ビジョンの7軸で総合評価
- **収支シミュレーション**: 表面/現況利回り、CF、CCR、積算評価、安全余力、感度分析を自動計算
- **名寄せ・重複排除**: 複数サイトの同一物件を自動統合
- **プラガブル構成**: サイトごとにコネクタを分離、DB切替・追加が容易
- **CLI完結**: SQLite + Markdown/JSON/CSV 出力

## セットアップ

```bash
# 依存インストール
npm install

# 環境変数
cp .env.example .env

# DB初期化
npx prisma db push

# ダミーデータで動作確認
npm run daily -- --dry-run
```

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run crawl` | 全サイト巡回して raw データ取得 |
| `npm run normalize` | 正規化・名寄せ |
| `npm run score` | 収支計算・スコアリング |
| `npm run rank` | ベスト10生成 |
| `npm run report` | Markdown/JSON/CSV 出力 |
| `npm run daily` | 上記を一括実行 |
| `npm run backfill` | 過去データ再評価 |
| `npm run test` | テスト実行 |

## ディレクトリ構成

```
/real-estate-screener
  /src
    /connectors       # サイト別コネクタ
      /rakumachi
      /athome
      /homes
    /core              # 中核ロジック
      canonical-schema.ts
      finance.ts
      valuation.ts
      scoring.ts
      dedupe.ts
      explain.ts
      ranking.ts
    /db                # Prisma クライアント
    /jobs              # バッチジョブ
    /utils             # ユーティリティ
    /config            # 設定
    /tests             # テスト
  /data
    /raw               # 取得生データ
    /normalized        # 正規化済み
    /reports           # 日次レポート出力
  /prisma              # Prisma schema
```

## スコアリング（マスター投資家メソッド）

| カテゴリ | 配点 |
|---|---|
| A. 立地・需要 | 25点 |
| B. 収益性 | 15点 |
| C. 融資・買い進め適性 | 15点 |
| D. リスク耐性 | 15点 |
| E. 再生・価値創造 | 15点 |
| F. 出口 | 10点 |
| G. ビジョン適合 | 5点 |
| **合計** | **100点** |

### 買い判定

- 85点以上: 強い買い候補
- 75〜84点: 買い候補
- 65〜74点: 要精査
- 50〜64点: 観察
- 49点以下: 見送り

## 技術スタック

- TypeScript / Node.js 20+
- SQLite + Prisma ORM
- Playwright / cheerio
- Vitest
- GitHub Actions (毎朝 7:00 JST 自動実行)

## ライセンス

Private
