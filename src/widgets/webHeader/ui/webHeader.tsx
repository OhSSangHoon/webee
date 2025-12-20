'use client';

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function WebHeader() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.85;
      setIsScrolled(window.scrollY > heroHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = pathname === '/';
  const showScrolledStyle = isLandingPage && isScrolled;

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const iconTextClass = isLandingPage && !isScrolled
    ? "text-white transition-colors duration-300"
    : "text-foreground transition-colors duration-300";

  const hoverBgClass = isLandingPage && !isScrolled
    ? "hover:bg-white/10"
    : "hover:bg-muted";

  const navHeight = showScrolledStyle ? "h-[96px]" : "h-[72px]";
  const navBackground = isLandingPage
    ? (isScrolled ? "bg-white dark:bg-zinc-900 shadow-sm" : "bg-transparent")
    : "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-border";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navHeight} ${navBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        <div className={`flex items-center justify-between flex-1 gap-4 ${showScrolledStyle ? "pb-3" : ""}`}>
          {/* 로고 */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isLandingPage && !isScrolled
                  ? "bg-white/20 backdrop-blur-sm border border-white/30"
                  : "bg-primary"
              }`}>
                <span className={`font-bold text-lg transition-colors duration-300 ${
                  isLandingPage && !isScrolled ? "text-white" : "text-primary-foreground"
                }`}>W</span>
              </div>
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                isLandingPage && !isScrolled ? "text-white drop-shadow-md" : "text-foreground"
              }`}>webee</span>
            </Link>
          </div>

          {/* 네비게이션 및 다크모드 토글 */}
          <div className="flex items-center gap-2">
            <Link href="/home">
              <Button
                variant="ghost"
                className={`${iconTextClass} ${hoverBgClass} font-semibold`}
                data-testid="button-app-link"
              >
                App
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className={`${iconTextClass} ${hoverBgClass}`}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {showScrolledStyle && (
          <div className="w-full h-px bg-border" />
        )}
      </div>
    </header>
  );
}
