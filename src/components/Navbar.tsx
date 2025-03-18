import { useAuthStore } from "@/store/useAuthStore";
import { LogoAndAppName } from "./LogoAndAppName";
import { Link, useLocation } from "react-router-dom";
import {
  AUTHENTICATED_NAV_ITEMS,
  UNAUTHENTICATED_NAV_ITEMS,
} from "@/constants/NavItems";
import { LogoutNavBtn } from "./LogoutNavBtn";

type NavLinkProps = {
  path: string;
  name: string;
  icon: React.ReactNode;
};
export function NavLink({ path, name, icon }: NavLinkProps) {
  return (
    <Link to={path} className="btn btn-sm gap-2 transition-colors">
      {icon}
      <span className="hidden sm:inline">{name}</span>
    </Link>
  );
}

export function Navbar() {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-41 backgrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <LogoAndAppName />
          <nav className="flex items-center gap-2">
            {authUser ? (
              <>
                {AUTHENTICATED_NAV_ITEMS.map((n) => (
                  <NavLink key={n.path} {...n} />
                ))}
                <LogoutNavBtn />
              </>
            ) : (
              UNAUTHENTICATED_NAV_ITEMS.map((n) =>
                pathname != n.path ? <NavLink key={n.path} {...n} /> : null
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
