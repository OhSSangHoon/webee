"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportInputSchema, cropOptions, strawberryVarieties, beeBrands, type ReportInput } from "@/shared/types/report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Loader2, FileText, Wheat, Home, Thermometer, ArrowRight } from "lucide-react";

interface ReportFormProps {
  onSubmit: (data: ReportInput) => void;
  isLoading?: boolean;
}

export function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
  const form = useForm<ReportInput>({
    resolver: zodResolver(reportInputSchema),
    defaultValues: {
      location: "",
      farmArea: 1000,
      crop: "strawberry",
      cropVariety: "seolhyang",
      hasGreenhouse: true,
      greenhouseCount: 3,
      greenhouseSize: 330,
      beeBrand: "jirisan",
      boxesPerHouse: 3,
      replacementWeeks: 3,
      annualKg: 5000,
      hasSmartFarm: true,
      averageTemperature: 27,
      averageHumidity: 85,
    },
  });

  const hasGreenhouse = form.watch("hasGreenhouse");
  const hasSmartFarm = form.watch("hasSmartFarm");
  const selectedCrop = form.watch("crop");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#0A0E27] flex items-center justify-center">
            <Wheat className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0A0E27]">농장 정보 입력</h2>
            <p className="text-xs text-gray-600">정확한 분석을 위해 농장 정보를 입력해주세요</p>
          </div>
        </div>

        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-600 h-4">위치</FormLabel>
                <FormControl>
                  <Input placeholder="논산" {...field} className="h-10 bg-gray-50 border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:border-[#22C55E] focus:ring-[#22C55E]/20" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="farmArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`text-xs font-semibold h-4 ${hasGreenhouse ? "text-gray-500" : "text-gray-600"}`}>농지 면적 {hasGreenhouse && <span className="text-[10px]">(선택)</span>}</FormLabel>
                <div className="relative">
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} disabled={hasGreenhouse} className={`h-10 border-gray-200 rounded-lg text-sm font-semibold pr-8 focus:border-[#22C55E] focus:ring-[#22C55E]/20 ${hasGreenhouse ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 text-gray-900"}`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">평</span>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="crop"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-600 h-4">재배 작물</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-10 bg-gray-50 border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:border-[#22C55E] focus:ring-[#22C55E]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cropOptions.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value} className="text-sm">{crop.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {selectedCrop === "strawberry" && (
            <FormField
              control={form.control}
              name="cropVariety"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-600 h-4">품종</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-10 bg-gray-50 border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:border-[#22C55E] focus:ring-[#22C55E]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strawberryVarieties.map((v) => (
                        <SelectItem key={v.value} value={v.value} className="text-sm">{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Row 2: Greenhouse Info */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <FormField
              control={form.control}
              name="hasGreenhouse"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-4 h-4 rounded border-gray-300 data-[state=checked]:bg-[#22C55E] data-[state=checked]:border-[#22C55E]" />
                  <span className="text-sm font-semibold text-[#0A0E27] flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-[#22C55E]" /> 하우스 시설
                  </span>
                </div>
              )}
            />
            {hasGreenhouse && (
              <div className="flex items-center gap-3">
                <FormField control={form.control} name="greenhouseCount" render={({ field }) => (
                  <div className="flex items-center gap-1.5">
                    <Input type="number" className="w-14 h-8 text-center text-xs font-bold text-gray-900 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="text-xs text-gray-600">동</span>
                  </div>
                )} />
                <FormField control={form.control} name="greenhouseSize" render={({ field }) => (
                  <div className="flex items-center gap-1.5">
                    <Input type="number" className="w-16 h-8 text-center text-xs font-bold text-gray-900 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="text-xs text-gray-600">평/동</span>
                  </div>
                )} />
              </div>
            )}
          </div>

          {hasGreenhouse && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <FormField control={form.control} name="beeBrand" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-gray-600 uppercase h-3.5">수정벌 브랜드</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-9 text-xs font-semibold text-gray-900 border-gray-200 rounded-lg bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {beeBrands.map((b) => (<SelectItem key={b.value} value={b.value} className="text-sm">{b.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="boxesPerHouse" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-gray-600 uppercase h-3.5">동당 박스</FormLabel>
                  <div className="relative">
                    <Input type="number" className="h-9 text-xs font-bold text-gray-900 pr-10 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">박스</span>
                  </div>
                </FormItem>
              )} />
              <FormField control={form.control} name="replacementWeeks" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-gray-600 uppercase h-3.5">교체 주기</FormLabel>
                  <div className="relative">
                    <Input type="number" className="h-9 text-xs font-bold text-gray-900 pr-8 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">주</span>
                  </div>
                </FormItem>
              )} />
              <FormField control={form.control} name="annualKg" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-semibold text-gray-600 uppercase h-3.5">연 생산량</FormLabel>
                  <div className="relative">
                    <Input type="number" className="h-9 text-xs font-bold text-gray-900 pr-8 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">kg</span>
                  </div>
                </FormItem>
              )} />
            </div>
          )}
        </div>

        {/* Row 3: Environment Data */}
        <div className="bg-[#0A0E27]/5 p-4 rounded-xl border border-[#0A0E27]/10 mb-5">
          <div className="flex items-center justify-between">
            <FormField control={form.control} name="hasSmartFarm" render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-4 h-4 rounded border-gray-300 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]" />
                <span className="text-sm font-semibold text-[#0A0E27] flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#3B82F6]" /> 환경 데이터 입력
                </span>
              </div>
            )} />
            {hasSmartFarm && (
              <div className="flex items-center gap-4">
                <FormField control={form.control} name="averageTemperature" render={({ field }) => (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-600">온도</span>
                    <Input type="number" className="w-14 h-8 text-center text-xs font-bold text-gray-900 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="text-xs text-[#22C55E] font-bold">°C</span>
                  </div>
                )} />
                <FormField control={form.control} name="averageHumidity" render={({ field }) => (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-600">습도</span>
                    <Input type="number" className="w-14 h-8 text-center text-xs font-bold text-gray-900 border-gray-200 rounded-lg bg-white" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value) || undefined)} />
                    <span className="text-xs text-[#3B82F6] font-bold">%</span>
                  </div>
                )} />
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#22C55E]/30 gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><FileText className="w-4 h-4" /> 진단 시작하기 <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </form>
    </Form>
  );
}
