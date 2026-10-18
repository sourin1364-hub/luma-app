import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/700.css";

import "./i18n";
import "./index.css";
import App from "./App.tsx";

const particlesInit = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ParticlesProvider init={particlesInit}>
      <App />
    </ParticlesProvider>
  </StrictMode>,
);