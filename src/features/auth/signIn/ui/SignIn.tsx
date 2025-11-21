"use client";

import { useRouter } from "next/navigation";
import { useSignInForm } from "../model/useSignIn";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    handleTestSubmit,
    errors,
    isSubmitting,
    onSubmit,
  } = useSignInForm();
  const router = useRouter();

  return (
    <div className="relative h-150 px-4 overflow-hidden <div bg-[radial-gradient(circle,_#e6a647_5%,_#eadab7_40%,_#f6f1e6_60%,_#ffffff_100%)]">
      {/* 글래스모피즘 박스 */}
      <div
        className="relative z-10 max-w-[355px] p-6 rounded-2xl
      bg-[#6f4f1c]/10 backdrop-blur-[18px] border-2 border-white/30
      shadow-inner shadow-[#70930597]/10 drop-shadow-lg flex flex-col gap-4
      overflow-hidden"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-main-800 text-center text-shadow-2xs">
          로그인
        </h1>
        <p className="text-main-900 text-sm sm:text-base text-center ">
          다시 오신 걸 환영합니다! <br />
          아이디와 비밀번호를 입력해주세요.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          {/* 아이디 */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="username"
              className="text-main-900 font-medium text-sm"
            >
              아이디
            </label>
            <input
              id="username"
              type="text"
              className="rounded-md p-2"
              {...register("username")}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-600 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="password"
              className="text-main-900 font-medium text-sm"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className=" rounded-md p-2"
              {...register("password")}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex w-full gap-2 pt-2">
            <button
              type="button"
              className="flex-1 py-2 rounded-md bg-white/20 text-white border border-white/20
                         backdrop-blur-sm hover:bg-white/30 transition-all"
              onClick={() => router.push("/signUp")}
            >
              회원가입
            </button>
            <button
              type="submit"
              className="flex-2 py-2 rounded-md bg-white/40 text-black border border-white/20
                         backdrop-blur-sm hover:bg-white/50 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="w-full flex justify-end mt-2">
          <button
            className="text-white/60 underline hover:text-white text-xs"
            onClick={handleTestSubmit}
          >
            테스트 계정으로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
