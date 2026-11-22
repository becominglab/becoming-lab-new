// 読みもの（サイト原本）。note に書いた記事の全文を、サイト側に保存したものです。
// 本文は content/posts/*.json に1記事1ファイル。記事を足すときは JSON を1つ追加して ALL に並べます。
// ここに無い記事（note に新しく書いたもの）は、これまでどおり note から読み込んで表示します。
import n0793e8882ae6 from "./posts/n0793e8882ae6.json";
import n0fdd9dd0b463 from "./posts/n0fdd9dd0b463.json";
import n1571dd809b94 from "./posts/n1571dd809b94.json";
import n2de3d0e6a249 from "./posts/n2de3d0e6a249.json";
import n3171c15e34aa from "./posts/n3171c15e34aa.json";
import n518896855552 from "./posts/n518896855552.json";
import n70f6eb7ecc79 from "./posts/n70f6eb7ecc79.json";
import n844e5e4283fd from "./posts/n844e5e4283fd.json";
import ncdfe7fd34734 from "./posts/ncdfe7fd34734.json";
import ncefcebd992a2 from "./posts/ncefcebd992a2.json";
import nda0632c5f6b9 from "./posts/nda0632c5f6b9.json";
import nf8c3104ab635 from "./posts/nf8c3104ab635.json";
import nf9c361eed92b from "./posts/nf9c361eed92b.json";
import nfc680ed998b2 from "./posts/nfc680ed998b2.json";

export type Post = {
  key: string;
  title: string;
  excerpt: string;
  eyecatch: string | null;
  publishedAt: string | null;
  noteUrl: string;
  tags: string[];
  bodyHtml: string;
};

const ALL = [n0793e8882ae6, n0fdd9dd0b463, n1571dd809b94, n2de3d0e6a249, n3171c15e34aa, n518896855552, n70f6eb7ecc79, n844e5e4283fd, ncdfe7fd34734, ncefcebd992a2, nda0632c5f6b9, nf8c3104ab635, nf9c361eed92b, nfc680ed998b2] as unknown as Post[];

/** 新しい順 */
export const posts: Post[] = [...ALL].sort((a, b) =>
  (a.publishedAt ?? "") < (b.publishedAt ?? "") ? 1 : -1
);

export const findPost = (key: string) => posts.find((p) => p.key === key) ?? null;

/** 読みもの → 関連する手引き（/guide/[slug]）。記事の末尾に案内を出す */
export const relatedGuideSlug: Record<string, string> = {
  n844e5e4283fd: "hitori-sanka-community-tokyo",
  n1571dd809b94: "hitori-sanka-community-tokyo",
  n518896855552: "hansei-tanaoroshi",
  nf8c3104ab635: "jinsei-wo-kataru",
  ncefcebd992a2: "90kg-kara-hashiru",
  n3171c15e34aa: "90kg-kara-hashiru",
  n0793e8882ae6: "erabinaosu-40-50",
  nda0632c5f6b9: "erabinaosu-40-50",
  ncdfe7fd34734: "jinsei-wo-kataru",
  n0fdd9dd0b463: "hitori-sanka-community-tokyo",
  n2de3d0e6a249: "triathlon-50dai-hajimekata",
  nf9c361eed92b: "90kg-kara-hashiru",
  n70f6eb7ecc79: "erabinaosu-40-50",
  nfc680ed998b2: "jinsei-wo-kataru",
};
