export const unprotectedRoutes = ["/auth/login", "/auth/signup"];

export function needToAccessAuthRoutes(
  pathname: string,
  authenticated: boolean
) {
  return authenticated && unprotectedRoutes.includes(pathname.slice(1));
}
