'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AppState, Question } from '@/lib/nobishiro/types';

const STORAGE_KEY = 'nobishiro-quest';

// ---------------------------------------------------------------------------
// Inline question bank
// ---------------------------------------------------------------------------
const QUESTIONS: Question[] = [
  // mitsuki — 数学
  {
    id: 'mt-math-01', userType: 'mitsuki', subject: '数学', unit: '正負の数',
    format: 'multiple_choice', question: '(-3) + (+5) の答えは？',
    choices: ['-8', '2', '8', '-2'], answer: '2',
    explanation: '(-3) + (+5) = +2。符号が違うときは絶対値の大きい方の符号になります。',
    difficulty: 'easy', tags: ['正負の数', '加法'],
  },
  {
    id: 'mt-math-02', userType: 'mitsuki', subject: '数学', unit: '方程式',
    format: 'multiple_choice', question: '2x + 3 = 7 のとき、x の値は？',
    choices: ['1', '2', '3', '4'], answer: '2',
    explanation: '2x = 7 - 3 = 4、x = 4 ÷ 2 = 2',
    difficulty: 'easy', tags: ['方程式', '一次方程式'],
  },
  {
    id: 'mt-math-03', userType: 'mitsuki', subject: '数学', unit: '関数',
    format: 'multiple_choice', question: 'y = 2x + 1 のグラフの傾きは？',
    choices: ['1', '2', '3', '1/2'], answer: '2',
    explanation: 'y = ax + b の形で、a が傾き。ここでは a = 2 です。',
    difficulty: 'normal', tags: ['一次関数', '傾き'],
  },
  {
    id: 'mt-math-04', userType: 'mitsuki', subject: '数学', unit: '連立方程式',
    format: 'multiple_choice', question: '連立方程式 x+y=5, x-y=1 の解は？',
    choices: ['x=3,y=2', 'x=2,y=3', 'x=4,y=1', 'x=1,y=4'], answer: 'x=3,y=2',
    explanation: '2式を足すと 2x=6 → x=3。x+y=5 に代入して y=2。',
    difficulty: 'normal', tags: ['連立方程式', '加減法'],
  },
  {
    id: 'mt-math-05', userType: 'mitsuki', subject: '数学', unit: '確率',
    format: 'multiple_choice', question: '確率：サイコロを1回振って偶数が出る確率は？',
    choices: ['1/2', '1/3', '1/6', '2/3'], answer: '1/2',
    explanation: '偶数は 2, 4, 6 の3通り。全部で6通りなので 3/6 = 1/2。',
    difficulty: 'easy', tags: ['確率'],
  },

  // mitsuki — 英語
  {
    id: 'mt-eng-01', userType: 'mitsuki', subject: '英語', unit: 'be動詞',
    format: 'multiple_choice', question: 'I ___ a student.',
    choices: ['am', 'is', 'are', 'be'], answer: 'am',
    explanation: '主語が I のときは am を使います。',
    difficulty: 'easy', tags: ['be動詞'],
  },
  {
    id: 'mt-eng-02', userType: 'mitsuki', subject: '英語', unit: '三単現',
    format: 'multiple_choice', question: 'She ___ to school every day.',
    choices: ['go', 'goes', 'going', 'went'], answer: 'goes',
    explanation: '主語が三人称単数（She）で現在の習慣なので goes。',
    difficulty: 'easy', tags: ['三単現'],
  },
  {
    id: 'mt-eng-03', userType: 'mitsuki', subject: '英語', unit: '過去形',
    format: 'multiple_choice', question: 'I ___ play tennis yesterday.',
    choices: ["don't", "didn't", "doesn't", "wasn't"], answer: "didn't",
    explanation: '過去の否定文は did not (didn\'t) + 動詞の原形。',
    difficulty: 'normal', tags: ['過去形', '否定文'],
  },
  {
    id: 'mt-eng-04', userType: 'mitsuki', subject: '英語', unit: '比較級',
    format: 'multiple_choice', question: 'He is ___ than his brother.',
    choices: ['tall', 'taller', 'tallest', 'more tall'], answer: 'taller',
    explanation: '2者の比較には比較級（-er）を使います。tall → taller。',
    difficulty: 'normal', tags: ['比較級'],
  },
  {
    id: 'mt-eng-05', userType: 'mitsuki', subject: '英語', unit: '不定詞',
    format: 'multiple_choice', question: 'I want ___ a doctor.',
    choices: ['be', 'to be', 'being', 'been'], answer: 'to be',
    explanation: 'want + to + 動詞の原形（不定詞の名詞的用法）。',
    difficulty: 'normal', tags: ['不定詞'],
  },

  // mitsuki — 国語
  {
    id: 'mt-kokugo-01', userType: 'mitsuki', subject: '国語', unit: '敬語',
    format: 'multiple_choice', question: '「拝見する」は誰の動作を表す敬語か？',
    choices: ['自分', '相手', '第三者', '不明'], answer: '自分',
    explanation: '「拝見する」は謙譲語。自分の動作をへりくだって表現します。',
    difficulty: 'normal', tags: ['敬語', '謙譲語'],
  },
  {
    id: 'mt-kokugo-02', userType: 'mitsuki', subject: '国語', unit: '品詞',
    format: 'multiple_choice', question: '次のうち、接続詞はどれか？',
    choices: ['しかし', '美しい', '走る', '机'], answer: 'しかし',
    explanation: '「しかし」は逆接の接続詞。文と文をつなぐ働きがあります。',
    difficulty: 'easy', tags: ['品詞', '接続詞'],
  },
  {
    id: 'mt-kokugo-03', userType: 'mitsuki', subject: '国語', unit: '古典',
    format: 'multiple_choice', question: '「月日は百代の過客にして」の作品名は？',
    choices: ['奥の細道', '枕草子', '源氏物語', '徒然草'], answer: '奥の細道',
    explanation: '松尾芭蕉の「奥の細道」の冒頭部分です。',
    difficulty: 'normal', tags: ['古典', '作品'],
  },

  // michiru — 算数
  {
    id: 'mc-math-01', userType: 'michiru', subject: '算数', unit: '小数',
    format: 'multiple_choice', question: '0.3 × 4 = ?',
    choices: ['0.12', '1.2', '12', '0.7'], answer: '1.2',
    explanation: '0.3 × 4 = 1.2。小数 × 整数は、整数同士のかけ算をしてから小数点を戻します。',
    difficulty: 'easy', tags: ['小数', 'かけ算'],
  },
  {
    id: 'mc-math-02', userType: 'michiru', subject: '算数', unit: '分数',
    format: 'multiple_choice', question: '1/3 + 1/6 = ?',
    choices: ['1/2', '2/9', '1/9', '2/6'], answer: '1/2',
    explanation: '通分して 2/6 + 1/6 = 3/6 = 1/2。',
    difficulty: 'normal', tags: ['分数', '通分'],
  },
  {
    id: 'mc-math-03', userType: 'michiru', subject: '算数', unit: '割合',
    format: 'multiple_choice', question: '100人中40人は全体の何%？',
    choices: ['4%', '40%', '25%', '400%'], answer: '40%',
    explanation: '40 ÷ 100 × 100 = 40%。',
    difficulty: 'easy', tags: ['割合', '百分率'],
  },
  {
    id: 'mc-math-04', userType: 'michiru', subject: '算数', unit: '速さ',
    format: 'multiple_choice', question: '時速60kmで2時間走ると何km進む？',
    choices: ['30km', '60km', '120km', '180km'], answer: '120km',
    explanation: '距離 = 速さ × 時間 = 60 × 2 = 120km。',
    difficulty: 'easy', tags: ['速さ', '距離'],
  },
  {
    id: 'mc-math-05', userType: 'michiru', subject: '算数', unit: '面積',
    format: 'multiple_choice', question: '底辺6cm、高さ4cmの三角形の面積は？',
    choices: ['24cm²', '12cm²', '10cm²', '8cm²'], answer: '12cm²',
    explanation: '三角形の面積 = 底辺 × 高さ ÷ 2 = 6 × 4 ÷ 2 = 12cm²。',
    difficulty: 'easy', tags: ['面積', '三角形'],
  },

  // michiru — 国語
  {
    id: 'mc-kokugo-01', userType: 'michiru', subject: '国語', unit: 'ことわざ',
    format: 'multiple_choice', question: '「犬も歩けば___に当たる」',
    choices: ['石', '棒', '壁', '人'], answer: '棒',
    explanation: '「犬も歩けば棒に当たる」は有名なことわざです。',
    difficulty: 'easy', tags: ['ことわざ'],
  },
  {
    id: 'mc-kokugo-02', userType: 'michiru', subject: '国語', unit: '文法',
    format: 'multiple_choice', question: '次の文の主語は？「花が美しく咲いた」',
    choices: ['花が', '美しく', '咲いた', '花'], answer: '花が',
    explanation: '「何が」にあたる部分が主語。「花が」が主語です。',
    difficulty: 'easy', tags: ['文法', '主語'],
  },
  {
    id: 'mc-kokugo-03', userType: 'michiru', subject: '国語', unit: '慣用句',
    format: 'multiple_choice', question: '「頭が切れる」の意味は？',
    choices: ['頭が痛い', '頭が良い', '怒る', '忘れる'], answer: '頭が良い',
    explanation: '「頭が切れる」は「頭が良い、判断が鋭い」という意味の慣用句です。',
    difficulty: 'easy', tags: ['慣用句'],
  },
];

