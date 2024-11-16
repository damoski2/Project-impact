import { gsap, CustomEase, ScrollTrigger } from "./index";
import SplitType from "split-type";



const lineAnimationWithStaggerOnScroll = (selector: string) => {
  CustomEase.create("customBounceEase", "M0,0 C0.68,-0.25 0.32,1.25 1,1");

  const split: any = new SplitType(selector, {
    types: "lines",
    lineClass: "lineChildren",
  });

  split.lines.forEach((line: any) => {
    const wrapper = document.createElement("div");
    wrapper.style.lineHeight = "42px"
    wrapper.classList.add("lineParent");
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.from(split.lines, {
    duration: 1,
    y: 200,
    stagger: 0.2,
    ease: "customBounceEase",
    scrollTrigger: {
      trigger: selector,
      start: "top 90%",
    },
  });
};


const fadeFromRight = (selector: string) => {
  gsap.from(selector, {
    x: 32,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    scrollTrigger: {
      trigger: selector,
      start: "top 90%",
    },
  });
}



export {
 
  lineAnimationWithStaggerOnScroll,
  fadeFromRight
};
