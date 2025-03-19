import { Input } from "./Input";
import { PasswordInput } from "./PasswordInput";
import { AuthCard } from "./AuthCard";
import { AuthLink } from "./AuthLink";
import { IconWrapper } from "./IconWrapper";
import { Lock, Mail, User } from "lucide-react";
import { useNavgiateToHomeIfLoggedIn } from "@/components/NavigateToHomeIfLoggedIn";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "@/hooks/useSignup";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { ECIES_CONFIG, PrivateKey } from "eciesjs";

// Configure ECIES before using
ECIES_CONFIG.ellipticCurve = "x25519";
ECIES_CONFIG.symmetricAlgorithm = "xchacha20";

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
    handleSubmit,
    formState: { errors: formErrors, isDirty },
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

  const onSubmit: SubmitHandler<SignUpFormData> = async (formData) => {
    console.time("keygen");
    const sk = new PrivateKey();
    console.log("sk", sk.secret);
    mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        public_key: sk.publicKey.toHex(),
      },
      {
        onSuccess: async () => {
          navigate("/auth/login");
          toast.success(`Please login into your shiny new account`);
        },
        onError: (err) => {
          removeAuthUser();
          if (err instanceof AxiosError) {
            toast.error(err?.response?.data?.error);
          } else {
            toast.error("Something went wrong, please try again later");
          }
        },
      }
    );
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Get started with your free account"
      formContent={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="username"
            label="Username"
            icon={
              <IconWrapper>
                <User />
              </IconWrapper>
            }
            placeholder="MrQuack"
            error={formErrors.username?.message}
            {...register("username")}
          />
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
            error={formErrors.email?.message}
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
            error={formErrors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            icon={
              <IconWrapper>
                <Lock />
              </IconWrapper>
            }
            placeholder="********"
            error={formErrors.confirmPassword?.message}
            {...register("confirmPassword")}
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
          Already have an account? <AuthLink to="/auth/login">Login</AuthLink>
          &nbsp;instead
        </p>
      }
    />
  );
};

export default SignupPage;
