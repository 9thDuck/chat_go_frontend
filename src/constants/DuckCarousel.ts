import duckPic1 from "@/assets/duck-lake.jpeg";
import duckPic2 from "@/assets/ducks-in-row-in-lake.jpeg";
import duckPic3 from "@/assets/ducks-random-in-lake.jpeg";
import duckPic4 from "@/assets/single-duck-in-water-causing-ripples.jpeg";
import { CarouselSlide } from "@/components/Hero";

export const DUCK_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    image: duckPic1,
    title: "Simple & Secure",
    description:
      "Your messages, your control. No data hoarding, just pure privacy-focused communication.",
  },
  {
    image: duckPic2,
    title: "True Data Ownership",
    description:
      "When you delete something, it's gone forever. No soft deletes, no hidden traces.",
  },
  {
    image: duckPic3,
    title: "Open Source",
    description:
      "Fully transparent and community-driven. Your privacy is our code.",
  },
  {
    image: duckPic4,
    title: "Privacy First",
    description:
      "End-to-end encryption and complete data control in your hands.",
  },
];
