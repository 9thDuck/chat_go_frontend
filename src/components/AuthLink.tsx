import { Link } from "react-router-dom";

export function AuthLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="link inline-block rounded-sm text-primary transition-all duration-300 hover:text-primary/80 hover:underline"
    >
      {children}
    </Link>
  );
}
