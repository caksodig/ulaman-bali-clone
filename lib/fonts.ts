import localFont from "next/font/local";

// BODY FONT: Basis Grotesque Pro
export const basisGrotesque = localFont({
  src: [
    {
      path: "../public/fonts/BasisGrotesquePro.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BasisGrotesquePro.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-basis",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

// HEADING FONT: Americana
export const americana = localFont({
  src: [
    {
      path: "../public/fonts/Americana.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Americana.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-americana",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

export const fonts = {
  americana,
  basisGrotesque,
};

export function getFontClasses() {
  return `${americana.variable} ${basisGrotesque.variable}`;
}
