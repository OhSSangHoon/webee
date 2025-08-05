"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "@/shared/auth/api";
import { useRouter } from "next/navigation";

type SignInFormValues = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required("아이디를 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});

export function useSignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const router = useRouter();
  const onSubmit = async (data: SignInFormValues) => {
    try {
      await signIn(data);
      router.push("/ ");
    } catch (error) {
      setError("password", {
        message: "로그인에 실패했습니다.",
      });
      console.log("로그인 실패:", error);
    }
  };

  const handleTestSubmit = async () => {
    const data = { username: "test123", password: "qwe123!@#" };
    await onSubmit(data);
  };

  return {
    register,
    handleSubmit,
    handleTestSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
