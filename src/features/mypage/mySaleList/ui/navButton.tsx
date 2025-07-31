import React, { memo } from "react";

interface NavigationButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}

export const NavigationButton = memo<NavigationButtonProps>(
  ({ direction, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="absolute top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all z-10"
      style={{ [direction === "prev" ? "left" : "right"]: "8px" }}
      aria-label={`${direction === "prev" ? "이전" : "다음"} 상품 보기`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  )
);

NavigationButton.displayName = "NavigationButton";
