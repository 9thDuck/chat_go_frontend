import { Input } from "./Input";
import { PasswordInput } from "./PasswordInput";
import { AuthCard } from "./AuthCard";
import { AuthLink } from "./AuthLink";
import { IconWrapper } from "./IconWrapper";
import { Lock, Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { useAuthStore } from "@/store/useAuthStore";

const loginFormSchema = z.object({
  email: z
    .string()
    .email()
    .max(150, "Email must not be more than 150 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not be more than 20 characters long"),
  showPassword: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useLogin();
  const { authUser, setAuthUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit: SubmitHandler<LoginFormData> = (formData) => {
    mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (res) => {
          toast.success(`Welcome to DuckChat, ${res.data.data.username}`);
          setAuthUser(res.data.data);
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthCard
      title="Login"
      subtitle="It's nice to see you again"
      formContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email"
            icon={
              <IconWrapper>
                <Mail />
              </IconWrapper>
            }
            placeholder="yourmail@site.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            id="password"
            label="Password"
            icon={
              <IconWrapper>
                <Lock />
              </IconWrapper>
            }
            placeholder="********"
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending || !isDirty}
          >
            {isPending ? (
              <div className="loading loading-ring loading-md" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      }
      footer={
        <p className="text-center">
          Wanna create an account? <AuthLink to="/auth/signup">Signup</AuthLink>
          &nbsp;instead
        </p>
      }
    />
  );
};

export default LoginPage;
