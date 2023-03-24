const defaultColors = require('tailwindcss/colors')

/**
 * @param {string} hex 
 */
const toRGB = (hex) => {
  const red = parseInt(hex[1] + hex[2], 16);
  const green = parseInt(hex[3] + hex[4], 16);
  const blue = parseInt(hex[5] + hex[6], 16);
  return { red, green, blue };
};

/**
 * @param {string} color
 * @param {string} bg
 * @param {number} opacity
 */
const opacity = (color, bg, opacity) => {
  const foreground = toRGB(color);
  const background = toRGB(bg);

  const red = Math.round(
    foreground.red * opacity + background.red * (1 - opacity)
  );
  const green = Math.round(
    foreground.green * opacity + background.green * (1 - opacity)
  );
  const blue = Math.round(
    foreground.blue * opacity + background.blue * (1 - opacity)
  );

  /**
   * @param {number} num
   */
  const toHexString = (num) => num.toString(16).padStart(2, "0");

  return "#" + toHexString(red) + toHexString(green) + toHexString(blue);
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    colors: {
      uno: {
        1: "#d6e9ff",
        2: "#abb2bf",
        3: "#6e88a6",
        4: "#55606d",
      },
      duo: {
        1: "#c8ae9d",
        2: "#e06c75",
        3: "#dd672c",
      },
      dark: {
        1: "#282c34",
        2: opacity("#282c34", "#000000", 0.75),
        3: opacity("#282c34", "#000000", 0.5),
        4: opacity("#282c34", "#000000", 0.25),
      },
      light: {
        1: "#FAF8F5",
        2: opacity("#FAF8F5", "#ffffff", 0.5),
        3: opacity("#FAF8F5", "#ffffff", 0.25),
        4: opacity("#FAF8F5", "#ffffff", 0.25),
      },
      purple: defaultColors.purple,
      white: "#abb2bf",
    },
    extend: {},
  },
  plugins: [],
}
