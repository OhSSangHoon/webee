"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/shared/auth/lib";

interface QuestionResponse {
  input: string;
  answer: string;
  timestamp: Date;
}

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "수정벌 사용 시 주의사항은 무엇인가요?",
    "수정벌이란 무엇인가요?",
    "수정벌은 어떻게 관리하나요?",
  ];

  // 시간 포맷: 오전/오후 시:분
  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

  // ✅ 질문과 응답이 동시에 저장되는 방식
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

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [responses, loading]);

  return (
    <>
      {/* 챗봇 열기 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className=" fixed bottom-6 right-6 bg-violet-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-violet-700"
      >
        챗봇 열기
      </button>

      {/* 챗봇 모달 */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden fade-in-up relative ">
            {/* 상단 헤더 */}
            <div className="bg-gray-100 p-4 text-center font-bold text-lg relative shadow-xl">
              챗봇
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            {/* 채팅 영역 */}
            <div
              ref={scrollRef}
              className="p-4 bg-gradient-to-b from-purple-50 to-white overflow-y-auto flex-1 space-y-4
             min-h-[120px] max-h-[600px] resize-y rounded-md border border-gray-200"
            >
              🐝
              <div className="rounded-full bg-white px-4 py-2 shadow inline-block">
                안녕하세요. 수정벌 전문 ai입니다. 무엇을 도와드릴까요?
              </div>
              {/* 예시 질문 */}
              <hr className="border-t border-[#e4deff] m-4" />
              <div className="text-sm text-gray-700">많이 하는 질문 목록</div>
              <div className="space-y-2 mb-2">
                {exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="w-full text-center bg-purple-50 text-purple-700 rounded-full py-2 shadow-md hover:bg-purple-100"
                    onClick={() => handleAsk(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <hr className="border-t border-[#e4deff] m-4" />
              {/* 채팅 내용 */}
              {responses.map((res, idx) => (
                <div
                  key={idx}
                  className="space-y-2 animate-fade-in overflow-auto"
                >
                  {/* 사용자 메시지 */}
                  <div className="flex justify-end items-end gap-2">
                    <div className="text-xs text-gray-400">
                      {formatTime(new Date(res.timestamp))}
                    </div>
                    <div className="bg-violet-700 text-white px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow">
                      <div className="flex items-center gap-2">
                        <span>{res.input}</span>
                        <span className="text-lg">😀</span>
                      </div>
                    </div>
                  </div>

                  {/* 봇 응답 */}
                  <div className="flex items-end gap-2">
                    <span className="text-lg">🐝</span>
                    <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow">
                      <span>{res.answer}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTime(new Date(res.timestamp))}
                    </div>
                  </div>
                </div>
              ))}
              {/* 로딩 중 메시지 */}
              {loading && (
                <div className="flex items-center gap-2 animate-pulse">
                  <span className="text-lg">🐝</span>
                  <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl text-sm shadow">
                    답변 작성 중...
                  </div>
                </div>
              )}
            </div>

            {/* 입력창 */}
            <div className="p-4 border-t  border-[#d2c7ff] flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
                type="text"
                placeholder="질문을 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
              />
              <button
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-4 py-2 text-sm"
                onClick={() => handleAsk(input)}
                disabled={loading || !input.trim()}
              >
                질문
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
