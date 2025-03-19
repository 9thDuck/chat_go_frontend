import logo from "@/assets/duck.svg";

type AuthCardProps = {
  title: string;
  subtitle: string;
  formContent: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({
  title,
  subtitle,
  formContent,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8 self-center card shadow-md rounded-md bg-base-200/30 p-4 sm:p-8 border-2 border-base-300">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <img src={logo} className="size-20 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-base-content">
              {title}
            </h1>
            <p className="text-base-content/70 text-sm sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>
        {formContent}
        <div>{footer}</div>
      </div>
    </div>
  );
}
