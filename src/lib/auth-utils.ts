export const unprotectedRoutes = ["login", "signup"];

export function needToAccessAuthRoutes(
  pathname: string,
  authenticated: boolean
) {
  return authenticated && unprotectedRoutes.includes(pathname.slice(1));
}
