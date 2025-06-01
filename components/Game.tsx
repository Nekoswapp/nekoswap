"use client";

import { useEffect, useState, useRef } from "react";
import quizData from "@/Data/quizData.json";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUESTIONS_PER_SESSION = 10;
const TIME_LIMIT_SECONDS =80; // 1 menit

export default function QuizGame() {
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<typeof quizData>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [failedDueToTime, setFailedDueToTime] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pickNewSessionQuestions = () => {
    const availableIndexes = quizData
      .map((_, idx) => idx)
      .filter((idx) => !usedIndexes.includes(idx));

    let pickedIndexes: number[] = [];

    if (availableIndexes.length === 0) {
      setUsedIndexes([]);
      pickedIndexes = shuffleArray(quizData.map((_, idx) => idx)).slice(0, QUESTIONS_PER_SESSION);
    } else {
      const count = Math.min(QUESTIONS_PER_SESSION, availableIndexes.length);
      pickedIndexes = shuffleArray(availableIndexes).slice(0, count);
    }

    setUsedIndexes((prev) => [...prev, ...pickedIndexes]);
    setSessionQuestions(pickedIndexes.map((idx) => quizData[idx]));
    setCurrentQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setRewardMessage("");
    setFailedDueToTime(false);
    setTimeLeft(TIME_LIMIT_SECONDS);
  };

  useEffect(() => {
    pickNewSessionQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown
  useEffect(() => {
    if (finished) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          setFailedDueToTime(true);
          setRewardMessage("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finished]);

  const currentQuestion = sessionQuestions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (selected || finished) return;
    setSelected(option);

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < sessionQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (score + (isCorrect ? 1 : 0) === sessionQuestions.length) {
          setRewardMessage("🎁 Selamat! Kamu mendapatkan 10 NEKO! Screenshot dan kirim ke Telegram.");
        } else {
          setRewardMessage("");
        }
      }
    }, 1000);
  };

  const nextSession = () => {
    pickNewSessionQuestions();
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="text-center p-10 text-gray-700 dark:text-gray-300">Memuat pertanyaan...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 shadow-2xl rounded-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web3 Quiz Game</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Uji pengetahuanmu seputar blockchain & crypto
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mr-4">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + (finished ? 1 : 0)) / sessionQuestions.length) * 100}%`,
            }}
          />
        </div>
        <div className="text-sm font-medium text-gray-800 dark:text-white w-16 text-right">
          {timeLeft}s
        </div>
      </div>

      {!finished ? (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">{currentQuestion.question}</h2>
          </div>
          <div className="space-y-4">
            {currentQuestion.options.map((option) => {
              const isCorrect = selected && option === currentQuestion.answer;
              const isWrong = selected === option && option !== currentQuestion.answer;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full px-5 py-3 rounded-xl border text-sm font-medium transition-all
                    ${
                      isCorrect
                        ? "bg-green-100 text-green-800 border-green-300"
                        : isWrong
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center space-y-6 mt-10">
          {failedDueToTime ? (
            <>
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
                ⏰ Waktu habis! Kamu gagal. Silakan coba lagi.
              </h2>
              <button
                onClick={nextSession}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              >
                Mulai Ulang
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">🎉 Selesai!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Skor kamu: <span className="font-bold text-indigo-600">{score}</span> / {sessionQuestions.length}
              </p>
              {rewardMessage && <p className="text-green-600 font-semibold">{rewardMessage}</p>}
              <button
                onClick={nextSession}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Lanjut Pertanyaan Berikutnya
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
