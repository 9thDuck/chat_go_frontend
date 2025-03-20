import { DUCK_CAROUSEL_SLIDES } from "@/constants/DuckCarousel";
import { Suspense } from "react";
import { AnimatedHeroCarousel } from "../components/Hero";
import { Outlet } from "react-router-dom";

export function AuthPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] w-full">
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-12 md:min-w-1/2">
        <div className="w-full max-w-4xl lg:max-w-5xl space-y-6 sm:space-y-8 self-center rounded-md p-4 sm:p-6 md:p-8">
          <Suspense
            fallback={
              <div className="block animate-pulse skeleton w-full min-h-1/2 lg:h-full" />
            }
          >
            <AnimatedHeroCarousel autoplay slides={DUCK_CAROUSEL_SLIDES} />
          </Suspense>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
