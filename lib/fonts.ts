// import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";

// // PRIMARY FONT: Inter for body text
// // Optimized: Only load weights you need
// export const inter = Inter({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-inter",
//   display: "swap",
//   preload: true,
//   fallback: ["system-ui", "arial"],
// });

// // DISPLAY FONT: Playfair Display for headings
// export const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "900"],
//   variable: "--font-playfair",
//   display: "swap",
//   preload: true,
//   fallback: ["Georgia", "serif"],
//   style: ["normal", "italic"],
// });

// // ALTERNATIVE: Cormorant Garamond (more elegant, closer to Ulaman style)
// export const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-cormorant",
//   display: "swap",
//   preload: true,
//   fallback: ["Georgia", "serif"],
//   style: ["normal", "italic"],
// });

// // Export all fonts for easy import
// export const fonts = {
//   inter,
//   playfair,
//   cormorant,
// };

// // Helper function to get font class names
// export function getFontClasses() {
//   return `${inter.variable} ${playfair.variable} ${cormorant.variable}`;
// }

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
