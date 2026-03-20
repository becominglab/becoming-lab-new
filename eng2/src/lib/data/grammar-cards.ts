import { GrammarCard } from '../types'

export const grammarCards: GrammarCard[] = [
  // === 時制 (Tenses) ===
  { id: 'g1', category: '時制', front_text: '「私は毎日英語を勉強します」を英語にすると？', back_text: 'I study English every day.', explanation: '習慣的な動作は現在形を使います。every day, usually, alwaysなどが目印。', difficulty: 'easy', related_points: ['現在形', '頻度副詞'] },
  { id: 'g2', category: '時制', front_text: 'I ___ (play) tennis when it started to rain.', back_text: 'was playing', explanation: '過去のある時点で進行中だった動作は過去進行形(was/were + ~ing)を使います。', difficulty: 'medium', related_points: ['過去進行形', '時制の一致'] },
  { id: 'g3', category: '時制', front_text: 'She ___ already ___ (finish) her homework.', back_text: 'has already finished', explanation: '「もう〜した」は現在完了形(have/has + 過去分詞)。alreadyはhaveとp.p.の間に入ります。', difficulty: 'medium', related_points: ['現在完了', '完了用法'] },
  { id: 'g4', category: '時制', front_text: 'I ___ (know) him since 2020.', back_text: 'have known', explanation: 'sinceは「〜以来ずっと」で現在完了の継続用法と使います。', difficulty: 'medium', related_points: ['現在完了', '継続用法'] },
  { id: 'g5', category: '時制', front_text: 'If it ___ (rain) tomorrow, I will stay home.', back_text: 'rains', explanation: '時・条件の副詞節では未来のことでも現在形を使います。if節の中はwillを使いません。', difficulty: 'hard', related_points: ['条件節', '時制の一致'] },
  { id: 'g6', category: '時制', front_text: '「彼が来るまで待ちます」I will wait ___ he comes.', back_text: 'until / till', explanation: 'until/till「〜まで」。時の副詞節なのでhe comesと現在形にします。', difficulty: 'medium', related_points: ['接続詞', '時制'] },
  // === 受動態 ===
  { id: 'g7', category: '受動態', front_text: 'This book ___ (write) by a famous author.', back_text: 'was written', explanation: '受動態はbe動詞 + 過去分詞。write-wrote-writtenの変化に注意。', difficulty: 'easy', related_points: ['受動態', '不規則変化'] },
  { id: 'g8', category: '受動態', front_text: 'English ___ (speak) in many countries.', back_text: 'is spoken', explanation: '一般的事実の受動態は現在形のbe動詞を使います。speak-spoke-spoken。', difficulty: 'easy', related_points: ['受動態', '現在形'] },
  { id: 'g9', category: '受動態', front_text: 'The window ___ (break) by the boys yesterday.', back_text: 'was broken', explanation: '過去の受動態はwas/were + 過去分詞。break-broke-broken。', difficulty: 'easy', related_points: ['受動態', '過去形'] },
  // === 不定詞・動名詞 ===
  { id: 'g10', category: '不定詞・動名詞', front_text: 'I enjoy ___ (read) books.', back_text: 'reading', explanation: 'enjoyは動名詞(~ing)を目的語にとる動詞。to不定詞は使えません。', difficulty: 'medium', related_points: ['動名詞', 'enjoy/finish/stop'] },
  { id: 'g11', category: '不定詞・動名詞', front_text: 'I decided ___ (go) abroad.', back_text: 'to go', explanation: 'decideはto不定詞を目的語にとる動詞。want, hope, planなども同様。', difficulty: 'medium', related_points: ['不定詞', 'decide/want/hope'] },
  { id: 'g12', category: '不定詞・動名詞', front_text: 'It is important ___ (study) hard.', back_text: 'to study', explanation: 'It is + 形容詞 + to不定詞：「〜するのは…だ」の形式主語構文。', difficulty: 'easy', related_points: ['形式主語', 'It is ~ to'] },
  { id: 'g13', category: '不定詞・動名詞', front_text: 'I don\'t know what ___ (do).', back_text: 'to do', explanation: '疑問詞 + to不定詞：「何を〜すべきか」。how to, where to, when toなども同様。', difficulty: 'medium', related_points: ['疑問詞+to不定詞'] },
  { id: 'g14', category: '不定詞・動名詞', front_text: 'Would you mind ___ (open) the window?', back_text: 'opening', explanation: 'mindは動名詞を目的語にとります。Would you mind ~ing?「〜していただけますか」', difficulty: 'medium', related_points: ['動名詞', '丁寧な依頼'] },
  // === 関係代名詞 ===
  { id: 'g15', category: '関係代名詞', front_text: 'The boy ___ is standing there is my brother. (人)', back_text: 'who / that', explanation: '先行詞が人の場合、関係代名詞はwho/thatを使います。主格の関係代名詞。', difficulty: 'medium', related_points: ['who', '主格'] },
  { id: 'g16', category: '関係代名詞', front_text: 'The book ___ I read yesterday was interesting. (物)', back_text: 'which / that', explanation: '先行詞が物の場合はwhich/that。目的格なので省略も可能。', difficulty: 'medium', related_points: ['which', '目的格'] },
  { id: 'g17', category: '関係代名詞', front_text: 'I have a friend ___ father is a doctor.', back_text: 'whose', explanation: 'whoseは所有格の関係代名詞。「〜の」の意味で人にも物にも使えます。', difficulty: 'hard', related_points: ['whose', '所有格'] },
  // === 比較 ===
  { id: 'g18', category: '比較', front_text: 'This bag is ___ (heavy) than that one.', back_text: 'heavier', explanation: '2つを比べる時はthan + 比較級。heavy → heavier（yをiに変えてer）。', difficulty: 'easy', related_points: ['比較級', '-er'] },
  { id: 'g19', category: '比較', front_text: 'Mt. Fuji is the ___ (high) mountain in Japan.', back_text: 'highest', explanation: '3つ以上の中で一番はthe + 最上級。high → highest。', difficulty: 'easy', related_points: ['最上級', 'the + -est'] },
  { id: 'g20', category: '比較', front_text: 'This question is ___ difficult ___ that one. (同じくらい)', back_text: 'as ... as', explanation: 'as ~ as：「…と同じくらい〜」の原級比較。否定形はnot as ~ as。', difficulty: 'medium', related_points: ['原級比較', 'as~as'] },
  { id: 'g21', category: '比較', front_text: 'English is ___ (useful) than any other language.', back_text: 'more useful', explanation: '長い形容詞の比較級はmore + 形容詞。useful, important, beautifulなど。', difficulty: 'medium', related_points: ['比較級', 'more'] },
  // === 接続詞 ===
  { id: 'g22', category: '接続詞', front_text: '___ it was raining, we went out. (〜だけど)', back_text: 'Although / Though', explanation: 'Although/Though「〜だけれども」は譲歩の接続詞。butと一緒には使いません。', difficulty: 'medium', related_points: ['譲歩', 'although'] },
  { id: 'g23', category: '接続詞', front_text: 'I\'ll call you ___ I arrive. (〜したら)', back_text: 'when / as soon as', explanation: 'when/as soon as「〜したら」。時の副詞節では未来のことでも現在形を使います。', difficulty: 'medium', related_points: ['時の接続詞', '現在形'] },
  { id: 'g24', category: '接続詞', front_text: 'I think ___ he is honest.', back_text: 'that', explanation: 'thinkの後のthat節。thatは省略可能。I think (that) ~「〜だと思う」。', difficulty: 'easy', related_points: ['名詞節', 'that節'] },
  // === 仮定法 ===
  { id: 'g25', category: '仮定法', front_text: 'If I ___ (be) rich, I would buy a big house.', back_text: 'were', explanation: '仮定法過去：現在の事実に反する仮定。be動詞は主語に関係なくwereを使います。', difficulty: 'hard', related_points: ['仮定法過去', 'If+過去形, would'] },
  { id: 'g26', category: '仮定法', front_text: 'I wish I ___ (can) fly.', back_text: 'could', explanation: 'I wish + 仮定法過去：「〜できたらなあ」と現在の実現不可能な願望を表します。', difficulty: 'hard', related_points: ['I wish', '仮定法'] },
  // === 前置詞 ===
  { id: 'g27', category: '前置詞', front_text: 'I\'m interested ___ science.', back_text: 'in', explanation: 'be interested in ~「〜に興味がある」。前置詞inとセットで覚えましょう。', difficulty: 'easy', related_points: ['前置詞', '形容詞+前置詞'] },
  { id: 'g28', category: '前置詞', front_text: 'She is good ___ playing the piano.', back_text: 'at', explanation: 'be good at ~「〜が得意」。前置詞atの後は名詞か動名詞。', difficulty: 'easy', related_points: ['前置詞', 'be good at'] },
  { id: 'g29', category: '前置詞', front_text: 'I\'m looking forward ___ seeing you.', back_text: 'to', explanation: 'look forward to ~ing「〜するのを楽しみにしている」。toの後は動名詞。', difficulty: 'medium', related_points: ['前置詞', 'look forward to'] },
  { id: 'g30', category: '前置詞', front_text: 'The movie was based ___ a true story.', back_text: 'on', explanation: 'be based on ~「〜に基づいている」。', difficulty: 'medium', related_points: ['前置詞', 'be based on'] },
  // === 分詞 ===
  { id: 'g31', category: '分詞', front_text: 'The girl ___ (sing) on the stage is my sister.', back_text: 'singing', explanation: '現在分詞の後置修飾。「ステージで歌っている女の子」名詞を後ろから修飾。', difficulty: 'medium', related_points: ['現在分詞', '後置修飾'] },
  { id: 'g32', category: '分詞', front_text: 'The language ___ (speak) in Brazil is Portuguese.', back_text: 'spoken', explanation: '過去分詞の後置修飾。「ブラジルで話されている言語」受動の意味。', difficulty: 'medium', related_points: ['過去分詞', '後置修飾'] },
  { id: 'g33', category: '分詞', front_text: 'The movie was very ___ (excite).', back_text: 'exciting', explanation: '物が主語→現在分詞(-ing)「わくわくさせる」。人が主語→過去分詞(-ed)「わくわくした」。', difficulty: 'medium', related_points: ['分詞形容詞', '-ing/-ed'] },
  // === 助動詞 ===
  { id: 'g34', category: '助動詞', front_text: 'You ___ (〜しなくてよい) come tomorrow.', back_text: 'don\'t have to', explanation: 'don\'t have to「〜しなくてよい」（不必要）。must not「〜してはいけない」（禁止）と区別。', difficulty: 'medium', related_points: ['助動詞', '不必要と禁止'] },
  { id: 'g35', category: '助動詞', front_text: 'You ___ not tell anyone about this. (禁止)', back_text: 'must', explanation: 'must not「〜してはいけない」は強い禁止。don\'t have toと混同しないよう注意。', difficulty: 'medium', related_points: ['must not', '禁止'] },
  { id: 'g36', category: '助動詞', front_text: '___ you like some coffee? (勧誘)', back_text: 'Would', explanation: 'Would you like ~?「〜はいかがですか」丁寧な勧誘表現。', difficulty: 'easy', related_points: ['would', '丁寧表現'] },
  // === 代名詞・冠詞 ===
  { id: 'g37', category: '代名詞', front_text: 'I lost my pen. Can I borrow ___? (あなたのもの)', back_text: 'yours', explanation: 'yours = your pen。所有代名詞で名詞の繰り返しを避けます。', difficulty: 'easy', related_points: ['所有代名詞', 'mine/yours'] },
  { id: 'g38', category: '代名詞', front_text: '___ of the students passed the exam. (全員)', back_text: 'All', explanation: 'all of ~「〜の全員」。each, some, none, mostなどと比較して覚えましょう。', difficulty: 'easy', related_points: ['数量代名詞', 'all/each/some'] },
  // === 文型 ===
  { id: 'g39', category: '文型', front_text: 'She made me ___ (happy の位置)', back_text: 'She made me happy.', explanation: 'SVOC（第5文型）：make + O + C「OをCにする」。Cには形容詞が入ります。', difficulty: 'medium', related_points: ['第5文型', 'make+O+C'] },
  { id: 'g40', category: '文型', front_text: 'My mother let me ___ (go) to the party.', back_text: 'go', explanation: 'let + O + 原形不定詞「Oに〜させてあげる」。toは不要。', difficulty: 'hard', related_points: ['使役動詞', 'let/make/have'] },
  // === 疑問文・否定文 ===
  { id: 'g41', category: '疑問文', front_text: '___ do you think about this plan? (意見を聞く)', back_text: 'What', explanation: 'What do you think about/of ~?「〜についてどう思いますか」。', difficulty: 'easy', related_points: ['疑問詞', '意見を聞く'] },
  { id: 'g42', category: '疑問文', front_text: 'You like sushi, ___ you?', back_text: 'don\'t', explanation: '付加疑問文：肯定文の後はdon\'t you? 否定文の後はdo you?', difficulty: 'medium', related_points: ['付加疑問文', '確認'] },
  // === 間接話法 ===
  { id: 'g43', category: '間接話法', front_text: 'He said, "I am tired." → He said that he ___ tired.', back_text: 'was', explanation: '間接話法では時制が1つ過去にずれます。am → was。', difficulty: 'hard', related_points: ['間接話法', '時制の一致'] },
  // === there構文 ===
  { id: 'g44', category: 'there構文', front_text: '___ ___ a lot of people at the party.', back_text: 'There were', explanation: 'There is/are ~「〜がある/いる」。peopleは複数形なのでwere。', difficulty: 'easy', related_points: ['there is/are', '存在文'] },
  // === 現在完了進行形 ===
  { id: 'g45', category: '時制', front_text: 'I ___ ___ ___ (wait) for an hour.', back_text: 'have been waiting', explanation: '現在完了進行形(have been ~ing)：過去から今まで「ずっと〜し続けている」。', difficulty: 'hard', related_points: ['現在完了進行形'] },
  // === too/enough ===
  { id: 'g46', category: '構文', front_text: 'This box is too heavy ___ (carry).', back_text: 'to carry', explanation: 'too ~ to …「〜すぎて…できない」。tooの後は形容詞、toの後は原形。', difficulty: 'medium', related_points: ['too~to', '不定詞'] },
  { id: 'g47', category: '構文', front_text: 'She is old ___ to drive.', back_text: 'enough', explanation: '形容詞 + enough + to不定詞「〜するのに十分…だ」。enoughは形容詞の後に置きます。', difficulty: 'medium', related_points: ['enough to', '不定詞'] },
  // === so/such ===
  { id: 'g48', category: '構文', front_text: 'It was ___ a beautiful day that we went to the park.', back_text: 'such', explanation: 'such + a/an + 形容詞 + 名詞 + that ~「とても…なので〜」。soは形容詞の前に直接。', difficulty: 'hard', related_points: ['so~that', 'such~that'] },
  // === 付帯状況 ===
  { id: 'g49', category: '構文', front_text: 'She sat on the bench ___ her eyes closed.', back_text: 'with', explanation: 'with + O + 過去分詞「Oを〜した状態で」付帯状況のwith。', difficulty: 'hard', related_points: ['付帯状況', 'with+O+p.p.'] },
  // === 感嘆文 ===
  { id: 'g50', category: '感嘆文', front_text: '___ beautiful this flower is!', back_text: 'How', explanation: 'How + 形容詞/副詞 + S + V!「なんと〜なんでしょう」。What + a/an + 形容詞 + 名詞と区別。', difficulty: 'medium', related_points: ['感嘆文', 'How/What'] },
  { id: 'g51', category: '時制', front_text: 'By the time he arrived, she ___ already ___ (leave).', back_text: 'had already left', explanation: '過去完了(had + p.p.)：過去のある時点よりさらに前の出来事を表します。', difficulty: 'hard', related_points: ['過去完了', '大過去'] },
  { id: 'g52', category: '関係代名詞', front_text: 'This is the town ___ I was born. (場所)', back_text: 'where', explanation: '関係副詞where：先行詞が場所の時に使います。in whichに書き換え可能。', difficulty: 'hard', related_points: ['関係副詞', 'where'] },
  { id: 'g53', category: '関係代名詞', front_text: 'I remember the day ___ we first met. (時)', back_text: 'when', explanation: '関係副詞when：先行詞がthe day/time/yearなど時の時に使います。', difficulty: 'hard', related_points: ['関係副詞', 'when'] },
  { id: 'g54', category: '関係代名詞', front_text: 'Tell me the reason ___ you were late.', back_text: 'why', explanation: '関係副詞why：先行詞がthe reasonの時に使います。for whichに書き換え可能。', difficulty: 'hard', related_points: ['関係副詞', 'why'] },
  { id: 'g55', category: '不定詞・動名詞', front_text: 'He stopped ___ (smoke) last year.', back_text: 'smoking', explanation: 'stop ~ing「〜するのをやめる」。stop to ~「〜するために立ち止まる」と区別。', difficulty: 'hard', related_points: ['動名詞', 'stop ~ing'] },
]
