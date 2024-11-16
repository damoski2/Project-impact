"use client";

import { useState, useRef, useEffect } from "react";
import { gsap, ScrollTrigger, SplitType } from "@/lib/gsap";
import { ballColors } from "@/constants/index";
import { useGSAP } from "@gsap/react";
import Matter from "matter-js";
import Two from "two.js";

import {
  lineAnimationWithStaggerOnScroll,
  fadeFromRight,
} from "@/lib/gsap/animationFunctions";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import dynamic from 'next/dynamic';

// Dynamically import the TextSplitting component with no SSR
const TextSplitting = dynamic(() => import('../components/TextSplitting'), { ssr: false });

const returnBulletSizeBasedOnScreenSize = (): number => {
  // Check if window is defined
  if (typeof window === "undefined") return 172; // Default size for SSR

  if (window.innerWidth < 640) {
    return 72;
  } else if (window.innerWidth < 768 && window.innerWidth >= 640) {
    return 100;
  } else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
    return 120;
  } else if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
    return 172;
  } else if (window.innerWidth < 1536) {
    return 172;
  } else {
    return 172;
  }
};



const MIN_NUMBER = 0;
const MAX_NUMBER = 132;

// Update BULLET_SIZE initialization
const BULLET_SIZE = typeof window !== "undefined" ? returnBulletSizeBasedOnScreenSize() : 172;

