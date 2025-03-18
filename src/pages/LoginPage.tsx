import { FormInputWrapper } from "@/components/FormInputWrapper";
import { useNavgiateToHomeIfLoggedIn } from "@/components/NavigateToHomeIfLoggedIn";
import { useLogin } from "@/hooks/useLogin";
import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import logoMinimal from "@/assets/logo-minimal.svg";
import logoColorful from "@/assets/logo-colorful.svg";
import logoOutlined from "@/assets/logo-outlined.svg";
import logoAnimated from "@/assets/logo-animated.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

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
  useNavgiateToHomeIfLoggedIn();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useLogin();
  const { setAuthUser } = useAuthStore();

  const onSubmit: SubmitHandler<LoginFormData> = (formData) => {
    mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (res) => {
          const user = res.data.data;
          toast.success(`Welcome to DuckChat, ${user.username}`);
          setAuthUser(user);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const showPasswordValue = watch("showPassword");

  const togglePasswordVisibility = () => {
    setValue("showPassword", !showPasswordValue);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LHS */}
      <div className="flex flex-col justify-center items-center-p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img src={logoMinimal} className="size-6 text-primary" />
                <img src={logoColorful} className="size-6 text-primary" />
                <img src={logoOutlined} className="size-6 text-primary" />
                <img src={logoAnimated} className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputWrapper
              id="email"
              labelText="Email"
              icon={<Mail className="size-5 text-base-content/40" />}
              errorMsg={errors.email?.message ?? ""}
              inputElement={
                <input
                  id="email"
                  placeholder="yourmail@site.com"
                  className="input input-bordered w-full pl-10"
                  type="email"
                  {...register("email")}
                />
              }
            />
            <FormInputWrapper
              id="password"
              labelText="Password"
              icon={<Lock className="size-5 text-base-content/40" />}
              errorMsg={errors.password?.message ?? ""}
              inputElement={
                <>
                  <input
                    id="password"
                    placeholder="********"
                    className="input input-bordered w-full pl-10"
                    type={showPasswordValue ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPasswordValue ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </>
              }
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <div className="loader-md loading-ring" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
          <div>
            <p className="mx-auto text-center">
              Wanna create an account?{" "}
              <Link to="/signup" className="link-secondary">
                Signup
              </Link>
              &nbsp;instead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
