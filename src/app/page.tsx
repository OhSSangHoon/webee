"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, ShoppingBag, Users, Bot, Leaf, Shield, TrendingUp, Smartphone, Download, ChevronDown, Trophy, Send, Mail, Phone, MessageSquare, Thermometer, Camera, Settings, Eye, Cpu } from "lucide-react";
import { SiGoogleplay, SiAppstore } from "react-icons/si";
import { ShaderCard, PhoneMockup } from "@/components/shader-card";
// import { Chatbot } from "@/components/chatbot"; // TODO: Add chatbot component
import { Beehive3DViewer } from "@/components/beehive-3d-viewer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Asset paths
const heroVideo = "/assets/generated_videos/bees_working_on_honeycomb.mp4";
const smartMonitoringImg = "/assets/stock_images/smart_beehive_monito_f54ec5bb.jpg";
const aiDiagnosisImg = "/assets/stock_images/honeybee_pollination_32140902.jpg";
const marketplaceImg = "/assets/stock_images/bee_pollinating_flow_74b5f0aa.jpg";
const communityImg = "/assets/stock_images/beekeeping_farmer_co_67f3b443.jpg";
const qrCodeImg = "/assets/stock_images/beautiful_beehive_ho_b4b99b83.jpg";

function useScrollAnimation() {
  return {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };
}

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const animation = useScrollAnimation();
  return (
    <motion.div
      className={className}
      initial={animation.initial}
      whileInView={animation.whileInView}
      viewport={animation.viewport}
      transition={{ ...animation.transition, delay }}
    >
      {children}
    </motion.div>
  );
}

const dashboardChartData = [
  { time: "06:00", temperature: 32, humidity: 55, activity: 45 },
  { time: "08:00", temperature: 33, humidity: 52, activity: 68 },
  { time: "10:00", temperature: 35, humidity: 48, activity: 85 },
  { time: "12:00", temperature: 36, humidity: 45, activity: 92 },
  { time: "14:00", temperature: 37, humidity: 43, activity: 88 },
  { time: "16:00", temperature: 35, humidity: 47, activity: 75 },
  { time: "18:00", temperature: 33, humidity: 52, activity: 58 },
  { time: "20:00", temperature: 31, humidity: 58, activity: 35 },
];

function MobileAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const circleScale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0.5, 3]);
  const circleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.5, 1]);
  const phoneX = useTransform(scrollYProgress, [0.1, 0.4], [-300, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.25, 0.45], [50, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 min-h-screen overflow-hidden"
    >
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax] rounded-full bg-gradient-to-br from-primary/90 via-primary/70 to-yellow-500/80"
        style={{ 
          scale: circleScale,
          opacity: circleOpacity,
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <Badge variant="default" className="mb-4 px-4 py-1.5 text-sm font-medium bg-white/20 border-white/30 text-white backdrop-blur-sm">
            <Smartphone className="h-4 w-4 mr-2" />
            NEW APP RELEASE
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            webee 모바일 앱 출시
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            언제 어디서나 벌통 상태를 확인하세요. 실시간 알림으로 중요한 순간을 놓치지 마세요.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="flex justify-center lg:justify-end order-2 lg:order-1"
            style={{ x: phoneX, opacity: phoneOpacity }}
          >
            <div className="float-animation">
              <PhoneMockup>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/30">
                  <span className="text-white font-bold text-2xl">W</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">webee</h3>
                <p className="text-white/80 text-sm text-center mb-6">스마트 수정벌 관리</p>
                <div className="space-y-3 w-full px-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-green-400/30 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">실시간 모니터링</p>
                      <p className="text-white/60 text-[10px]">벌통 상태 확인</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">AI 알림</p>
                      <p className="text-white/60 text-[10px]">즉시 푸시 알림</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/30 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">AI 상담</p>
                      <p className="text-white/60 text-[10px]">24시간 도우미</p>
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </motion.div>

          <motion.div 
            className="order-1 lg:order-2 text-center lg:text-left"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                  <Download className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">무료 다운로드</h4>
                  <p className="text-sm text-white/70">iOS, Android 모두 지원합니다</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">실시간 푸시 알림</h4>
                  <p className="text-sm text-white/70">위험 상황 즉시 알림</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">오프라인 지원</h4>
                  <p className="text-sm text-white/70">네트워크 없이도 기본 기능 사용</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-6">
              <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-sm border border-white/20" data-testid="qr-code-container">
                <Image
                  src={qrCodeImg}
                  alt="앱 다운로드 QR 코드"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-xl object-cover"
                  unoptimized
                />
                <p className="text-xs text-white/70 text-center mt-2">QR코드로 다운로드</p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 px-6 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white" data-testid="button-app-store">
                  <SiAppstore className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 leading-none">Download on the</p>
                    <p className="font-semibold text-sm">App Store</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 px-6 py-6 bg-white/10 backdrop-blur-sm border-white/30 text-white" data-testid="button-google-play">
                  <SiGoogleplay className="h-6 w-6" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 leading-none">GET IT ON</p>
                    <p className="font-semibold text-sm">Google Play</p>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const smartBeehiveFeatures = [
  {
    icon: Cpu,
    title: "CO2 센서",
    description: "벌통 내부 이산화탄소 농도를 실시간으로 측정하여 공기질을 모니터링합니다.",
    color: "from-blue-500/80 to-blue-400/40"
  },
  {
    icon: Thermometer,
    title: "온습도 센서",
    description: "벌의 활동에 최적화된 온도와 습도를 유지하기 위해 환경을 지속적으로 감시합니다.",
    color: "from-orange-500/80 to-orange-400/40"
  },
  {
    icon: Camera,
    title: "실시간 카메라",
    description: "HD 화질로 벌의 활동을 실시간으로 관찰하고 기록할 수 있습니다.",
    color: "from-green-500/80 to-green-400/40"
  },
  {
    icon: Settings,
    title: "환경 자동 조절",
    description: "센서 데이터 기반으로 환기, 온도 등 벌통 환경을 자동으로 제어합니다.",
    color: "from-purple-500/80 to-purple-400/40"
  },
  {
    icon: Eye,
    title: "AI 객체 탐지",
    description: "딥러닝 기반 실시간 객체 탐지로 벌 수 카운팅과 꽃가루 운반 분석이 가능합니다.",
    color: "from-primary/80 to-primary/40"
  }
];

function SmartBeehiveSection() {
  return (
    <section className="py-24 bg-background overflow-hidden" data-testid="section-smart-beehive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="default" className="mb-4 px-4 py-1.5 text-sm font-medium" data-testid="badge-smart-beehive">
            <Cpu className="h-4 w-4 mr-2" />
            SMART BEEHIVE
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-smart-beehive-title">
            스마트 벌통 시스템
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            IoT 센서와 AI 기술이 결합된 차세대 스마트 벌통으로<br className="hidden sm:block" />
            수정벌 관리의 새로운 기준을 경험하세요.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection delay={0.1}>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-muted/60 dark:bg-white/[0.08] backdrop-blur-xl border border-border dark:border-white/[0.12] overflow-visible flex items-center justify-center" data-testid="container-3d-viewer">
                <Beehive3DViewer className="w-full h-full" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg" data-testid="tooltip-3d-viewer">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">드래그하여 회전</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {smartBeehiveFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={0.1 + index * 0.1}>
                <div 
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/60 dark:bg-white/[0.08] backdrop-blur-xl border border-border dark:border-white/[0.12]"
                  data-testid={`card-feature-${index}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={0.6} className="mt-16">
          <div className="rounded-2xl bg-muted/60 dark:bg-white/[0.08] backdrop-blur-xl border border-border dark:border-white/[0.12] p-8 md:p-10" data-testid="container-ai-features">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div data-testid="feature-bee-counting">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">실시간 벌 수 카운팅</h4>
                <p className="text-sm text-muted-foreground">AI 객체 탐지로 벌통 내 벌의 수를 정확하게 파악합니다.</p>
              </div>
              <div data-testid="feature-pollen-analysis">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">꽃가루 운반 분석</h4>
                <p className="text-sm text-muted-foreground">벌의 꽃가루 옮김 정도를 분석하여 수정 효율을 측정합니다.</p>
              </div>
              <div data-testid="feature-anomaly-detection">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">이상 징후 자동 감지</h4>
                <p className="text-sm text-muted-foreground">환경 변화 시 자동으로 알림을 보내 사전에 대응합니다.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

const featureSlides = [
  {
    id: 1,
    title: "스마트 모니터링",
    description: "온도, 습도, 조도 등 핵심 환경 데이터를 실시간으로 모니터링하세요. AI가 분석한 최적의 환경 조건을 제안받고, 벌통 상태를 한눈에 확인할 수 있습니다.",
    image: smartMonitoringImg,
    icon: BarChart3,
    color: "from-primary/80 to-primary/40"
  },
  {
    id: 2,
    title: "AI 진단",
    description: "벌 활동량 급감, 환경 급변 시 이상 징후를 조기에 감지합니다. 72시간 전 사전 경보로 피해를 예방하고, 전문가 수준의 진단을 받아보세요.",
    image: aiDiagnosisImg,
    icon: Shield,
    color: "from-yellow-500/80 to-yellow-500/40"
  },
  {
    id: 3,
    title: "수정벌 장터",
    description: "품종별 수정벌을 간편하게 검색하고 구매 문의하세요. 신뢰할 수 있는 판매자와 직접 연결되어 최적의 가격에 양질의 수정벌을 확보할 수 있습니다.",
    image: marketplaceImg,
    icon: ShoppingBag,
    color: "from-primary/80 to-primary/40"
  },
  {
    id: 4,
    title: "커뮤니티",
    description: "농가 간 노하우를 공유하고 전문가 조언을 받으세요. 양봉 경험을 나누고, 문제 해결을 위한 집단 지성의 힘을 경험해 보세요.",
    image: communityImg,
    icon: Users,
    color: "from-yellow-500/80 to-yellow-500/40"
  }
];

function FeatureGridSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  return (
    <section className="relative bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            핵심 기능
          </h2>
          <p className="text-muted-foreground">
            webee와 함께 더 스마트한 수정벌 관리를 경험하세요
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featureSlides.map((slide) => {
            const isHovered = hoveredId === slide.id;
            
            return (
              <div 
                key={slide.id}
                className="relative"
                onMouseEnter={() => setHoveredId(slide.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`rounded-xl bg-card border border-border/50 transition-all duration-300 ${
                  isHovered ? "shadow-lg scale-105 z-10" : ""
                }`}>
                  <div className={`transition-all duration-300 overflow-hidden ${
                    isHovered ? "h-36" : "h-16"
                  }`}>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={400}
                      height={isHovered ? 144 : 64}
                      className={`w-full object-cover transition-all duration-300 ${isHovered ? "h-36" : "h-16"}`}
                      data-testid={`img-feature-${slide.id}`}
                      unoptimized
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${slide.color} flex items-center justify-center flex-shrink-0`}>
                        <slide.icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{slide.title}</h3>
                    </div>
                    <div className={`transition-all duration-300 overflow-hidden ${
                      isHovered ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Unused - keeping for potential future use
function FeatureCarouselSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasCompletedSection, setHasCompletedSection] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isTransitioning = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    
    const autoSlideInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featureSlides.length);
    }, 4000);

    return () => clearInterval(autoSlideInterval);
  }, [isPaused]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
          if (!hasCompletedSection) {
            setIsLocked(true);
          }
        } else if (!entry.isIntersecting) {
          setIsLocked(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.8, 1],
    });

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasCompletedSection]);

  useEffect(() => {
    if (!isLocked) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning.current) return;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      lastScrollTime.current = now;
      isTransitioning.current = true;

      if (e.deltaY > 0) {
        if (activeIndex < featureSlides.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else {
          setHasCompletedSection(true);
          setIsLocked(false);
        }
      } else if (e.deltaY < 0) {
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " ", "Home", "End"];
      if (!scrollKeys.includes(e.key)) return;
      
      e.preventDefault();
      
      if (isTransitioning.current) return;
      
      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      lastScrollTime.current = now;
      isTransitioning.current = true;

      const isScrollDown = ["ArrowDown", "PageDown", "Space", " "].includes(e.key);
      
      if (isScrollDown) {
        if (activeIndex < featureSlides.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else {
          setHasCompletedSection(true);
          setIsLocked(false);
        }
      } else {
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (isTransitioning.current) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        lastScrollTime.current = now;
        isTransitioning.current = true;

        if (deltaY > 0) {
          if (activeIndex < featureSlides.length - 1) {
            setActiveIndex((prev) => prev + 1);
          } else {
            setHasCompletedSection(true);
            setIsLocked(false);
          }
        } else {
          if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
          }
        }

        touchStartY = touchEndY;
        setTimeout(() => {
          isTransitioning.current = false;
        }, 600);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLocked, activeIndex]);

  const goToSlide = (index: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setActiveIndex(index);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 500);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative bg-background h-screen"
    >
      <div className="h-full flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              핵심 기능
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              webee와 함께 더 스마트한 수정벌 관리를 경험하세요
            </p>
          </AnimatedSection>

          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {featureSlides.map((slide, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className={`object-cover ${
                          slide.id === 2 ? "object-[center_30%]" :
                          slide.id === 3 ? "object-[center_40%]" : "object-center"
                        }`}
                        unoptimized
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} opacity-60`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <motion.div 
                          className="flex items-center gap-3 mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                            <slide.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white">{slide.title}</h3>
                        </motion.div>
                        <motion.p 
                          className="text-white/90 text-base md:text-lg leading-relaxed max-w-2xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          {slide.description}
                        </motion.p>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50"
              data-testid="button-carousel-prev"
              aria-label="이전 슬라이드"
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToSlide(Math.min(featureSlides.length - 1, activeIndex + 1))}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50"
              data-testid="button-carousel-next"
              aria-label="다음 슬라이드"
              disabled={activeIndex === featureSlides.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-6" role="tablist">
            {featureSlides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                data-testid={`button-carousel-dot-${index}`}
                aria-label={`${slide.title} 슬라이드로 이동`}
                aria-selected={index === activeIndex}
                role="tab"
              />
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <motion.div 
              className="flex flex-col items-center gap-1 text-muted-foreground"
              animate={{ opacity: isLocked ? 1 : 0.5 }}
            >
              <span className="text-xs tracking-widest uppercase">
                {activeIndex < featureSlides.length - 1 ? "스크롤하여 더 보기" : "계속 스크롤"}
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
          {featureSlides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-1 rounded-full cursor-pointer transition-colors duration-300 ${
                index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              animate={{ height: index === activeIndex ? 32 : 16 }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
*/

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => {
      setIsClicked(true);
    };
    const handleMouseUp = () => {
      setIsClicked(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen relative cursor-none">
      <div
        className="pointer-events-none fixed z-50 transition-all duration-150"
        style={{
          background: `radial-gradient(${isClicked ? 80 : 50}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(218, 165, 32, ${isClicked ? 0.5 : 0.35}), transparent 60%)`,
          inset: 0,
        }}
      />
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.p
              className="text-white/80 text-lg md:text-xl tracking-widest uppercase mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              AI-Powered Smart Beekeeping
            </motion.p>
            
            <motion.h1 
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
            >
              webee는{" "}
              <span className="text-yellow-400">스마트 수정벌 솔루션</span>으로
              <br />
              <span className="text-yellow-400">농업 생산성</span>을 혁신합니다
            </motion.h1>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-6 text-white/90">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">25%</p>
                  <p className="text-xs md:text-sm text-white/70">수정률 향상</p>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">72h</p>
                  <p className="text-xs md:text-sm text-white/70">사전 경보</p>
                </div>
                <div className="w-px h-12 bg-white/30" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">30%</p>
                  <p className="text-xs md:text-sm text-white/70">비용 절감</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link href="/diagnosis">
                <Button
                  size="lg"
                  className="bg-yellow-500 text-black font-semibold px-10 py-6 text-base rounded-none border-0"
                  data-testid="button-start-dashboard"
                >
                  진단 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white px-10 py-6 text-base rounded-none"
                  data-testid="button-explore-marketplace"
                >
                  거래 연결
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <span className="text-white/60 text-sm tracking-widest uppercase">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[200px_1fr] gap-12 items-start">
            <AnimatedSection>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">ABOUT US</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">우리는</h2>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  혁신적인 기술과 데이터의 융합으로<br />
                  농업 이슈를 개선하는<br />
                  <span className="text-primary">스마트 수정벌 관리 솔루션</span> 기업입니다.
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    webee는 농업 현장의 수정벌 관리 문제를 해결하기 위해 탄생한 AI 기반 플랫폼입니다.
                    IoT 센서와 인공지능 기술을 활용하여 벌통 환경을 실시간으로 모니터링하고, 
                    데이터 기반의 정확한 의사결정을 지원합니다.
                  </p>
                  <p>
                    저희는 농가와 수정벌 판매자를 연결하는 마켓플레이스를 운영하며,
                    커뮤니티를 통해 농업인들의 노하우 공유와 협력을 촉진합니다.
                    webee와 함께 더 스마트하고 효율적인 농업의 미래를 만들어가세요.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="outline" className="px-4 py-2 text-sm">#스마트농업</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm">#AI모니터링</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm">#수정벌관리</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm">#AgTech</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm">#데이터농업</Badge>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">OUR SOLUTION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Smart Pollination<br />One-Stop Solution
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="relative">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">WEBEE ONE-STOP SOLUTION</span>
              </div>

              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-border hidden md:block" />
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {[
                    { step: "STEP.1", title: "환경 모니터링", desc: "IoT 센서 설치 및 데이터 수집" },
                    { step: "STEP.2", title: "AI 분석", desc: "벌통 상태 분석 및 진단" },
                    { step: "STEP.3", title: "최적화 제안", desc: "환경 조건 최적화 가이드" },
                    { step: "STEP.4", title: "수정벌 매칭", desc: "농가-판매자 연결" },
                    { step: "STEP.5", title: "성과 관리", desc: "수확량 향상 및 리포트", isLast: true },
                  ].map((item, index) => (
                    <div key={index} className="relative flex flex-col items-center text-center">
                      <div className="w-3 h-3 rounded-full bg-primary mb-4 relative z-10" />
                      <p className="text-xs text-muted-foreground font-medium mb-1">{item.step}</p>
                      <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-sm font-semibold text-foreground">FARMER SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <FeatureGridSection />

      <SmartBeehiveSection />

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                데이터 기반의<br />정확한 의사결정
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                webee는 벌통에서 수집된 환경 데이터를 분석하여 최적의 관리 전략을 제안합니다.
                착과 리스크 예측부터 병해 조기 경보까지, AI가 여러분의 농장을 지켜드립니다.
              </p>
              
              <div className="space-y-4">
                <AnimatedSection delay={0.1}>
                  <StatItem icon={TrendingUp} label="수정률 향상" value="평균 25%" />
                </AnimatedSection>
                <AnimatedSection delay={0.2}>
                  <StatItem icon={Shield} label="병해 조기 감지" value="72시간 전 알림" />
                </AnimatedSection>
                <AnimatedSection delay={0.3}>
                  <StatItem icon={Leaf} label="비용 절감" value="연간 30%" />
                </AnimatedSection>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ShaderCard className="p-6" glowColor="rgba(107, 142, 35, 0.3)">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">실시간 환경 모니터링</h3>
                  <Badge variant="outline" className="text-xs">Live</Badge>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px"
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1} 
                        fill="url(#colorActivity)"
                        strokeWidth={2}
                        name="벌 활동량"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorTemp)"
                        strokeWidth={2}
                        name="온도 (°C)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>온도 (°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span>벌 활동량</span>
                  </div>
                </div>
              </ShaderCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <MobileAppSection />

      <section className="py-10 bg-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md">
            <AnimatedSection className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">수상 및 성과</h2>
              </div>
            </AnimatedSection>

            <div className="space-y-2">
              {[
                { date: "2025.11", title: "경산지역 AI 창업 경진대회 최우수상", highlight: true },
                { date: "2025.11", title: "멋쟁이사자 창업부트캠프 상위 15팀" },
                { date: "2025.11", title: "RISE 시제품 제작 지원 800만원" },
                { date: "2025.11", title: "부울경 로컬창업 부트캠프 150만원" },
                { date: "2025.08", title: "농림축산식품 데이터 경진대회 우수상" },
              ].map((award, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <div className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-sm ${
                    award.highlight ? "bg-accent/15 font-medium" : ""
                  }`}>
                    <Badge variant={award.highlight ? "default" : "secondary"} className="text-xs shrink-0">
                      {award.date}
                    </Badge>
                    <span className={award.highlight ? "text-foreground" : "text-muted-foreground"}>
                      {award.title}
                    </span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI 챗봇과 대화하세요
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              수정벌 관리에 대한 궁금증을 AI 도우미에게 물어보세요.
              24시간 언제든지 전문적인 답변을 받을 수 있습니다.
            </p>
          </AnimatedSection>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">수분율 예측</h3>
                    <p className="text-sm text-muted-foreground">작물별 최적의 수분 환경과 예상 수확량을 AI가 분석해 드립니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">병해충 진단</h3>
                    <p className="text-sm text-muted-foreground">증상을 설명하면 AI가 가능한 원인과 대응 방안을 제시합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">환경 최적화</h3>
                    <p className="text-sm text-muted-foreground">현재 센서 데이터를 분석하여 최적의 환경 조건을 제안합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">자유 질문</h3>
                    <p className="text-sm text-muted-foreground">수정벌 관리에 대한 모든 궁금증을 자유롭게 물어보세요.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="h-[500px] flex items-center justify-center bg-card border border-border rounded-xl">
                <p className="text-muted-foreground">챗봇 기능은 곧 추가됩니다</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ContactFormSection />

      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-foreground">webee</span>
              </div>
              <p className="text-sm text-muted-foreground">
                2024 webee. AI 기반 수정벌 관리 플랫폼
              </p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
}

const contactFormSchema = z.object({
  name: z.string().min(2, "이름은 2글자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  subject: z.string().min(1, "문의 유형을 선택해주세요"),
  message: z.string().min(10, "문의 내용은 10글자 이상이어야 합니다"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

function ContactFormSection() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.");
        form.reset();
      } else {
        alert("문의 접수 실패. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      alert("문의 접수 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            문의하기
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            궁금한 점이 있으신가요?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            webee에 대해 궁금한 점이나 제휴 문의가 있으시면 아래 양식을 통해 연락해 주세요.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection delay={0.1}>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">이메일 문의</h3>
                  <p className="text-sm text-muted-foreground mb-1">일반 문의 및 기술 지원</p>
                  <p className="text-sm font-medium text-foreground">support@webee.kr</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">전화 문의</h3>
                  <p className="text-sm text-muted-foreground mb-1">평일 09:00 - 18:00</p>
                  <p className="text-sm font-medium text-foreground">1588-0000</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">제휴 문의</h3>
                  <p className="text-sm text-muted-foreground mb-1">기업 및 단체 제휴</p>
                  <p className="text-sm font-medium text-foreground">partner@webee.kr</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름 *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="홍길동" 
                              {...field} 
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일 *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="example@email.com" 
                              {...field} 
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>연락처</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="010-1234-5678" 
                              {...field} 
                              data-testid="input-contact-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>문의 유형 *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-contact-subject">
                                <SelectValue placeholder="선택해주세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general" data-testid="select-option-general">일반 문의</SelectItem>
                              <SelectItem value="marketplace" data-testid="select-option-marketplace">장터 관련</SelectItem>
                              <SelectItem value="partnership" data-testid="select-option-partnership">제휴 문의</SelectItem>
                              <SelectItem value="support" data-testid="select-option-support">기술 지원</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>문의 내용 *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="문의하실 내용을 자세히 적어주세요."
                            className="min-h-[120px] resize-none"
                            {...field} 
                            data-testid="input-contact-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    data-testid="button-contact-submit"
                  >
                    {isSubmitting ? (
                      "전송 중..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        문의 보내기
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
