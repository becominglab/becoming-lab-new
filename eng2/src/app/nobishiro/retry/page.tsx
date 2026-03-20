'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AppState, Question } from '@/lib/nobishiro/types';
import { QUESTIONS } from '@/lib/nobishiro/data';
import { getState, updateState, addAnswerRecord } from '@/lib/nobishiro/store';

// ---------------------------------------------------------------------------
// Inline sample retry questions (supplements the main QUESTIONS pool)
// ---------------------------------------------------------------------------

const SAMPLE_RETRY_QUESTIONS: Question[] = [
  // みつき — 数学
  {
    id: 'retry-mq-001',
    userType: 'mitsuki',
    subject: '数学',
    unit: '正負の数',
    format: 'multiple_choice',
    question: '(-8) + (+3) の答えは？',
    choices: ['-11', '-5', '5', '11'],
    answer: '-5',
    explanation: '異符号の加法：絶対値の大きい方の符号をとり、差を求めます。8 - 3 = 5、符号は負で -5。',
    difficulty: 'easy',
    tags: ['正負の数', '加法'],
  },
  {
    id: 'retry-mq-002',
    userType: 'mitsuki',
    subject: '数学',
    unit: '一次方程式',
    format: 'multiple_choice',
    question: '5x - 3 = 12 のとき、x は？',
    choices: ['1', '2', '3', '5'],
    answer: '3',
    explanation: '5x = 12 + 3 = 15、x = 15 ÷ 5 = 3',
    difficulty: 'easy',
    tags: ['一次方程式'],
  },
  {
    id: 'retry-mq-003',
    userType: 'mitsuki',
    subject: '数学',
    unit: '連立方程式',
    format: 'fill_blank',
    question: 'x + y = 7、2x + y = 10 のとき y は？',
    answer: '4',
    explanation: '2式目から1式目を引くと x = 3。y = 7 - 3 = 4。',
    difficulty: 'normal',
    tags: ['連立方程式'],
  },
  // みつき — 英語
  {
    id: 'retry-me-001',
    userType: 'mitsuki',
    subject: '英語',
    unit: '過去形',
    format: 'multiple_choice',
    question: '"She ___ a cake yesterday." (make の過去形)',
    choices: ['maked', 'made', 'makes', 'making'],
    answer: 'made',
    explanation: 'make は不規則動詞で、過去形は made です。',
    difficulty: 'easy',
    tags: ['過去形', '不規則動詞'],
  },
  {
    id: 'retry-me-002',
    userType: 'mitsuki',
    subject: '英語',
    unit: 'be動詞',
    format: 'multiple_choice',
    question: '"They ___ my friends." 空欄に入るbe動詞は？',
    choices: ['am', 'is', 'are', 'was'],
    answer: 'are',
    explanation: '主語が They（複数）なので are を使います。',
    difficulty: 'easy',
    tags: ['be動詞'],
  },
  {
    id: 'retry-me-003',
    userType: 'mitsuki',
    subject: '英語',
    unit: '比較',
    format: 'fill_blank',
    question: '"This book is ___ than that one." (interesting の比較級)',
    answer: 'more interesting',
    explanation: '長い形容詞の比較級は more + 形容詞 です。',
    difficulty: 'normal',
    tags: ['比較', '比較級'],
  },
  // みつき — 国語
  {
    id: 'retry-mj-001',
    userType: 'mitsuki',
    subject: '国語',
    unit: '漢字',
    format: 'fill_blank',
    question: '「こうけん」を漢字で書くと？',
    answer: '貢献',
    explanation: '貢献（こうけん）＝力を尽くして役に立つこと。',
    difficulty: 'normal',
    tags: ['漢字', '書き取り'],
  },
  {
    id: 'retry-mj-002',
    userType: 'mitsuki',
    subject: '国語',
    unit: '文法',
    format: 'multiple_choice',
    question: '「ゆっくり」の品詞は？',
    choices: ['名詞', '動詞', '形容詞', '副詞'],
    answer: '副詞',
    explanation: '「ゆっくり」は動詞や形容詞を修飾する副詞です。',
    difficulty: 'easy',
    tags: ['文法', '品詞'],
  },
  {
    id: 'retry-mj-003',
    userType: 'mitsuki',
    subject: '国語',
    unit: '古文の基礎',
    format: 'multiple_choice',
    question: '古文で「あはれ」の意味として最も近いのは？',
    choices: ['かわいい', 'しみじみと感じる', '明るい', '怖い'],
    answer: 'しみじみと感じる',
    explanation: '「あはれ」はしみじみとした感動を表す言葉です。',
    difficulty: 'normal',
    tags: ['古文', '古語'],
  },
  // みちる — 算数
  {
    id: 'retry-cq-001',
    userType: 'michiru',
    subject: '算数',
    unit: '分数',
    format: 'multiple_choice',
    question: '2/5 + 1/5 はいくつ？',
    choices: ['1/5', '2/5', '3/5', '3/10'],
    answer: '3/5',
    explanation: '分母が同じなので分子を足します。2 + 1 = 3 → 3/5。',
    difficulty: 'easy',
    tags: ['分数', '加法'],
  },
  {
    id: 'retry-cq-002',
    userType: 'michiru',
    subject: '算数',
    unit: '速さ',
    format: 'fill_blank',
    question: '分速80mで15分歩くと何m進む？',
    answer: '1200',
    explanation: '距離＝速さ×時間＝80×15＝1200m',
    difficulty: 'easy',
    tags: ['速さ', '距離'],
  },
  {
    id: 'retry-cq-003',
    userType: 'michiru',
    subject: '算数',
    unit: '割合',
    format: 'multiple_choice',
    question: '300円の40%はいくら？',
    choices: ['100円', '120円', '140円', '160円'],
    answer: '120円',
    explanation: '300 × 0.4 = 120円',
    difficulty: 'easy',
    tags: ['割合', '百分率'],
  },
  // みちる — 国語
  {
    id: 'retry-cj-001',
    userType: 'michiru',
    subject: '国語',
    unit: 'ことわざ',
    format: 'multiple_choice',
    question: '「石の上にも（　）年」のカッコに入る数字は？',
    choices: ['一', '二', '三', '五'],
    answer: '三',
    explanation: '「石の上にも三年」＝辛抱強く続ければ報われるということ。',
    difficulty: 'easy',
    tags: ['ことわざ'],
  },
  {
    id: 'retry-cj-002',
    userType: 'michiru',
    subject: '国語',
    unit: '慣用句',
    format: 'multiple_choice',
    question: '「目を丸くする」の意味は？',
    choices: ['怒る', '驚く', '泣く', '笑う'],
    answer: '驚く',
    explanation: '「目を丸くする」＝驚いて目を大きく見開くこと。',
    difficulty: 'easy',
    tags: ['慣用句'],
  },
  {
    id: 'retry-cj-003',
    userType: 'michiru',
    subject: '国語',
    unit: '接続語',
    format: 'multiple_choice',
    question: '「勉強した。（　）テストで良い点が取れた。」適切な接続語は？',
    choices: ['しかし', 'その結果', 'ところで', 'または'],
    answer: 'その結果',
    explanation: '原因→結果の関係なので「その結果」が適切です。',
    difficulty: 'easy',
    tags: ['接続語', '順接'],
  },
];

