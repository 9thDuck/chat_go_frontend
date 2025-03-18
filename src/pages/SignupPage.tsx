import { FormInputWrapper } from "@/components/FormInputWrapper";
import { useNavgiateToHomeIfLoggedIn } from "@/components/NavigateToHomeIfLoggedIn";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/duck.svg";
import { useSignup } from "@/hooks/useSignup";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { lazy, Suspense } from "react";
import { DUCK_CAROUESL_SLIDES as DUCK_CAROUSEL_SLIDES } from "@/constants/DuckCarousel";

const AnimatedHeroCarousel = lazy(() =>
  import("@/components/Hero").then((module) => ({
    default: module.AnimatedHeroCarousel,
  }))
);

const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(8, "Username must be at least 8 characters long")
      .max(30, "Username must not be more than 30 characters long"),
    email: z
      .string()
      .email("Invalid email address")
      .max(150, "Email must not be more than 150 characters long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must not be more than 20 characters long"),
    confirmPassword: z.string(),
    showPassword: z.boolean().default(false),
    showConfirmPassword: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signupFormSchema>;

const SignupPage = () => {
  useNavgiateToHomeIfLoggedIn();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: formErrors,
  } = useForm<SignUpFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    },
    resolver: zodResolver(signupFormSchema),
  });
  const { removeAuthUser } = useAuthStore();

  const { mutate, isPending } = useSignup();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpFormData> = (formData) => {
    mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          navigate("/login");
          toast.success(`Please login into your shiny new account`);
        },
        onError: (err) => {
          removeAuthUser();
          if (err instanceof AxiosError) {
            toast.error(err?.response?.data?.error);
          } else {
            toast.error("Something went wrong, please try again later");
          }
          console.log(err);
        },
      }
    );
  };

  const showPasswordValue = watch("showPassword");
  const showConfirmPasswordValue = watch("showConfirmPassword");

  const togglePasswordVisibility = () => {
    setValue("showPassword", !showPasswordValue);
  };

  const toggleConfirmPasswordVisibility = () => {
    setValue("showConfirmPassword", !showConfirmPasswordValue);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LHS */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <Suspense
          fallback={<div className="animate-pulse skeleton w-full h-full" />}
        >
          <AnimatedHeroCarousel slides={DUCK_CAROUSEL_SLIDES} />
        </Suspense>
      </div>
      {/* RHS */}
      <div className="flex flex-col justify-center items-center-p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 mx-auto">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {/* <img src={logoMinimal} className="size-6 text-primary" />
                <img src={logoColorful} className="size-6 text-primary" />
                <img src={logoOutlined} className="size-6 text-primary" />
                <img src={logoAnimated} className="size-6 text-primary" /> */}
                <img src={logo} className="size-20 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInputWrapper
              icon={<User className="size-5 text-base-content/40" />}
              id="username"
              labelText="Username"
              errorMsg={formErrors.errors.username?.message ?? ""}
              inputElement={
                <input
                  id="username"
                  placeholder="MrQuack"
                  className="input input-bordered w-full pl-10"
                  {...register("username")}
                />
              }
            />
            <FormInputWrapper
              id="email"
              labelText="Email"
              icon={<Mail className="size-5 text-base-content/40" />}
              errorMsg={formErrors.errors.email?.message ?? ""}
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
              errorMsg={formErrors.errors.password?.message ?? ""}
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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
            <FormInputWrapper
              id="confirmPassword"
              labelText="Confirm Password"
              errorMsg={formErrors.errors.confirmPassword?.message ?? ""}
              icon={<Lock className="size-5 text-base-content/40" />}
              inputElement={
                <>
                  <input
                    id="confirmPassword"
                    placeholder="********"
                    className="input input-bordered w-full pl-10"
                    type={showConfirmPasswordValue ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPasswordValue ? (
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
                <div className="loading-md loading-ring"></div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="mx-auto">
              Already have an account?{" "}
              <Link to="/login" className="link-secondary">
                Login
              </Link>
              &nbsp;instead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
