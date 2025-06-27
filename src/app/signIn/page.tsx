"use client";

import { useRouter } from "next/router";
import { useSignInForm } from "./model/useSignIn";

export default function SignIn() {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } =
    useSignInForm();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-550px)] w-full ">
      <div className="flex flex-col items-start justify-center w-full max-w-[400px]">
        <h1 className="text-5xl font-extrabold mb-5">로그인</h1>
        <p className="text-gray-custom mb-10">
          다시 오신 걸 환영합니다! <br />
          아이디와 비밀번호를 입력해주세요.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-full"
        >
          {/* 아이디 */}
          <div className="flex flex-col w-full ">
            <label className="auth-label">아이디</label>
            <input
              type="text"
              className="auth-input w-full"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col">
            <label className="auth-label">비밀번호</label>
            <input
              type="password"
              className="auth-input"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="w-full flex space-x-2 pt-5">
            <button
              type="button"
              className="basis-[30%] h-[38px] bg-white text-gray-800 rounded-md border border-[#d8d8d8] hover:bg-gray-100"
              onClick={() => router.push("/signUp")}
            >
              회원가입
            </button>
            <button
              type="submit"
              className="blue-button basis-[70%]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