export default function Home() {
  const containerRef: any = useRef(null);
  const scaleCircleRef: any = useRef(null);
  const twoRef: any = useRef(null);
  const engineRef: any = useRef(null);
  const mouseConstraintRef: any = useRef(null);
  const entitiesRef: any = useRef([]);
  const prevNumberRef: any = useRef(0);
  const canvasRef: any = useRef(null);

  const [loaderPercentage, setLoaderPercentage] = useState(0);
  const [ballColorsArr, setBallColorsArr] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const getRandomColor = () => {
    return ballColors[Math.floor(Math.random() * ballColors.length)];
  };

  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize Matter.js and Two.js
  useEffect(() => {
    if (!containerRef.current || dimensions.width === 0) return;

    // Set up Two.js
    twoRef.current = new Two({
      type: Two.Types.canvas,
      width: dimensions.width,
      height: dimensions.height,
      autostart: true,
    }).appendTo(containerRef.current);

    // Set up Matter.js
    engineRef.current = Matter.Engine.create({
      //enableSleeping: false, 
    });
    engineRef.current.world.gravity.y = 0.5;

    
    const bounds = {
      thickness: BULLET_SIZE,
      properties: {
        isStatic: true,
        //render: { visible: false }, // Make bounds invisible
      },
    };

    const ground = Matter.Bodies.rectangle(
      dimensions.width / 2,
      dimensions.height + BULLET_SIZE / 2,
      dimensions.width,
      bounds.thickness,
      bounds.properties
    );

    const leftWall = Matter.Bodies.rectangle(
      -BULLET_SIZE / 2,
      dimensions.height / 2,
      bounds.thickness,
      dimensions.height,
      bounds.properties
    );

    const rightWall = Matter.Bodies.rectangle(
      dimensions.width + BULLET_SIZE / 2,
      dimensions.height / 2,
      bounds.thickness,
      dimensions.height,
      bounds.properties
    );

    Matter.World.add(engineRef.current.world, [ground, leftWall, rightWall]);

    // Set up mouse interaction
    const mouse: any = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.8,
        //render: { visible: false },
      },
    });

    mouseConstraintRef.current = mouseConstraint;
    Matter.World.add(engineRef.current.world, mouseConstraintRef.current);

    // Scale mouse position based on canvas size
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Update loop
    const update = () => {
      Matter.Engine.update(engineRef.current);
      entitiesRef.current.forEach((entity: any) => {
        if (entity.group) {
          entity.group.position.set(entity.position.x, entity.position.y);
          entity.group.rotation = entity.angle;
        }
      });
    };

    twoRef.current.bind("update", update);

    return () => {
      twoRef.current.unbind("update", update);
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);

      twoRef.current = null;
      engineRef.current = null;
    };
  }, [dimensions]);

  // Add new bullet
  const addBullet = (color: string) => {
    if (!twoRef.current || !engineRef.current) return;

    const group: any = new Two.Group();
    const circle = new Two.Circle(0, 0, BULLET_SIZE / 2);
    circle.fill = color;
    circle.noStroke();

    const x =
      Math.random() * (dimensions.width - BULLET_SIZE) + BULLET_SIZE / 2;
    const entity: any = Matter.Bodies.circle(
      x,
      -BULLET_SIZE / 2,
      BULLET_SIZE / 2,
      {
        restitution: 0.6,
        friction: 0.1,
        density: 0.002,
        mass: 1,
        frictionAir: 0.001,
      }
    );

    group.add(circle);
    group.entity = entity;
    entity.group = group;

    twoRef.current.add(group);
    Matter.World.add(engineRef.current.world, entity);
    entitiesRef.current.push(entity);
  };

  useGSAP(() => {
    gsap.from(scaleCircleRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power2.out",
    });

    gsap.set(scaleCircleRef.current, {
      scale: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#counter-section",
        pin: true,
        start: "top top",
        end: "+=100%",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentNumber = Math.floor(
            MIN_NUMBER + (MAX_NUMBER - MIN_NUMBER) * progress
          );
          setLoaderPercentage(currentNumber);

          if (
            currentNumber > prevNumberRef.current &&
            currentNumber <= MAX_NUMBER
          ) {
            const newColor = getRandomColor();
            setBallColorsArr((prev) => [...prev, newColor]);
            if (currentNumber <= 35) {
              addBullet(newColor);
            }
            prevNumberRef.current = currentNumber;
          }
        },
      },
    });

    tl.to(
      scaleCircleRef.current,
      {
        scale: 15,
        duration: 1,
        ease: "none",
      },
      0
    );

    lineAnimationWithStaggerOnScroll(".fadeTextPara");
    fadeFromRight(".fadeTextHeading");

    return () => {
      tl.kill();
    };
  }, [dimensions]);

 

 

  return (
    <main className="relative">
      <div
        id="counter-section"
        className="bg-background min-h-screen w-full min-w-screen flex relative overflow-hidden md:px-8 px-5"
      >
        <div ref={containerRef} className="w-full h-full z-[20]" />
        <div
          ref={scaleCircleRef}
          className="bg-[#AE9AB0] w-[329px] h-[329px] absolute bottom-0 left-0 rounded-full opacity-[0.2] transform-gpu"
          style={{ transformOrigin: "center center" }}
        />

        <div className="absolute top-1/2 left-[200px] sm:left-[490px] md:left-[700px] lg:left-[900px] xl:left-[1150px] -translate-x-1/2 -translate-y-1/2 z-20 sm:w-[453px] w-full md:px-8 px-5">
          <h1 className="text-[90px] leading-[70px] sm:text-[140px] sm:leading-[120px] md:text-[200px] md:leading-[180px] lg:text-[240px] lg:leading-[220px] xl:text-[328.1px] xl:leading-[301.86px] fadeTextHeading">
            {loaderPercentage}
          </h1>
          <p className="mt-4 text-[16px] sm:text-[20px] md:text-[28px] lg:text-[34px] xl:text-[39.12px] leading-[35.99px] font-semibold fadeTextPara">
            projects creating impact for people and the planet
          </p>
        </div>
      </div>
      <div
        className="sm:px-10 px-5 md:h-[100vh] h-[60vh] relative w-full bg-[#9367FF] z-[30]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative md:h-[calc(100vh+100vh)] h-[calc(100vh+60vh)] md:-top-[100vh] -top-[60vh]">
          <div className=" sticky md:h-[100vh] h-[60vh] md:top-[calc(100vh-100vh)] top-[calc(100vh-60vh)] flex justify-center items-center">
            <TextSplitting />
          </div>
        </div>
      </div>
    </main>
  );
}
