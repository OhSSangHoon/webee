import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Stethoscope, Newspaper, Bug } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface HeaderDropdownProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function HeaderDropdown({ isOpen, onOpenChange, children }: HeaderDropdownProps) {
  const handleItemClick = () => {
    onOpenChange(false);
  };

  // 드롭다운이 열릴 때 스크롤 비활성화 (스크롤바는 유지)
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (isOpen) {
      // 스크롤 이벤트를 막음 (스크롤바는 유지)
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
          e.preventDefault();
        }
      });
    } else {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isOpen]);

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      <DropdownMenu open={isOpen} onOpenChange={onOpenChange} modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[375px] z-50 bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200"
          alignOffset={-25}
        >
          <DropdownMenuItem asChild onClick={handleItemClick}>
            <Link href="/recommend" className="flex items-center gap-3 py-3 px-4 font-medium text-gray-800 hover:bg-yellow-50">
              <Heart className="h-5 w-5 text-red-500" />
              <span>수정벌추천</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={handleItemClick}>
            <Link href="/diagnosis" className="flex items-center gap-3 py-3 px-4 font-medium text-gray-800 hover:bg-yellow-50">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <span>질병진단</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={handleItemClick}>
            <Link href="/news" className="flex items-center gap-3 py-3 px-4 font-medium text-gray-800 hover:bg-yellow-50">
              <Newspaper className="h-5 w-5 text-green-500" />
              <span>수정벌뉴스</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={handleItemClick}>
            <Link href="/pesticide" className="flex items-center gap-3 py-3 px-4 font-medium text-gray-800 hover:bg-yellow-50">
              <Bug className="h-5 w-5 text-purple-500" />
              <span>농약정보</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}