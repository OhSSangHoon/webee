"use client";
import { useSignUpForm } from "../model/useSignUp";

export default function SignUp() {
  const { register, handleSubmit, errors, signUpError, loading } =
    useSignUpForm();

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
          role="form"
          aria-label="회원가입 폼"
        >
          {/* 아이디 */}
          <div className="flex flex-col w-full">
            <label htmlFor="username" className="auth-label">아이디</label>
            <input 
              id="username"
              {...register("username")} 
              className="auth-input w-full"
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-red-500 text-sm" role="alert">{errors.username?.message}</p>
            )}
          </div>

          {/* 이름 */}
          <div className="flex flex-col">
            <label htmlFor="name" className="auth-label">이름</label>
            <input 
              id="name"
              {...register("name")} 
              className="auth-input"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm" role="alert">{errors.name?.message}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col">
            <label htmlFor="password" className="auth-label ">비밀번호</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="auth-input"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm" role="alert">{errors.password?.message}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col">
            <label htmlFor="passwordConfirm" className="auth-label">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              type="password"
              {...register("passwordConfirm")}
              className="auth-input mb-5"
              aria-describedby={errors.passwordConfirm ? "passwordConfirm-error" : undefined}
            />
            {errors.passwordConfirm && (
              <p id="passwordConfirm-error" className="text-red-500 text-sm" role="alert">
                {errors.passwordConfirm?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="blue-button w-full "
            disabled={loading}
            aria-label={loading ? "회원가입 진행 중" : "회원가입 버튼"}
          >
            {loading ? "로딩 중" : "회원가입"}
          </button>
          {signUpError && (
            <div className=" text-red-500 text-sm " role="alert">{signUpError}</div>
          )}
        </form>
      </div>
    </div>
  );
}