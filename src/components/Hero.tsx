import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export type CarouselSlide = {
  image: string;
  title: string;
  description: string;
};

export const AnimatedHeroCarousel = ({
  slides,
  autoplay = false,
}: {
  slides: CarouselSlide[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="relative grid grid-cols-1 gap-4 sm:gap-8 md:gap-12 lg:gap-16">
        <div className="relative h-48 sm:h-64 md:h-96 lg:h-[450px] w-full">
          <AnimatePresence>
            {slides.map((slide, index) => (
              <motion.div
                key={slide.image}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 40 : slides.length + 2 - index,
                  y: isActive(index) ? [0, -40, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom flex items-center justify-center p-4"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  draggable={false}
                  className="object-contain max-h-full w-auto max-w-full lg:max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%]"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col justify-center py-4 px-4 sm:px-6 md:px-8">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="text-center sm:text-left flex flex-col items-center justify-center"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {slides[active].title}
            </h3>
            <motion.p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-base-content/80">
              {slides[active].description.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: 0.025 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex justify-center items-center gap-4 pt-6 sm:pt-8 md:pt-10">
            <button
              onClick={handlePrev}
              className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-base-200 hover:bg-base-300 transition-colors hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-base-content transition-transform duration-300 group-hover/button:rotate-12" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-base-200 hover:bg-base-300 transition-colors hover:shadow-md transition-shadow duration-300"
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-base-content transition-transform duration-300 group-hover/button:-rotate-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
