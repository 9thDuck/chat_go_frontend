import { Link } from "react-router-dom";
import logo from "@/assets/duck.svg";

export function LogoAndAppName() {
  return (
    <div className="flex items-center gap-8">
      <Link
        to="/"
        className="flex items-center gap-2.5 hover:opacity-80 transition-all"
      >
        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <img src={logo} className="size-9 text-primary" />
        </div>
        <h1 className="text-lg font-bold">DuckChat</h1>
      </Link>
    </div>
  );
}