// ---------------------------------------------------------------------------
// Encouraging messages
// ---------------------------------------------------------------------------
const CORRECT_MESSAGES = ['できた！', 'いいね！', 'その調子！', 'すばらしい！', 'ナイス！'];
const INCORRECT_MESSAGES = ['のびしろ発見！', 'ここが伸びるポイント！', '次はできるよ！', 'おしい！もう少し！'];

function randomPick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Shuffle utility
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------------------
// Inner component that uses useSearchParams
// ---------------------------------------------------------------------------
function QuizInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subject = searchParams.get('subject') ?? '';
  const count = parseInt(searchParams.get('count') ?? '3', 10);
  const missionId = searchParams.get('missionId') ?? '';

  const [state, setState] = useState<AppState | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load state and questions
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) { router.replace('/mm'); return; }
      const s = JSON.parse(stored) as AppState;
      if (!s.currentUser) { router.replace('/mm'); return; }
      setState(s);

      // Filter questions for this user + subject
      const pool = QUESTIONS.filter(
        (q) => q.userType === s.currentUser && q.subject === subject
      );
      const selected = shuffle(pool).slice(0, count);
      setQuestions(selected);
    } catch {
      router.replace('/mm');
    }
  }, [router, subject, count]);

  const currentQuestion = questions[currentIndex] ?? null;
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex) / total) * 100 : 0;

  const handleAnswer = useCallback(
    (choice: string) => {
      if (showFeedback || !currentQuestion || !state) return;

      const correct = choice === currentQuestion.answer;
      setSelectedAnswer(choice);
      setIsCorrect(correct);
      setShowFeedback(true);
      setFeedbackMsg(correct ? randomPick(CORRECT_MESSAGES) : randomPick(INCORRECT_MESSAGES));

      if (correct) setCorrectCount((c) => c + 1);

      // Save answer record
      const now = new Date().toISOString();
      const updatedState: AppState = {
        ...state,
        answerRecords: [
          ...state.answerRecords,
          {
            questionId: currentQuestion.id,
            correct,
            answeredAt: now,
          },
        ],
        totalPoints: state.totalPoints + (correct ? 10 : 2),
      };
      setState(updatedState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));

      // Auto-advance after 1.5s
      setTimeout(() => {
        if (currentIndex + 1 >= total) {
          // Mark mission as completed if missionId provided
          if (missionId) {
            const todayStr = new Date().toISOString().split('T')[0];
            const completedKey = `nobishiro-missions-${todayStr}`;
            const completedRaw = localStorage.getItem(completedKey);
            const completedIds: string[] = completedRaw ? JSON.parse(completedRaw) : [];
            if (!completedIds.includes(missionId)) {
              completedIds.push(missionId);
              localStorage.setItem(completedKey, JSON.stringify(completedIds));
            }

            // Update dailyLog
            const log = updatedState.dailyLogs[todayStr] ?? {
              date: todayStr,
              studied: false,
              juku: false,
              missionsCompleted: 0,
              badgesEarned: [],
              parentCommented: false,
            };
            const newState: AppState = {
              ...updatedState,
              dailyLogs: {
                ...updatedState.dailyLogs,
                [todayStr]: {
                  ...log,
                  studied: true,
                  missionsCompleted: log.missionsCompleted + 1,
                },
              },
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          }

          const finalCorrect = correct ? correctCount + 1 : correctCount;
          router.push(
            `/mm/result?correct=${finalCorrect}&total=${total}&subject=${encodeURIComponent(subject)}`
          );
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowFeedback(false);
          setFeedbackMsg('');
        }
      }, 1500);
    },
    [showFeedback, currentQuestion, state, currentIndex, total, missionId, correctCount, router, subject]
  );

  const handleNext = useCallback(() => {
    if (!showFeedback) return;
    if (currentIndex + 1 >= total) {
      if (missionId) {
        const todayStr = new Date().toISOString().split('T')[0];
        const completedKey = `nobishiro-missions-${todayStr}`;
        const completedRaw = localStorage.getItem(completedKey);
        const completedIds: string[] = completedRaw ? JSON.parse(completedRaw) : [];
        if (!completedIds.includes(missionId)) {
          completedIds.push(missionId);
          localStorage.setItem(completedKey, JSON.stringify(completedIds));
        }
      }
      router.push(
        `/mm/result?correct=${correctCount}&total=${total}&subject=${encodeURIComponent(subject)}`
      );
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
      setFeedbackMsg('');
    }
  }, [showFeedback, currentIndex, total, missionId, correctCount, router, subject]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 gap-4">
        <p className="text-4xl">📚</p>
        <p className="text-slate-600 text-center">この教科の問題はまだ準備中です</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-slate-200 rounded-xl text-slate-700 font-medium"
        >
          もどる
        </button>
      </div>
    );
  }

  const isMitsuki = state.currentUser === 'mitsuki';
  const accentColor = isMitsuki ? 'indigo' : 'emerald';
  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header with progress */}
      <div className="px-5 pt-10 pb-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.push('/mm/mission')}
            className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-lg"
          >
            ←
          </button>
          <span className="text-sm text-slate-500 font-medium">{subject}</span>
          <span className="ml-auto text-sm font-bold text-slate-700">
            {currentIndex + 1} / {total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradFrom} ${gradTo} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${((currentIndex + (showFeedback ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col px-5 pt-8 pb-6">
        {currentQuestion && (
          <>
            {/* Question text */}
            <div className="mb-8">
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Choice buttons */}
            <div className="space-y-3">
              {(currentQuestion.choices ?? []).map((choice, idx) => {
                let btnClass =
                  'w-full min-h-14 px-5 py-4 rounded-2xl text-left text-base font-medium transition-all duration-200 border-2 ';

                if (!showFeedback) {
                  btnClass +=
                    'bg-white border-slate-200 text-slate-700 hover:border-slate-300 active:scale-[0.98]';
                } else if (choice === currentQuestion.answer) {
                  btnClass += 'bg-green-50 border-green-400 text-green-700';
                } else if (choice === selectedAnswer && !isCorrect) {
                  btnClass += 'bg-amber-50 border-amber-300 text-amber-700';
                } else {
                  btnClass += 'bg-slate-50 border-slate-100 text-slate-400';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(choice)}
                    disabled={showFeedback}
                    className={btnClass}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          showFeedback && choice === currentQuestion.answer
                            ? 'bg-green-400 text-white'
                            : showFeedback && choice === selectedAnswer && !isCorrect
                            ? 'bg-amber-300 text-white'
                            : `bg-${accentColor}-100 text-${accentColor}-600`
                        }`}
                      >
                        {showFeedback && choice === currentQuestion.answer
                          ? '○'
                          : showFeedback && choice === selectedAnswer && !isCorrect
                          ? '×'
                          : String.fromCharCode(65 + idx)}
                      </span>
                      <span>{choice}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback overlay */}
            {showFeedback && (
              <div className="mt-6 space-y-4">
                <div
                  className={`rounded-2xl p-5 ${
                    isCorrect
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-amber-50 border-2 border-amber-200'
                  }`}
                >
                  <p
                    className={`text-lg font-bold mb-2 ${
                      isCorrect ? 'text-green-600' : 'text-amber-600'
                    }`}
                  >
                    {isCorrect ? '⭐ ' : '💡 '}
                    {feedbackMsg}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className={`w-full py-4 rounded-2xl text-white text-base font-bold bg-gradient-to-r ${gradFrom} ${gradTo} shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
                >
                  {currentIndex + 1 >= total ? '結果を見る →' : '次へ →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export with Suspense boundary for useSearchParams
// ---------------------------------------------------------------------------
export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin text-2xl">🌀</div>
        </div>
      }
    >
      <QuizInner />
    </Suspense>
  );
}