// ---------------------------------------------------------------------------
// All questions pool (main + sample retry)
// ---------------------------------------------------------------------------
const ALL_QUESTIONS = [...QUESTIONS, ...SAMPLE_RETRY_QUESTIONS];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function RetryPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectParam = searchParams.get('subject') || '';
  const unitParam = searchParams.get('unit') || '';

  const [state, setState] = useState<AppState | null>(null);
  const [retryQuestions, setRetryQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load state and find retry questions
  useEffect(() => {
    const s = getState();
    if (!s.currentUser) {
      router.replace('/mm');
      return;
    }
    setState(s);

    // Find questions that were answered incorrectly
    const incorrectQIds = new Set(
      s.answerRecords.filter((r) => !r.correct).map((r) => r.questionId),
    );

    // Filter questions matching subject/unit with incorrect answers
    let candidates = ALL_QUESTIONS.filter((q) => {
      const userMatch = q.userType === s.currentUser;
      const subjectMatch = !subjectParam || q.subject === subjectParam;
      const unitMatch = !unitParam || q.unit === unitParam;
      const wasIncorrect = incorrectQIds.has(q.id);
      return userMatch && subjectMatch && unitMatch && wasIncorrect;
    });

    // If no specific incorrect questions found, try to get questions from the same subject/unit
    // that haven't been answered yet (fresh retry material)
    if (candidates.length === 0 && (subjectParam || unitParam)) {
      candidates = ALL_QUESTIONS.filter((q) => {
        const userMatch = q.userType === s.currentUser;
        const subjectMatch = !subjectParam || q.subject === subjectParam;
        const unitMatch = !unitParam || q.unit === unitParam;
        return userMatch && subjectMatch && unitMatch;
      });
      // Only use these if there were actual incorrect answers
      if (incorrectQIds.size === 0) candidates = [];
    }

    // Shuffle and limit
    const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, 5);
    setRetryQuestions(shuffled);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMitsuki = state?.currentUser === 'mitsuki';
  const gradFrom = isMitsuki ? 'from-indigo-500' : 'from-emerald-500';
  const gradTo = isMitsuki ? 'to-slate-600' : 'to-teal-500';
  const accentText = isMitsuki ? 'text-indigo-600' : 'text-emerald-600';
  const accentBg = isMitsuki ? 'bg-indigo-500' : 'bg-emerald-500';
  const accentBgLight = isMitsuki ? 'bg-indigo-50' : 'bg-emerald-50';
  const accentBorder = isMitsuki ? 'border-indigo-100' : 'border-emerald-100';
  const accentBgMedium = isMitsuki ? 'bg-indigo-100' : 'bg-emerald-100';

  const currentQ = retryQuestions[currentIndex] as Question | undefined;
  const progress = retryQuestions.length > 0 ? ((currentIndex + (showResult ? 1 : 0)) / retryQuestions.length) * 100 : 0;

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !currentQ || !state) return;

      const correct = answer.trim() === currentQ.answer.trim();
      setIsCorrect(correct);
      setShowResult(true);
      if (correct) setCorrectCount((c) => c + 1);

      // Record answer
      const nextState = addAnswerRecord(state, currentQ.id, correct);
      setState(nextState);
    },
    [showResult, currentQ, state],
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= retryQuestions.length) {
      setQuizDone(true);
      // Navigate to result
      const params = new URLSearchParams({
        correct: String(correctCount + (isCorrect ? 0 : 0)),
        total: String(retryQuestions.length),
        subject: subjectParam,
      });
      router.push(`/nobishiro/result?${params.toString()}`);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setFillAnswer('');
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [currentIndex, retryQuestions.length, correctCount, isCorrect, subjectParam, router]);

  // Loading
  if (!mounted || !state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-2xl">🌀</div>
      </div>
    );
  }

  // No retry questions available
  if (retryQuestions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              ←
            </button>
            <h1 className="text-white text-lg font-bold">のびしろ再チャレンジ</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="text-6xl mb-4">🌈</div>
          <h2 className="text-lg font-bold text-slate-700 mb-2 text-center">
            まだ復習する問題がないよ！
          </h2>
          <p className="text-sm text-slate-500 text-center mb-8">
            新しいミッションに挑戦しよう！
          </p>
          <button
            onClick={() => router.push('/nobishiro/mission')}
            className={`w-full max-w-xs bg-gradient-to-r ${gradFrom} ${gradTo} text-white rounded-2xl py-4 text-base font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
          >
            🎯 ミッションに挑戦する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradFrom} ${gradTo} px-5 pt-10 pb-6 rounded-b-3xl`}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-white text-lg font-bold">のびしろ再チャレンジ</h1>
            <p className="text-white/70 text-xs">
              {subjectParam && `${subjectParam}`}
              {unitParam && ` / ${unitParam}`}
            </p>
          </div>
          <div className="text-white text-sm font-medium">
            {currentIndex + 1} / {retryQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Encouragement */}
        <div className={`${accentBgLight} border ${accentBorder} rounded-2xl p-3 text-center`}>
          <p className={`text-sm font-medium ${accentText}`}>
            {currentIndex === 0
              ? 'この前見つけた"のびしろ"にもう一回チャレンジ！'
              : '前よりできるかも！'}
          </p>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            {/* Question type badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`${accentBgMedium} ${accentText} text-xs font-medium px-2.5 py-1 rounded-full`}>
                {currentQ.unit}
              </span>
              <span className="text-xs text-slate-400">
                {currentQ.format === 'multiple_choice' && '選択問題'}
                {currentQ.format === 'true_false' && '○×問題'}
                {currentQ.format === 'fill_blank' && '穴うめ問題'}
              </span>
            </div>

            {/* Question text */}
            <p className="text-base font-bold text-slate-800 leading-relaxed mb-5">
              {currentQ.question}
            </p>

            {/* Multiple Choice */}
            {currentQ.format === 'multiple_choice' && currentQ.choices && (
              <div className="space-y-3">
                {currentQ.choices.map((choice, i) => {
                  let btnClass = `w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all `;
                  if (showResult) {
                    if (choice === currentQ.answer) {
                      btnClass += 'border-green-400 bg-green-50 text-green-700';
                    } else if (choice === selectedAnswer && !isCorrect) {
                      btnClass += 'border-orange-300 bg-orange-50 text-orange-600';
                    } else {
                      btnClass += 'border-slate-100 bg-slate-50 text-slate-400';
                    }
                  } else if (choice === selectedAnswer) {
                    btnClass += `${accentBorder} ${accentBgLight} ${accentText}`;
                  } else {
                    btnClass += 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-[0.98]';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!showResult) {
                          setSelectedAnswer(choice);
                          handleAnswer(choice);
                        }
                      }}
                      disabled={showResult}
                      className={btnClass}
                    >
                      <span className="mr-2 text-slate-400">{['A', 'B', 'C', 'D'][i]}.</span>
                      {choice}
                    </button>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {currentQ.format === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {['○', '×'].map((opt) => {
                  let btnClass = `py-4 rounded-xl border-2 text-lg font-bold text-center transition-all `;
                  if (showResult) {
                    if (opt === currentQ.answer) {
                      btnClass += 'border-green-400 bg-green-50 text-green-700';
                    } else if (opt === selectedAnswer && !isCorrect) {
                      btnClass += 'border-orange-300 bg-orange-50 text-orange-600';
                    } else {
                      btnClass += 'border-slate-100 bg-slate-50 text-slate-400';
                    }
                  } else {
                    btnClass += 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-[0.98]';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (!showResult) {
                          setSelectedAnswer(opt);
                          handleAnswer(opt);
                        }
                      }}
                      disabled={showResult}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the blank */}
            {currentQ.format === 'fill_blank' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={fillAnswer}
                  onChange={(e) => setFillAnswer(e.target.value)}
                  disabled={showResult}
                  placeholder="答えを入力してね"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 text-base font-medium transition-all outline-none ${
                    showResult
                      ? isCorrect
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-orange-300 bg-orange-50 text-orange-600'
                      : 'border-slate-200 focus:border-indigo-300 text-slate-700'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && fillAnswer.trim() && !showResult) {
                      handleAnswer(fillAnswer);
                    }
                  }}
                />
                {!showResult && (
                  <button
                    onClick={() => {
                      if (fillAnswer.trim()) handleAnswer(fillAnswer);
                    }}
                    disabled={!fillAnswer.trim()}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      fillAnswer.trim()
                        ? `bg-gradient-to-r ${gradFrom} ${gradTo} text-white shadow-md active:scale-[0.98]`
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    回答する
                  </button>
                )}
              </div>
            )}

            {/* Result feedback */}
            {showResult && (
              <div className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-green-50' : 'bg-amber-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{isCorrect ? '🎉' : '🌱'}</span>
                  <span className={`font-bold text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                    {isCorrect ? '正解！前よりできるようになったね！' : 'ここがのびしろ！覚えておこう！'}
                  </span>
                </div>
                {!isCorrect && (
                  <p className="text-sm text-amber-600 mb-1">
                    正解: <span className="font-bold">{currentQ.answer}</span>
                  </p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r ${gradFrom} ${gradTo} text-white rounded-2xl py-4 text-base font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all`}
          >
            {currentIndex + 1 >= retryQuestions.length ? '結果を見る 🏁' : '次の問題へ →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function RetryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-2xl">🌀</div></div>}>
      <RetryPageInner />
    </Suspense>
  );
}
