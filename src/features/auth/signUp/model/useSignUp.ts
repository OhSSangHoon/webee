"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signUp } from "@/shared/auth/api";
import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export type SignUpFormValues = {
  username: string;
  name: string;
  password: string;
  passwordConfirm: string;
};

const schema = yup.object({
  username: yup.string().required("아이디를 입력해주세요."),
  name: yup.string().required("이름을 입력해주세요."),
  password: yup
    .string()
    .required("비밀번호를 입력해주세요.")
    .min(6, "6자 이상 입력해주세요.")
    .matches(/[a-z]/, "소문자를 포함해야 합니다.")
    .matches(/\d/, "숫자를 포함해야 합니다."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인이 필요합니다."),
});

export function useSignUpForm() {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { username, password, name } = data;
    try {
      setLoading(true);
      await signUp({ username, password, name });
      setLoading(false);
      router.push("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ?? "회원가입에 실패했습니다.";
      setSignUpError(errorMessage);
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    signUpError,
    loading,
  };
}