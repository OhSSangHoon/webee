"use client";
import { useSignUpForm } from "./model/useSignUp";

export default function SignUp() {
  const { register, handleSubmit, errors, signUpError } = useSignUpForm();

  return (
    <div className="flex flex-col h-screen items-center justify-center min-h-[calc(100vh-400px)]">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-5xl font-extrabold mb-5">회원가입</h1>
        <p className="text-gray-custom mb-10">
          위비에 오신 것을 환영합니다! <br />
          회원가입 시, 수정벌 관리 기능을 지속적으로 모니터링 할 수 있어요!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4  w-full max-w-[400px]"
        >
          {/* 아이디 */}
          <div className="flex flex-col w-full">
            <label className="auth-label">아이디</label>
            <input {...register("username")} className="auth-input w-full" />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          {/* 이름 */}
          <div className="flex flex-col">
            <label className="auth-label">이름</label>
            <input {...register("name")} className="auth-input" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col">
            <label className="auth-label ">비밀번호</label>
            <input
              type="password"
              {...register("password")}
              className="auth-input"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col">
            <label className="auth-label">비밀번호 확인</label>
            <input
              type="password"
              {...register("passwordConfirm")}
              className="auth-input mb-5"
            />
            <p className="text-red-500 text-sm">
              {errors.passwordConfirm?.message}
            </p>
          </div>

          <button type="submit" className="blue-button w-full ">
            회원가입
          </button>
          <div className=" text-red-500 text-sm ">{signUpError}</div>
        </form>
      </div>
    </div>
  );
}
