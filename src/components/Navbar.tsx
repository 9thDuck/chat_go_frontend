import { useAuthStore } from "@/store/useAuthStore";
import { LogoAndAppName } from "./LogoAndAppName";
import { Link, useLocation } from "react-router-dom";
import {
  AUTHENTICATED_NAV_ITEMS,
  UNAUTHENTICATED_NAV_ITEMS,
} from "@/constants/NavItems";
import { LogoutNavBtn } from "./LogoutNavBtn";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

type NavLinkProps = {
  path: string;
  name: string;
  icon: React.ReactNode;
};

export function NavLink({ path, name, icon }: NavLinkProps) {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      className="btn btn-sm gap-2 hover:bg-base-200 active:bg-base-300 text-base-content/80 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-current={path === pathname ? "page" : undefined}
    >
      {icon}
      <span className="hidden sm:inline">{name}</span>
    </Link>
  );
}

export function MobileNavMenu() {
  const { pathname } = useLocation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn btn-sm btn-ghost sm:hidden">
          <Menu className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {UNAUTHENTICATED_NAV_ITEMS.map(
          (item) =>
            pathname !== item.path && (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className="w-full">
                  {item.name}
                </Link>
              </DropdownMenuItem>
            )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { authUser } = useAuthStore();
  const { pathname } = useLocation();
  return (
    <header className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-41 backdrop-blur-lg">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16">
        <div className="flex items-center justify-between h-full">
          <LogoAndAppName />
          <nav className="flex items-center gap-2">
            <ThemeSwitcher />
            {authUser ? (
              <>
                {AUTHENTICATED_NAV_ITEMS.map((n) => (
                  <NavLink key={n.path} {...n} />
                ))}
                <LogoutNavBtn />
              </>
            ) : (
              <>
                <div className="hidden sm:flex gap-2">
                  {UNAUTHENTICATED_NAV_ITEMS.map((n) =>
                    pathname !== n.path ? <NavLink key={n.path} {...n} /> : null
                  )}
                </div>
                <MobileNavMenu />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
