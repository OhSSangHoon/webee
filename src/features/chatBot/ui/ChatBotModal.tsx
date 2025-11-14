"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import api from "@/shared/auth/lib";
import { useChatbotStore } from "../model/useChatbotStore";

/**
 * 질문 응답 타입
 */
interface QuestionResponse {
  input: string;
  answer: string;
  timestamp: Date;
}

/**
 * 챗봇 모달 컴포넌트
 * Footer의 상담 버튼으로 열림
 */
export default function ChatbotLauncher() {
  const { isOpen, closeChatbot } = useChatbotStore();
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "1. 수정벌 사용 시 주의사항은 무엇인가요?",
    "2. 수정벌이란 무엇인가요?",
    "3. 수정벌은 어떻게 관리하나요?",
  ];

  /**
   * 시간 포맷팅: 오전/오후 시:분
   */
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

  /**
   * AI 질문 처리
   */
  const handleAsk = async (question: string) => {
    if (!question.trim()) return;

    const timestamp = new Date();
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/assistants/messages", {
        input: question,
        conversationId: "8a12f9c1-54a3-4d8f-b2c2-017fa38a7763",
        mode: "RAG",
        stream: false,
      });

      const answer = res.data.data?.answer ?? "응답이 없습니다.";

      setResponses((prev) => [...prev, { input: question, answer, timestamp }]);
    } catch (err) {
      console.error("질문 실패:", err);
      setResponses((prev) => [
        ...prev,
        { input: question, answer: "오류가 발생했습니다.", timestamp },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 채팅 추가 시 자동 스크롤
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [responses, loading]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 text-gray-900 flex items-center justify-center z-50 text-[18px] "
      onClick={closeChatbot}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden fade-in-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="bg-gray-100 p-4 text-center font-bold text-lg relative shadow-xl">
          챗봇
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
            onClick={closeChatbot}
            aria-label="챗봇 닫기"
          >
            ×
          </button>
        </div>

        {/* 채팅 영역 */}
        <div
          ref={scrollRef}
          className="px-6 py-5 bg-gradient-to-b from-purple-50 to-white overflow-y-auto flex-1  min-h-[550px] max-h-[600px] resize-y rounded-md border border-gray-200"
        >
          <div className="flex flex-row gap-2 ">
            <div className="w-11 h-11 ">
              <Image
                src="/Bee3D.webp"
                alt="챗봇"
                fetchPriority="high"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="text-sm">붕붕이</div>
              <div className="rounded-lg bg-white px-4 py-2  shadow inline-block">
                안녕하세요! <br />
                수정벌 전문 AI 비서{" "}
                <span className="text-[#ff5e00]">붕붕이</span>
                입니다.
                <br />
                무엇을 도와드릴까요?
              </div>
            </div>
          </div>

          {/* 예시 질문 */}
          <div className="my-10">
            <div className="text-sm font-semibold">
              자주 하는 질문 목록이에요!
            </div>
            <div className="space-y-2">
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="w-full text-start bg-[#664318] text-white text-base rounded-xl py-2 px-5 shadow-md hover:bg-[#9e6e34]"
                  onClick={() => handleAsk(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 채팅 내용 */}
          {responses.map((res, idx) => (
            <div key={idx} className="animate-fade-in overflow-auto ">
              {/* 사용자 메시지 */}
              <div className="flex flex-col justify-end items-end my-1.5 ">
                <div className="bg-[#ffc83a] text-gray-900 px-4 py-3 rounded-xl shadow">
                  {res.input}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(new Date(res.timestamp))}
                </div>
              </div>

              {/* 봇 응답 */}
              <div className="flex flex-row gap-2 ">
                <div className="w-11 h-11 ">
                  <Image
                    src="/Bee3D.webp"
                    alt="챗봇"
                    fetchPriority="high"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="max-w-[80%]">
                  <div className="text-sm">붕붕이</div>
                  <div className="rounded-lg bg-white px-4 py-4 shadow inline-block">
                    {res.answer}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {formatTime(new Date(res.timestamp))}
              </div>
            </div>
          ))}

          {/* 로딩 중 메시지 */}
          {loading && (
            <div className="animate-pulse bg-white text-gray-600 px-4 py-2 rounded-l-lg text-sm shadow">
              답변 작성 중...
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className=" border flex flex-row px-4 py-4 gap-2 ">
          <input
            className="bg-gray-400 rounded-4xl px-5 w-[90%] "
            type="text"
            placeholder="질문을 입력하세요.. "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
          />
          <button
            className="bg-[#ffb800] hover:bg-[#b8761a] text-white rounded-full w-12 h-12"
            onClick={() => handleAsk(input)}
            disabled={loading || !input.trim()}
          >
            ⬆
          </button>
        </div>
      </div>
    </div>
  );
}
