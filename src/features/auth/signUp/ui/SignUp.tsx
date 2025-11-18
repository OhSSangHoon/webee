"use client";
import Image from "next/image";
import { useSignUpForm } from "../model/useSignUp";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { register, handleSubmit, errors, signUpError, loading } =
    useSignUpForm();

  const router = useRouter();

  return (
    <div className="relative h-215 px-4  overflow-hidden bg-[radial-gradient(circle,_#e6a647_5%,_#eadab7_40%,_#f6f1e6_60%,_#ffffff_100%)] ">
      {/* 글래스모피즘 박스 */}
      <div
        className="relative z-10 max-w-[355px] p-6 rounded-2xl
           bg-[#6f4f1c]/10 backdrop-blur-[18px] border-2 border-white/30
           shadow-inner shadow-[#70930597]/10 drop-shadow-lg flex flex-col gap-4
           overflow-hidden mt-20"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-main-800 text-center text-shadow-2xs">
          회원가입
        </h1>
        <p className="text-main-900 text-sm sm:text-base text-center">
          위비에 오신 것을 환영합니다! <br />
          꿀벌과 함께 성장하는 특별한 하루를 시작해요.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full"
          role="form"
          aria-label="회원가입 폼"
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
              {...register("username")}
              className="bg-white/30 text-white placeholder-white/60 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-400 text-xs mt-1">
                {errors.username?.message}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="text-main-900 font-medium text-sm">
              이름
            </label>
            <input
              id="name"
              {...register("name")}
              className="bg-white/30 text-white placeholder-white/60 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-400 text-xs mt-1">
                {errors.name?.message}
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
              {...register("password")}
              className="bg-white/30 text-white placeholder-white/60 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-400 text-xs mt-1">
                {errors.password?.message}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="passwordConfirm"
              className="text-main-900 font-medium text-sm"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              {...register("passwordConfirm")}
              className="bg-white/30 text-white placeholder-white/60 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-describedby={
                errors.passwordConfirm ? "passwordConfirm-error" : undefined
              }
            />
            {errors.passwordConfirm && (
              <p
                id="passwordConfirm-error"
                className="text-red-400 text-xs mt-1"
              >
                {errors.passwordConfirm?.message}
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex w-full gap-2 pt-2">
            <button
              type="button"
              className="flex-1 py-2 rounded-md bg-white/20 text-white border border-white/20
                       backdrop-blur-sm hover:bg-white/30 transition-all"
              onClick={() => router.push("/signIn")}
            >
              로그인
            </button>
            <button
              type="submit"
              className="flex-2 py-2 rounded-md bg-white/40 text-black border border-white/20
                       backdrop-blur-sm hover:bg-white/50 transition-all"
              disabled={loading}
            >
              {loading ? "로딩 중..." : "회원가입"}
            </button>
          </div>

          {signUpError && (
            <div className="text-red-400 text-xs mt-2" role="alert">
              {signUpError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
