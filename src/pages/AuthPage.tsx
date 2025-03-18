import { DUCK_CAROUSEL_SLIDES } from "@/constants/DuckCarousel";
import { Suspense } from "react";
import { AnimatedHeroCarousel } from "../components/Hero";
import { Outlet } from "react-router-dom";
import { useNavgiateToHomeIfLoggedIn } from "@/components/NavigateToHomeIfLoggedIn";

export function AuthPage() {
  useNavgiateToHomeIfLoggedIn();
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 min-h-1/2 lg:h-full">
        <Suspense
          fallback={
            <div className="block animate-pulse skeleton w-full min-h-1/2 lg:h-full" />
          }
        >
          <AnimatedHeroCarousel autoplay slides={DUCK_CAROUSEL_SLIDES} />
        </Suspense>
      </div>
      <Outlet />
    </div>
  );
}
