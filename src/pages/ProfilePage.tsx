import { FormInputWrapper } from "@/components/FormInputWrapper";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { AxiosError } from "axios";

const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(30, "First name must not be more than 30 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(30, "Last name must not be more than 30 characters"),
  profile_pic: z.string().default(""),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: authUser?.firstname ?? "",
      last_name: authUser?.lastname ?? "",
      profile_pic: authUser?.profilepic ?? "",
    },
    resolver: zodResolver(profileFormSchema),
  });

  const { mutate, isPending } = useUpdateUser(authUser?.id || 0);

  const onSubmit: SubmitHandler<ProfileFormData> = (formData) => {
    mutate(
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile_pic: formData.profile_pic,
      },
      {
        onSuccess: (res) => {
          setAuthUser(res.data.data);
          toast.success("Profile updated successfully");
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data.message);
          }
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 min-h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] p-4 sm:p-8 border-base-300 border-2 rounded-lg mx-auto">
        <div className="w-full space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="avatar placeholder flex justify-center items-center">
                <div className="bg-neutral text-neutral-content rounded-full w-24">
                  {authUser?.profilepic ? (
                    <img
                      src={authUser.profilepic}
                      alt={`${authUser.username}'s profile`}
                    />
                  ) : (
                    <UserIcon className="w-12 h-12" />
                  )}
                </div>
              </div>
              <h1 className="text-2xl font-bold mt-4 text-base-content">
                Profile Settings
              </h1>
              <p className="text-base-content/70 text-sm sm:text-base">
                Update your profile information
              </p>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-4 w-full">
            <div className="flex flex-col gap-4 w-full">
              <h3 className="text-lg font-medium mb-2 mx-auto">
                Account Information
              </h3>
              <div className="space-y-2 w-full">
                <p className="flex justify-between w-full">
                  <span className="font-medium ">Username:</span>{" "}
                  {authUser?.username}
                </p>
                <p className="flex justify-between w-full">
                  <span className="font-medium">Email:</span> {authUser?.email}
                </p>
                <p className="flex justify-between w-full">
                  <span className="font-medium">Role:</span>{" "}
                  {authUser?.role.name}
                </p>
              </div>
            </div>

            <div className="divider" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInputWrapper
                id="first_name"
                labelText="First Name"
                icon={<User className="size-5 text-base-content/40" />}
                errorMsg={errors.first_name?.message ?? ""}
                inputElement={
                  <input
                    id="first_name"
                    placeholder="John"
                    className="input input-bordered w-full pl-10"
                    {...register("first_name")}
                  />
                }
              />

              <FormInputWrapper
                id="last_name"
                labelText="Last Name"
                icon={<User className="size-5 text-base-content/40" />}
                errorMsg={errors.last_name?.message ?? ""}
                inputElement={
                  <input
                    id="last_name"
                    placeholder="Doe"
                    className="input input-bordered w-full pl-10"
                    {...register("last_name")}
                  />
                }
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending || !isDirty}
              >
                {isPending ? (
                  <div className="loading-md loading-ring" />
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
