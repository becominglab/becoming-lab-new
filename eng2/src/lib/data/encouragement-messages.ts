export interface EncouragementMessage {
  id: string
  tone: 'gentle' | 'bright' | 'push' | 'serious'
  message: string
  suggestion: string
}

export const encouragementMessages: EncouragementMessage[] = [
  // === やさしい ===
  { id: 'e1', tone: 'gentle', message: '今日もがんばってるね。ちょっとずつでいいんだよ。', suggestion: '苦手カードを3枚だけやってみよう' },
  { id: 'e2', tone: 'gentle', message: '昨日よりも一歩前に進んでるよ。すごいね。', suggestion: '今日の20問にチャレンジしてみよう' },
  { id: 'e3', tone: 'gentle', message: 'できなかった問題が減ってきてるよ。気づいてた？', suggestion: '間違えた語彙だけ復習しよう' },
  { id: 'e4', tone: 'gentle', message: '疲れた日は3分だけでいいよ。それだけで立派。', suggestion: '3分モードで始めよう' },
  { id: 'e5', tone: 'gentle', message: '焦らなくていいよ。自分のペースが一番だから。', suggestion: '得意なカードから復習しよう' },
  { id: 'e6', tone: 'gentle', message: 'いつも応援してるよ。今日もちょっとだけやってみよう。', suggestion: '苦手カードを見てみよう' },
  { id: 'e7', tone: 'gentle', message: '休んでも、また戻ってきたのがえらい。', suggestion: '3分だけやってみよう' },
  { id: 'e8', tone: 'gentle', message: 'ひとつずつクリアしていこう。大丈夫。', suggestion: '今日の語彙をやってみよう' },
  // === 明るい ===
  { id: 'e9', tone: 'bright', message: 'おはよう！今日も一緒にがんばろう！', suggestion: '今日の20問から始めよう！' },
  { id: 'e10', tone: 'bright', message: 'やった！連続学習が続いてるよ！いい調子！', suggestion: 'この勢いで苦手もやっちゃおう！' },
  { id: 'e11', tone: 'bright', message: 'ナイス！語彙力がどんどん上がってきてる！', suggestion: '今日も20問いってみよう！' },
  { id: 'e12', tone: 'bright', message: '今日の3分で明日の自分が変わるよ！レッツゴー！', suggestion: '3分モードでスタート！' },
  { id: 'e13', tone: 'bright', message: 'また来てくれたんだね！嬉しい！一緒にやろう！', suggestion: '好きなメニューからどうぞ！' },
  { id: 'e14', tone: 'bright', message: 'コツコツ続けてる人が最後に勝つんだよ！', suggestion: '今日のおすすめはカード復習！' },
  { id: 'e15', tone: 'bright', message: '昨日の自分を超えていこう！ファイト！', suggestion: '新しい語彙にチャレンジ！' },
  { id: 'e16', tone: 'bright', message: 'その調子！毎日ちょっとずつが最強の方法！', suggestion: '苦手な文法カードをチェック！' },
  // === 背中を押す ===
  { id: 'e17', tone: 'push', message: '合格まであと少し。今日サボったらもったいないよ。', suggestion: 'しっかりモードで取り組もう' },
  { id: 'e18', tone: 'push', message: '苦手を放置すると本番で泣くよ。今のうちに潰そう。', suggestion: '苦手カードを全部やろう' },
  { id: 'e19', tone: 'push', message: 'あと何日あるか数えてごらん。1日も無駄にできないよ。', suggestion: 'しっかりモードで始めよう' },
  { id: 'e20', tone: 'push', message: '昨日やらなかった分、今日は多めにやろう。', suggestion: '10分モードで頑張ろう' },
  { id: 'e21', tone: 'push', message: 'ライバルは今頃もう勉強してるかもよ？', suggestion: '今日の20問＋苦手復習をやろう' },
  { id: 'e22', tone: 'push', message: '本番の緊張感を想像してごらん。今の努力が支えになるよ。', suggestion: '過去問の復習をしよう' },
  { id: 'e23', tone: 'push', message: '「あの時やっておけば…」って後悔したくないよね？', suggestion: '苦手分野を集中攻略しよう' },
  { id: 'e24', tone: 'push', message: '3分だけ？ 本当にそれでいい？ もう少しやれるんじゃない？', suggestion: '10分モードに挑戦してみよう' },
  // === 本番モード ===
  { id: 'e25', tone: 'serious', message: '本番まで残りわずか。集中しよう。', suggestion: '過去問分析を確認しよう' },
  { id: 'e26', tone: 'serious', message: '時間配分を意識して練習しよう。本番は待ってくれない。', suggestion: '過去問ログを記録しよう' },
  { id: 'e27', tone: 'serious', message: '弱点の確認と対策。これが合格への最短距離。', suggestion: '苦手分析をチェックしよう' },
  { id: 'e28', tone: 'serious', message: '本番で後悔しないために、今日の演習を丁寧にやろう。', suggestion: 'しっかりモードで全科目やろう' },
  { id: 'e29', tone: 'serious', message: '合格ラインを意識して、得点可能な問題を確実に取ろう。', suggestion: '正答率の低い分野を復習しよう' },
  { id: 'e30', tone: 'serious', message: '準備がすべてを決める。今日も全力で。', suggestion: '語彙20問＋文法カード10枚やろう' },
  { id: 'e31', tone: 'serious', message: 'ここまで来たら、あとは自分を信じて積み上げるだけ。', suggestion: '苦手と得意をバランスよく復習しよう' },
  { id: 'e32', tone: 'serious', message: '合格する人は最後まで手を抜かない。今日もやり切ろう。', suggestion: '全メニューをこなそう' },
]
