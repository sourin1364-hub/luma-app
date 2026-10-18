import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import type { Element } from "../../lib/astrology";

interface ElementBackgroundProps {
  element: Element;
}

export function ElementBackground({ element }: ElementBackgroundProps) {
  const options: ISourceOptions = useMemo(() => {
    const baseConfig: ISourceOptions = {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true, width: 800, height: 800 } },
        opacity: { value: { min: 0.1, max: 0.5 } },
        size: { value: { min: 2, max: 6 } },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
      },
      detectRetina: true,
    };

    switch (element) {
      case "water":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: { value: 80 },
            opacity: { value: { min: 0.2, max: 0.6 } },
            size: { value: { min: 4, max: 10 } },
            paint: { color: { value: ["#2E6FB7", "#5B9BD5", "#00BFFF", "#1E90FF"] } },
            shape: { type: "circle" },
            // This creates the "wave/fluid" network effect
            links: {
              enable: true,
              distance: 120,
              color: "#5B9BD5",
              opacity: 0.3,
              width: 1,
            },
            // This makes particles wobble like liquid droplets
            wobble: {
              enable: true,
              distance: 15,
              speed: 2,
            },
            move: {
              ...baseConfig.particles?.move,
              speed: 1.2,
              direction: "bottom",
            },
          },
        };
      case "fire":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: { value: 60 },
            paint: { color: { value: ["#C2613B", "#E8855E", "#8B3E1F", "#FFD700", "#FF4500"] } },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 8 } },
            move: { ...baseConfig.particles?.move, speed: 2.5, direction: "top" },
            opacity: { value: { min: 0.2, max: 0.8 } },
          },
        };
      case "earth":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: { value: 40 },
            paint: { color: { value: ["#5C8A4A", "#7FAD6A", "#3D5C2F"] } },
            shape: { type: "circle" },
            move: { ...baseConfig.particles?.move, speed: 0.5 },
            size: { value: { min: 6, max: 12 } },
          },
        };
      case "air":
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: { value: 100 },
            paint: { color: { value: ["#6FA8DC", "#E8EEF5", "#FFFFFF"] } },
            shape: { type: "circle" },
            move: { ...baseConfig.particles?.move, speed: 3, direction: "right" },
            size: { value: { min: 1, max: 3 } },
            opacity: { value: { min: 0.1, max: 0.4 } },
          },
        };
      default:
        return baseConfig;
    }
  }, [element]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Particles id="tsparticles" options={options} className="w-full h-full" />
    </div>
  );
}