"use client";

import { useState } from "react";
import { ReportForm } from "@/features/report/ui/ReportForm";
import { ReportResult } from "@/features/report/ui/ReportResult";
import type { ReportInput, ReportResult as ReportResultType } from "@/shared/types/report";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileCheck, TrendingUp, Shield, Zap } from "lucide-react";
import { generateReport } from "@/features/report/api/reportApi";

export default function ReportPage() {
  const [reportResult, setReportResult] = useState<ReportResultType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (data: ReportInput) => {
    setIsGenerating(true);
    try {
      const result = await generateReport(data);
      setReportResult(result);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("리포트 생성 실패:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0E27] pt-[72px]">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="relative py-12 md:py-16">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22C55E]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-[#3B82F6]/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-10">
              <p className="text-[#22C55E] text-sm font-semibold tracking-wider uppercase mb-3">AI-Powered Smart Beekeeping</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                스마트 수정벌 솔루션으로<br />
                <span className="text-[#22C55E]">농업 생산성</span>을 혁신합니다
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto">
                IoT 센서와 AI 기술을 활용한 데이터 기반 수정벌 관리로 착과율을 높이고 수익을 극대화하세요
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex justify-center gap-8 md:gap-16 mb-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-2xl md:text-3xl font-bold text-white">25%</span>
                </div>
                <p className="text-white/50 text-xs font-medium">수정률 향상</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-[#3B82F6]" />
                  <span className="text-2xl md:text-3xl font-bold text-white">72h</span>
                </div>
                <p className="text-white/50 text-xs font-medium">사전 경보</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-[#FFD55F]" />
                  <span className="text-2xl md:text-3xl font-bold text-white">30%</span>
                </div>
                <p className="text-white/50 text-xs font-medium">비용 절감</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="max-w-4xl mx-auto">
              <ReportForm onSubmit={handleSubmit} isLoading={isGenerating} />
            </div>
          </div>
        </div>
      </main>

      {/* Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0 border-none bg-[#0A0E27] rounded-2xl shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogTitle className="sr-only">분석 결과 리포트</DialogTitle>
          <DialogDescription className="sr-only">수정벌 관리 최적화를 위한 상세 분석 결과입니다</DialogDescription>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg shadow-[#22C55E]/20">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">분석 리포트가 생성되었습니다</h2>
                <p className="text-sm text-white/50">데이터 기반의 최적화 가이드를 확인하세요</p>
              </div>
            </div>
            {reportResult && (
              <ReportResult result={reportResult} onNewReport={() => setIsDialogOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
