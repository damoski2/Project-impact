"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Splitting from "splitting";

export default function TextSplitting() {
  const titleRef = useRef(null);

  useEffect(() => {
    Splitting();

    const title: any = titleRef.current;
    if (!title) return;

    const chars = title.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        xPercent: () => gsap.utils.random(-200, 200),
        yPercent: () => gsap.utils.random(-150, 150),
      },
      {
        ease: "power1.inOut",
        opacity: 1,
        xPercent: 0,
        yPercent: 0,
        stagger: { each: 0.05, grid: "auto", from: "random" },
        scrollTrigger: {
          trigger: title,
          start: "bottom bottom+=10%",
          end: "bottom top",
          scrub: 0.4,
        },
      }
    );
  }, []);

  return (
    <div className="content">
      <h1
        ref={titleRef}
        className="text-[90px] leading-[70px] text-white sm:text-[140px] sm:leading-[120px] md:text-[200px] md:leading-[180px] lg:text-[240px] lg:leading-[220px] xl:text-[328.1px] xl:leading-[301.86px] content__title"
        data-splitting
        data-effect5
      >
        <span className="font-7 uppercase">Project</span> <br />
        <span className="font-6 uppercase">Impact</span>
      </h1>
    </div>
  );
}
